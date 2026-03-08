# VioDetect-CNN

**VioDetect-CNN** is an end-to-end **AI-powered violence detection system** that combines a **TensorFlow ResNet50-based CNN backend** with a **modern React + Vite + shadcn/ui frontend**.

The system analyzes **uploaded videos and live webcam frames** to classify scenes as **Violent** or **Non-Violent**, while identifying specific categories such as **Assault, Robbery, Road Accidents, and more**.

---

# Features

## Deep Learning Backend

- **ResNet50-based CNN model**
- Trained on **14 crime-related categories**

```
Abuse
Arrest
Arson
Assault
Burglary
Explosion
Fighting
NormalVideos
RoadAccidents
Robbery
Shooting
Shoplifting
Stealing
Vandalism
```

- TensorFlow / Keras model loaded from:

```
backend/best_cnn_model.h5
```

- Smart post-processing reduces false alarms by prioritizing **NormalVideos** when confidence is high.

---

## REST API (Flask)

| Endpoint | Method | Description |
|--------|--------|--------|
| `/` | GET | API health check |
| `/predict` | POST | Analyze uploaded video |
| `/predict-frame` | POST | Analyze a single frame (live detection) |

### Video Prediction

- Extracts **30 evenly spaced frames**
- Runs CNN inference
- Returns **average prediction**

### Live Frame Prediction

- Accepts **base64 encoded image**
- Used for **real-time webcam monitoring**

---

# Modern Web Frontend

Built with:

- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react icons
- React Router
- TanStack React Query

### Pages

| Page | Route | Purpose |
|-----|------|------|
| Landing Page | `/` | Overview of system |
| Dashboard | `/dashboard` | Live violence detection |
| Not Found | `*` | 404 page |

---

# Live Webcam Detection

The dashboard uses the browser **getUserMedia API** to access the webcam.

Workflow:

1. User opens **Dashboard**
2. Clicks **Start Live Detection**
3. Browser captures frames
4. Frames are sent to backend API
5. Prediction results update the UI

Displayed Information:

- **Primary Prediction:** Violent / Non-Violent  
- **Detected Category**  
- **Confidence Score**

---

# Project Structure

```
backend/
  app.py
  best_cnn_model.h5
  requirements.txt

src/
  App.tsx
  pages/
    Index.tsx
    Dashboard.tsx
    NotFound.tsx

  components/
    dashboard/LiveDetection.tsx
    landing/
    ui/

  hooks/
  lib/

public/

vite.config.ts
tailwind.config.ts
eslint.config.js
tsconfig.json
```

---

# Getting Started

## Prerequisites

Install:

- **Python 3.10**
- **Node.js 18+**
- **npm / yarn / pnpm**

---

# Backend Setup (Flask + TensorFlow)

Open a terminal inside the **backend folder**.

```bash
cd backend
```

Create virtual environment:

```bash
py -3.10 -m venv venv
```

Activate environment:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
python app.py
```

Backend will start at:

```
http://localhost:5000
```

---

# Frontend Setup (React + Vite)

Open another terminal in the **project root folder**.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

Pages:

```
Landing Page   → /
Dashboard      → /dashboard
```

⚠️ Make sure the **backend server is running** before using live detection.

---









# Future Improvements

- Authentication & role-based access
- Detection history & alert logging
- Multi-camera CCTV support

---
