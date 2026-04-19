<div align="center">
  <img src="frontend/public/placeholder-logo.svg" alt="DermaScanAI Logo" width="120" />
  <h1>🩺 DermaScanAI: Skin Disease Detection</h1>
  <p>An Advanced, AI-Powered Web Application for Instant Skin Condition Analysis</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-FF6F00?style=for-the-badge&logo=tensorflow)](https://tensorflow.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](#)
</div>

---

## 🌟 Project Overview

**DermaScanAI** is a robust, full-stack web application that brings accessible, AI-powered skin condition analysis directly to users. By simply uploading a photo of a skin concern, the system provides an instant AI prediction alongside actionable health guidance. 

To bridge the gap between "black-box" AI and clinical transparency, DermaScanAI incorporates **Grad-CAM visual explanations**, highlighting the exact regions of the image that led to the prediction. Furthermore, it integrates a privacy-first localized geospatial API to recommend nearby dermatologists for professional follow-up.

---

## 🚀 Key Features

- 🧠 **AI-Powered Skin Analysis:** Leverages a pre-trained TensorFlow model to predict skin conditions (*Melanoma*, *Eczema*, *Melanocytic Nevi*). Uses **Temperature Scaling** for confidence calibration to avoid overconfident misdiagnoses.
- 🔬 **Clinical Explainability (Grad-CAM):** Generates heatmaps (overlaying the original image) representing exactly *why* the AI made its prediction. Crucial for cases flagged as "urgent" or "uncertain".
- 🛡️ **AI Refusal & Safety Mode:** Automatically refuses to provide a firm diagnosis if the AI's confidence falls below rigorous thresholds, directing users to professional medical help instead.
- 📍 **Geolocation Doctor Finder:** Utilizes the OpenStreetMap (Overpass API) to securely find dermatologists within a 5km radius based on the user's coordinates.
- 🔒 **Secure User Authentication & History:** Token-based JWT authentication allows tracking past scan histories seamlessly while keeping user images and personal data private.

---

## 🏗️ Architecture & Tech Stack

### Frontend Ecosystem
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript 5.7.3
- **UI & Styling:** Tailwind CSS 4.2.0, Radix UI Primitives, shadcn/ui
- **Forms & Data:** React Hook Form, Zod (Schema Validation), Recharts

### Backend Ecosystem
- **Framework:** FastAPI (Python)
- **Machine Learning:** TensorFlow / Keras 
- **Image Processing:** OpenCV (`cv2`), Pillow (PIL)
- **Database:** SQLite with SQLAlchemy ORM
- **External Integration:** Overpass API (OpenStreetMap) for geolocation

---

## 📂 Project Structure

```text
DermaScanAI/
├── backend/                       # FastAPI based Python Backend
│   ├── app/                       # Application Core
│   │   ├── main.py                # FastAPI Entry point & Router aggregation
│   │   ├── routes.py              # Core API Endpoints (/predict, /history)
│   │   ├── auth.py                # JWT Auth, User registration & Sessions
│   │   ├── database.py            # SQLAlchemy Connection & Config
│   │   ├── models.py              # Database Schemas (User, History)
│   │   ├── model_loader.py        # In-memory TF/Keras Model initialization
│   │   ├── gradcam.py             # Feature map extraction & Heatmap Logic
│   │   ├── location.py            # Overpass API geospatial logic
│   │   └── utils.py               # Medical guidance & Helpers
│   ├── audits/heatmaps/           # Generated Grad-CAM overlay audit trail
│   ├── models/                    # Stored ML Models (trained_model.keras/.h5)
│   ├── src/                       # Source scripts (e.g., predict.py)
│   ├── uploads/                   # User-specific categorized image uploads
│   ├── requirements.txt           # Python backend dependencies
│   └── skin_app.db                # SQLite database file
└── frontend/                      # Next.js React Frontend
    ├── app/                       # Next.js App Router Structure
    │   ├── page.tsx               # Main Landing Page
    │   ├── login/, register/      # Authentication routing
    │   ├── history/               # Protected user history route
    │   └── layout.tsx             # Root layout and Providers
    ├── components/                # React Modular Components
    │   ├── ui/                    # Reusable shadcn/ui Primitives
    │   ├── skin-upload.tsx        # Drag & Drop image widget
    │   ├── prediction-result.tsx  # Diagnosis, GradCAM rendering
    │   └── nearby-doctors.tsx     # Map display and Doctor List rendering
    ├── hooks/                     # Custom React Hooks
    ├── lib/                       # Utility Functions
    └── .env.local                 # Environment Variables linking Frontend to Backend
```

---

## 📡 API Reference

### 1. Prediction API
*   **Endpoint URL:** `POST /predict`
*   **Requirements:** Requires `multipart/form-data` with `file` (Image), `latitude` (float), `longitude` (float).
*   **Response:** JSON containing diagnosis, confidence metrics, medical Dos & Don'ts, nearby dermatologists, and `heatmap_url`.
*   **Quality Check:** Fails robustly (HTTP 413 or 400) if the image size exceeds 5MB, or fails blur/contrast checks natively.

### 2. User Authentication
*   **Endpoint URL:** `POST /token`
*   **Requirements:** Standard OAuth2 Password Form via FastAPI form-data input schema.
*   **Response:** Returns a standard JWT Bearer token used for session authorization.

### 3. Patient History Extraction
*   **Endpoint URL:** `GET /history`
*   **Requirements:** Requires API Authorization Header (`Bearer <token>`).
*   **Response:** JSON array mapping the user's historical AI scans, timestamped.

---

## 🛠️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.8+)
- **Git**

### 1. Setup the Backend API

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# For Windows:
venv\Scripts\activate
# For macOS/Linux:
# source venv/bin/activate

# Install dependencies strictly defined in requirements.txt
pip install -r requirements.txt

# Boot up the FastAPI Server
# CRITICAL: Ensure it binds to port 8001 as configured in the frontend requirements
uvicorn app.main:app --reload --port 8001
```

*The interactive API documentation is automatically available at: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs).*

### 2. Setup the Next.js Frontend

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Setup Environment Configuration Variables
# Rename .env.example simply to .env.local assuring standard linking variables are active:
# NEXT_PUBLIC_API_URL=http://localhost:8001

# Start the Next.js Development Server Engine
npm run dev
```

*The application will correctly bootstrap and be visually accessible at: [http://localhost:3000](http://localhost:3000).*

---

## 🔧 Troubleshooting

- **TensorFlow Import Error** (`ImportError: No module named 'tensorflow'`):
  Make sure you run `pip install -r requirements.txt` effectively, or manually `pip install tensorflow` / `conda install tensorflow`.
- **Port 8001 Already in Use** (`Error: Port 8001 is already in use`):
  Find and kill the process using port 8001, or run the backend on a different port and update `.env.local` equivalently.
- **Node Modules Error** (`Cannot find module './node_modules/...'`):
  Run `rm -rf node_modules package-lock.json` followed by a fresh `npm install` inside the `frontend/` directory.
- **CORS Errors**: Ensure `http://localhost:3000` is securely added to the allowed origins list inside `backend/app/main.py`.
- **Model Not Found**: Ensure `trained_model.keras` exactly exists at `backend/models/trained_model.keras`.
- **Geolocation API Unresponsive**: Verify active internet connection or allow location access permissions via your web browser.

---

## ⚠️ Important Medical Disclaimer

**DermaScanAI** operates strictly as an **informational guidance system and rapid screening utility**. It **DOES NOT** provide definitive medical diagnoses, nor does it serve as a substitute for professional medical advice, clinical interventions, or doctor-patient judgments. Users presenting concerning, evolving, or painful dermatological aberrations must consult a board-certified hospital or dermatologist immediately for a formal biopsy. This project is meant for educational and demonstration purposes.