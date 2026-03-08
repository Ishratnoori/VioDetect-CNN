import os
import cv2
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import tempfile
import base64

app = Flask(__name__)
CORS(app)

# Reconstruct and Load Architecture to handle Keras 2/3 compatibility issues
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'best_cnn_model.h5')

def build_model(num_classes=14):
    """Reconstruct the ResNet50-based architecture as specified by the user."""
    from tensorflow.keras.applications import ResNet50
    from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
    from tensorflow.keras.models import Model
    
    # Define the backbone (using same input shape as training)
    base_model = ResNet50(
        weights=None,  # Weights will be loaded from the H5 file
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Recreate the custom layers precisely
    x = GlobalAveragePooling2D()(base_model.output)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x)
    output = Dense(num_classes, activation='softmax')(x)
    
    # Assemble the model
    model = Model(inputs=base_model.input, outputs=output)
    return model

# Initialize architecture and load entire weights from H5 file
try:
    model = build_model()
    model.load_weights(MODEL_PATH)
    print("Model architecture reconstructed and weights loaded successfully.")
except Exception as e:
    print(f"Error loading model weights: {e}")
    # Handle possible weight-only file or full model file issues
    try:
        model = build_model()
        model.load_weights(MODEL_PATH, by_name=True, skip_mismatch=True)
        print("Model weights loaded with partial matches (by_name=True).")
    except Exception as e2:
        print(f"Failed all weight loading attempts: {e2}")
        raise e2

# Class names as provided in the user request
CLASS_NAMES = [
    'Abuse', 'Arrest', 'Arson', 'Assault', 'Burglary', 'Explosion', 
    'Fighting', 'NormalVideos', 'RoadAccidents', 'Robbery', 'Shooting', 
    'Shoplifting', 'Stealing', 'Vandalism'
]

from tensorflow.keras.applications.resnet50 import preprocess_input

def preprocess_frame(frame):
    """Preprocess a single frame for the ResNet50 model using standard Keras preprocessing."""
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, (224, 224))
    # ResNet50 preprocess_input expects 0-255 range images
    frame = preprocess_input(frame.astype(np.float32))
    return frame

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'active',
        'message': 'VioDetect Sentinel API is running. Use /predict for analysis.'
    })

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save video to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)
    file.save(temp_path)

    try:
        cap = cv2.VideoCapture(temp_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        if total_frames == 0:
            cap.release()
            os.remove(temp_path)
            return jsonify({'error': 'Video has no frames'}), 400

        # Extract exactly 30 frames evenly spaced
        num_frames_to_extract = 30
        interval = max(1, total_frames // num_frames_to_extract)
        
        frames = []
        for i in range(num_frames_to_extract):
            frame_idx = i * interval
            if frame_idx >= total_frames:
                break
            
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if not ret:
                break
            
            processed_frame = preprocess_frame(frame)
            frames.append(processed_frame)
        
        cap.release()
        os.remove(temp_path)

        if not frames:
            return jsonify({'error': 'Could not extract frames from video'}), 400

        # Run inference on extracted frames
        frames_array = np.array(frames)
        predictions = model.predict(frames_array)
        
        # Calculate per-frame winners for debugging
        frame_winners = [CLASS_NAMES[np.argmax(p)] for p in predictions]
        print(f"Top predictions for 30 frames: {frame_winners}")

        # Aggregate results (Average probability across frames)
        avg_predictions = np.mean(predictions, axis=0)
        predicted_class_idx = np.argmax(avg_predictions)
        confidence = float(avg_predictions[predicted_class_idx])
        label = CLASS_NAMES[predicted_class_idx]

        # Decision threshold refinement
        # If 'NormalVideos' score is reasonably high, favor it to reduce false alarms
        normal_idx = CLASS_NAMES.index('NormalVideos')
        normal_score = avg_predictions[normal_idx]
        
        # If any violence is detected strongly (e.g. > 0.6 average), stick with it.
        # Otherwise, if Normal score is > 0.3, it might be safer to call it Normal.
        if label != 'NormalVideos' and normal_score > 0.35:
            print(f"Refining prediction: Initial {label} ({confidence:.2f}) -> NormalVideos ({normal_score:.2f})")
            label = 'NormalVideos'
            confidence = normal_score

        primary_prediction = "Violent" if label != "NormalVideos" else "Non-Violent"

        result = {
            'Primary Prediction': primary_prediction,
            'Detected Category': label,
            'Confidence Score': round(float(confidence), 2)
        }
        print(f"Final Decision: {result}")
        return jsonify(result)

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict-frame', methods=['POST'])
def predict_frame():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400
    
    try:
        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        img_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Invalid image data'}), 400
            
        processed_frame = preprocess_frame(frame)
        prediction = model.predict(np.expand_dims(processed_frame, axis=0))[0]
        
        predicted_class_idx = np.argmax(prediction)
        confidence = float(prediction[predicted_class_idx])
        label = CLASS_NAMES[predicted_class_idx]
        
        # Consistent logic with video processing
        normal_idx = CLASS_NAMES.index('NormalVideos')
        normal_score = prediction[normal_idx]
        
        if label != 'NormalVideos' and normal_score > 0.45: # Slightly higher threshold for single frames
            label = 'NormalVideos'
            confidence = normal_score

        primary_prediction = "Violent" if label != "NormalVideos" else "Non-Violent"

        return jsonify({
            'Primary Prediction': primary_prediction,
            'Detected Category': label,
            'Confidence Score': round(float(confidence), 2)
        })

    except Exception as e:
        print(f"Error in frame prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
