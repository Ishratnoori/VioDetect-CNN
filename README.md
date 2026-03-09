# VioDetect-CNN

VioDetect-CNN is an **AI-powered violence detection system** that combines a **TensorFlow ResNet50-based CNN backend** with a **modern React + Vite + Tailwind + shadcn/ui** frontend.

It can analyze **uploaded videos** and **live webcam feeds** to determine if a scene is **violent or non‑violent**, and classify it into one of **14 crime‑related categories**.

---

## Features

- **Deep Learning Violence Detection**
  - ResNet50-based CNN trained on **14 classes**:
    - `Abuse`, `Arrest`, `Arson`, `Assault`, `Burglary`, `Explosion`,
      `Fighting`, `NormalVideos`, `RoadAccidents`, `Robbery`, `Shooting`,
      `Shoplifting`, `Stealing`, `Vandalism`
  - Model file: `backend/best_cnn_model.h5`
  - Smart post-processing:
    - For videos: averages predictions across 30 frames
    - Favors `NormalVideos` when its score is reasonably high to reduce false alarms

- **Two Detection Modes**
  - **Upload Video Analysis**
    - Upload a full video file
    - Backend extracts ~30 evenly spaced frames
    - Runs CNN inference per frame and averages probabilities
    - Returns:
      - `Primary Prediction`: `Violent` / `Non‑Violent`
      - `Detected Category`: one of the 14 dataset classes
      - `Confidence Score`: probability (0–1)
  - **Live Webcam Detection**
    - Uses browser `getUserMedia` API
    - Continuously captures frames, sends them to `/predict-frame`
    - Applies **majority vote smoothing** over last 10 frame labels
    - Returns smoothed live result:
      - `Primary Prediction`: `Violent` / `Non‑Violent`
      - `Detected Category`: smoothed class
      - `Confidence Score`: live confidence
    - UI shows **binary Threat Level**: `VIOLENT` (red) or `NON‑VIOLENT` (green)

- **Modern AI Surveillance Dashboard UI**
  - Dark, cyber‑security‑inspired theme (`#0f172a` base, neon cyan accent `#22d3ee`)
  - Glassmorphism cards, subtle gradients, glowing borders
  - Top navigation:
    - `About`, `Features`, `How It Works`, `Tech Stack`, `Dashboard`
  - **Dashboard**
    - Split layout:
      - Left: Upload Video card with drag‑and‑drop + progress state
      - Right: Live Detection panel with webcam preview
    - Global metrics:
      - Latency, Model, Resolution, Threat Level
    - Crime categories grid highlighting current detected class

---

## Tech Stack

### Backend

- Python 3.10
- Flask + Flask-CORS
- TensorFlow / Keras (ResNet50 backbone)
- OpenCV
- NumPy
- PIL

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui components
- lucide-react icons
- React Router
- TanStack React Query

---

## Project Structure

```text
backend/
  app.py
  best_cnn_model.h5
  requirements.txt

src/
  App.tsx
  main.tsx
  pages/
    Index.tsx
    Dashboard.tsx
    NotFound.tsx
  components/
    landing/
      HeroSection.tsx
      AboutSection.tsx
      FeaturesSection.tsx
      HowItWorksSection.tsx
      CrimeTypesSection.tsx
      TechStackSection.tsx
      Footer.tsx
    dashboard/
      LiveDetection.tsx
    layout/
      AppBackground.tsx
      TopNav.tsx
    ui/
      glass-card.tsx
      (shadcn/ui primitives)
  lib/
    utils.ts  (cn helper)
public/
  ...

vite.config.ts
tailwind.config.ts
tsconfig.json
eslint.config.js
```

---

## Getting Started

### Prerequisites

- **Python 3.10**
- **Node.js 18+**
- npm / yarn / pnpm

---

## Backend Setup (Flask + TensorFlow)

From the project root:

```bash
cd backend
```

Create and activate a virtual environment (Windows PowerShell):

```bash
py -3.10 -m venv venv
venv\Scripts\activate
```

Install dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Run the backend server:

```bash
python app.py
```

By default it runs on `http://localhost:5000`.

### Backend Endpoints

#### `GET /`

Simple health check:

```json
{
  "status": "active",
  "message": "VioDetect Sentinel API is running. Use /predict for analysis."
}
```

#### `POST /predict` — Upload Video Analysis

- **Input**: `multipart/form-data` with key `file` (video file)
- **Processing**:
  - Saves video to temp file
  - Extracts ~30 evenly spaced frames
  - Preprocesses frames with ResNet50 `preprocess_input`
  - Runs `model.predict` on all frames
  - Averages predictions across frames
  - Applies refinement:
    - If a violent class has moderate probability but `NormalVideos` score is sufficiently high, may flip prediction to `NormalVideos` to reduce false positives
- **Output**:

```json
{
  "Primary Prediction": "Violent" | "Non-Violent",
  "Detected Category": "Fighting",
  "Confidence Score": 0.87
}
```

> **Note:** This pipeline is the canonical 14-class classifier and is not modified by live-specific logic.

#### `POST /predict-frame` — Live Frame Detection

- **Input**: JSON

```json
{
  "image": "data:image/jpeg;base64,...."
}
```

- **Processing**:
  - Decodes base64 frame
  - Preprocesses and runs `model.predict` for the single frame
  - Applies per-frame `NormalVideos` refinement
  - Appends the frame label to a `deque(maxlen=10)`
  - Uses `collections.Counter` to take the **most common label** over last 10 frames (majority vote)
- **Output** (per call):

```json
{
  "Primary Prediction": "Violent" | "Non-Violent",
  "Detected Category": "<smoothed_class_name>",
  "Confidence Score": 0.82
}
```

The frontend uses this to show a smoothed **Threat Level** indicator.

---

## Frontend Setup (React + Vite)

From the project root:

```bash
npm install
# or
yarn
# or
pnpm install
```

Run the dev server:

```bash
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

---

## Using the Dashboard

1. **Ensure backend is running** on `http://localhost:5000` (`python app.py` in `backend/`).
2. **Start the frontend** (`npm run dev` in the root).
3. Open the dashboard in the browser and choose a mode:

### 1. Upload Video Analysis

- Go to the **Dashboard** page.
- In the **Video Upload** panel:
  - Drag & drop a video, or click to select.
  - Wait for the analysis to complete.
- You will see:
  - **Primary Prediction**: `Violent` / `Non‑Violent`
  - **Detected Category** (one of the 14 dataset classes)
  - **Confidence Score** as a percentage.

### 2. Live Webcam Detection

- On the **Dashboard** page, in the **Live Detection** panel:
  - Click **Start Live Detection** and grant webcam permission.
  - The video feed appears with overlays.
- Live panel shows:
  - **Threat Level: VIOLENT** (red) or **Threat Level: NON‑VIOLENT** (green),
  - A binary interpretation of the predicted class:
    - `NormalVideos` → `NON‑VIOLENT`
    - Any other class (`Abuse`, `Robbery`, etc.) → `VIOLENT`
- Backend performs majority-vote smoothing over the last 10 frames to keep the threat indicator stable.

---

## Design & UX

- **Theme**:
  - Dark background (`#0f172a`) with neon cyan accents (`#22d3ee`)
  - Subtle gradients, glass cards, and glow rings
- **Layout**:
  - **Landing**: Hero, About, Features, How It Works, Crime Types, Tech Stack
  - **Dashboard**:
    - Left: Upload card
    - Right: Live detection panel
    - Bottom: Crime category grid & metrics

---

## Future Improvements

- Persist detection logs (timestamped events)
- Role-based access control for multi-camera deployments
- Deploy backend as a containerized microservice
- Add configurable thresholds per environment (e.g., high-security vs public areas)

---

## License

This project is provided for **research and educational purposes**.  
Please ensure compliance with local laws and organizational policies when deploying surveillance systems.
