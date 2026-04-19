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
    ├── components/                # React Modular Components
    ├── hooks/                     # Custom React Hooks
    ├── lib/                       # Utility Functions
    └── .env.local                 # Environment Variables linking Frontend to Backend
```

---

## 🛠️ Detailed Installation Guide

This section provides explicit, step-by-step installation instructions to easily get the frontend and backend running.

### Prerequisites

Ensure you have the following installed on your system:
| Requirement | Version | Description |
|-------------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime for frontend |
| **Python** | 3.8+ | Backend runtime |
| **Git** | Latest | Version control (optional) |

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/vaibhavbandgar12/DermaScanAI.git
cd DermaScanAI
```

### Step 2: Backend Setup 

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment (Recommended)

**Using venv (Windows):**
```bash
python -m venv venv
venv\Scripts\activate
```

**Using venv (macOS/Linux):**
```bash
python -m venv venv
source venv/bin/activate
```

**Using Conda (Alternative):**
```bash
conda create -n skin_detection python=3.10
conda activate skin_detection
```

#### 2.3 Install Backend Dependencies
```bash
pip install -r requirements.txt
```
*(Note: If TensorFlow throws an import error later, you can manually install it via `pip install tensorflow`)*

#### 2.4 Start the Backend Server
```bash
uvicorn app.main:app --reload --port 8001
```

**Note:** The backend API will now be aggressively running at:
- **API URL:** `http://127.0.0.1:8001`
- **Interactive Docs:** `http://127.0.0.1:8001/docs`

---

### Step 3: Frontend Setup

#### 3.1 Open a New Terminal
**Keep the backend running in the first terminal**, and open an entirely new terminal window. Navigate to the project root.

#### 3.2 Navigate to Frontend Directory
```bash
cd frontend
```

#### 3.3 Install Dependencies
```bash
npm install
```

#### 3.4 Configure Environment Variables 
Create a `.env.local` file inside the `frontend` directory and add the following:
```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8001
```

#### 3.5 Start the Frontend Development Server
```bash
npm run dev
```

**The frontend interface will successfully load at:** `http://localhost:3000`

---

## 🏃 Running the Application (Summary)

To avoid confusion, here is how you run both servers locally after your initial setup is complete:

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate      # Important: Only if using Windows venv
uvicorn app.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
*(Access the web app at: **`http://localhost:3000`**)*

---

## 🔧 Troubleshooting

- **TensorFlow Import Error** (`ImportError: No module named 'tensorflow'`):
  Make sure you ran `pip install -r requirements.txt` correctly inside your virtual environment, or manually execute `pip install tensorflow`.
- **Port 8001 Already in Use** (`Error: Port 8001 is already in use`):
  Find and kill the active process tying up port 8001. Alternatively, launch the backend on a different port and logically update `.env.local` in your frontend directory to match the port number.
- **Node Modules Error** (`Cannot find module './node_modules/...'`):
  Execute `rm -rf node_modules package-lock.json`, followed logically by a fresh `npm install` inside the `frontend/` folder.
- **CORS Errors**: Guarantee that `http://localhost:3000` is visibly declared in the allowed origins routing list inside `backend/app/main.py`.
- **Model Not Found**: Confirm `trained_model.keras` precisely sits at `backend/models/trained_model.keras`.

---

## 📡 API Reference Overview

### 1. Prediction API
*   **Endpoint URL:** `POST /predict`
*   **Requirements:** Requires `multipart/form-data` with `file` (Image), `latitude` (float), `longitude` (float).
*   **Response:** JSON predicting the diagnosis condition, confidence probability percentages, generated Dos & Don'ts mapped dynamically, nearby dermatologists lists, and an optional Grad-CAM `heatmap_url`.

### 2. User Authentication & Scans History
*   **Endpoint URLs:** `POST /token` | `GET /history`
*   **Requirements:** Protected via Standard OAuth2 Password Form setup. Calling history routes requires a Bearer JWT Token in the authentication header.

---

## ⚠️ Important Medical Disclaimer

DermaScanAI operates rigorously as an **informational guidance system and rapid screening utility**. It **DOES NOT** provide definitive medical diagnoses, nor does it serve as a substitute for professional medical advice, clinical interventions, or doctor-patient judgments. Users presenting concerning, evolving, or painful dermatological aberrations must consult a board-certified hospital or dermatologist immediately for a formal biopsy. This project is constructed for educational and architectural demonstration purposes naturally.