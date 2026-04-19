<<<<<<< HEAD
<div align="center">
  <img src="frontend/public/placeholder-logo.svg" alt="DermaVision-AI Logo" width="120" />
  <h1>🩺 DermaVision-AI: Skin Disease Detection</h1>
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

**DermaVision-AI** is a robust, full-stack web application that brings accessible, AI-powered skin condition analysis directly to users. By simply uploading a photo of a skin concern, the system provides an instant AI prediction alongside actionable health guidance. 

To bridge the gap between "black-box" AI and clinical transparency, DermaVision-AI incorporates **Grad-CAM visual explanations**, highlighting the exact regions of the image that led to the prediction. Furthermore, it integrates a privacy-first localized geospatial API to recommend nearby dermatologists for professional follow-up.

---

## 🚀 Key Features

- 🧠 **AI-Powered Skin Analysis:** Leverages a pre-trained TensorFlow model to predict skin conditions (e.g., *Melanoma*, *Eczema*, *Melanocytic Nevi*). Uses **Temperature Scaling** for confidence calibration to avoid overconfident misdiagnoses.
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

## 📂 Project Structure & Component Analysis

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
│   │   └── utils.py               # Medical guidance generation & Helpers
│   ├── audits/heatmaps/           # Generated Grad-CAM overlay audit trail
│   ├── models/                    # Stored ML Models (trained_model.keras/.h5)
│   ├── src/                       # Source scripts (e.g., predict.py)
│   ├── uploads/                   # User-specific categorized image uploads
│   ├── requirements.txt           # Python backend dependencies
│   └── skin_app.db                # SQLite database file
└── frontend/                      # Next.js React Frontend
    ├── app/                       # Next.js App Router Structure
    │   ├── page.tsx               # Main Landing Page
    │   ├── layout.tsx             # Root layout and Providers
    │   ├── login/, register/      # Authentication routing
    │   ├── history/               # Protected user history route
    │   └── globals.css            # Global Tailwind styling
    ├── components/                # React Modular Components
    │   ├── ui/                    # Reusable shadcn/ui Primitives (50+ elements)
    │   ├── skin-upload.tsx        # Interactive Drag & Drop image widget
    │   ├── prediction-result.tsx  # Diagnosis, Confidence Metric & GradCAM rendering
    │   ├── nearby-doctors.tsx     # Map display and Doctor List rendering
    │   └── auth-provider.tsx      # Global Session State Provider
    ├── hooks/                     # Custom React Hooks
    ├── lib/                       # Utility Functions
    └── .env.local                 # Environment Variables linking Frontend to Backend
```

### Detailed Component Highlights

*   **`backend/app/routes.py`**: The powerhouse of the backend. Handles the `/predict` endpoint, which includes image validation, fast image quality checks (blur/contrast detection via OpenCV), asynchronous TensorFlow inference, confidence probability calibration, and secure database persistence.
*   **`backend/app/gradcam.py`**: Injects advanced clinical explainability. Hooks into the final convolutional layer of the loaded TensorFlow model (`conv2d_19`) to extract gradients and generate a contextual activation heatmap, showing directly which dermal features influenced the AI's logic.
*   **`frontend/components/ui/`**: Demonstrates exceptional commitment to accessibility and uniform design by containing over 50 Radix-backed, customizable UI elements from interactive dialogs and skeleton loaders, to forms and responsive layout grids.

---

## 📡 API Reference

### 1. Prediction API
*   **Endpoint URL:** `POST /predict`
*   **Requirements:** Requires `multipart/form-data` with `file` (Image), `latitude` (float), `longitude` (float).
*   **Response:** JSON containing diagnosis, confidence metrics, medical Dos & Don'ts, list of nearby dermatologists, and optional Grad-CAM `heatmap_url`.
*   **Quality & Integrity Check:** Fails robustly (HTTP 413 or 400) if the image size exceeds 5MB, or fails the mathematical quality checks natively built-in for extreme blur scenarios or contrast irregularities.

### 2. User Authentication
*   **Endpoint URL:** `POST /token`
*   **Requirements:** Standard OAuth2 Password Form via FastAPI form-data input schema.
*   **Response:** Returns a standard JWT Bearer token systematically used for secure session authorization across the stack.

### 3. Patient History Extraction
*   **Endpoint URL:** `GET /history`
*   **Requirements:** Requires API Authorization Header (`Bearer <token>`).
*   **Response:** JSON array mapping the user's historical AI scans, containing explicit AI predictions layered with timestamped audit variables.

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

# Create a virtual environment (optional but highly recommended)
python -m venv venv

# Activate the virtual environment
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
# source venv/bin/activate

# Install dependencies strictly defined in requirements.txt
pip install -r requirements.txt

# Boot up the FastAPI Server
# CRITICAL: Ensure it binds to port 8001 as configured in the frontend requirements (.env.example)
uvicorn app.main:app --reload --port 8001
```

*The interactive API documentation (Swagger UI) is automatically generated and accessible live via at: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs).*

### 2. Setup the Next.js Frontend

```bash
# Open a new terminal completely and navigate to the root frontend directory
cd frontend

# Install Node dependencies fully
npm install

# Setup Environment Configuration Variables
# Rename .env.example simply to .env.local assuring standard linking variables are active:
# NEXT_PUBLIC_API_URL=http://localhost:8001

# Start the Next.js Webpack Development Server Engine
npm run dev
```

*The operational application ecosystem will correctly bootstrap and be visually accessible at: [http://localhost:3000](http://localhost:3000).*

---

## ⚠️ Important Medical Disclaimer

DermaVision-AI operates rigorously as an **informational guidance system and rapid screening utility**. It **DOES NOT** provide definitive medical diagnoses, nor does it serve as a substitute for professional medical advice, clinical interventions, or doctor-patient judgments. Users presenting concerning, evolving, or painful dermatological aberrations must consult a board-certified hospital or dermatologist immediately for a formal biopsy.
=======
# Skin Disease Detection - Installation Guide

This document provides detailed installation instructions for the Skin Disease Detection project.

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Version | Description |
|-------------|---------|-------------|
| **Node.js** | 18+ | JavaScript runtime for frontend |
| **Python** | 3.8+ | Backend runtime |
| **TensorFlow** | Latest | Machine learning framework for backend |
| **Git** | Latest | Version control (optional) |

### Installing Prerequisites

#### Node.js
Download and install from: https://nodejs.org/
- Windows: Use the Windows Installer (.msi)
- macOS: Use the macOS Installer (.pkg)
- Linux: Use nvm or your package manager

#### Python
Download and install from: https://www.python.org/downloads/
- Ensure you check "Add Python to PATH" during installation
- For Windows, you can also use Anaconda

#### TensorFlow (Backend)
TensorFlow will be installed via the requirements.txt file, but you can also install it manually:

```
bash
# Using pip
pip install tensorflow

# Using conda
conda install tensorflow
```

---

## Project Structure

```
skin_01/
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   ├── models/       # Trained Keras model
│   └── src/         # Prediction utilities
├── frontend/         # Next.js frontend
│   ├── app/         # App pages
│   ├── components/  # React components
│   └── public/     # Static assets
├── README.md        # Project documentation
└── INSTALLATION.md  # This file
```

---

## Installation Steps

### Step 1: Clone the Repository

```
bash
git clone <repository-url>
cd skin_01
```

Or if you have the files directly, navigate to the project directory:

```
bash
cd path/to/skin_01
```

---

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory

```
bash
cd backend
```

#### 2.2 Create Virtual Environment (Recommended)

**Using venv:**

```
bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

**Using Conda:**

```
bash
conda create -n skin_detection python=3.10
conda activate skin_detection
```

#### 2.3 Install Backend Dependencies

```
bash
cd backend
pip install -r requirements.txt
```

The requirements.txt includes:
- **fastapi** - FastAPI web framework
- **uvicorn** - ASGI server
- **tensorflow** - Machine learning framework
- **Pillow** - Image processing
- **numpy** - Numerical computing
- **requests** - HTTP requests (for Overpass API)
- **python-multipart** - File upload handling

#### 2.4 Verify Backend Setup

```
bash
# Check Python version
python --version

# Check TensorFlow installation
python -c "import tensorflow as tf; print(tf.__version__)"
```

#### 2.5 Start the Backend Server

```
bash
uvicorn app.main:app --reload --port 8001
```

The backend API will be available at:
- **API URL:** http://127.0.0.1:8001
- **Interactive Docs:** http://127.0.0.1:8001/docs
- **Health Check:** http://127.0.0.1:8001/

---

### Step 3: Frontend Setup

#### 3.1 Open a New Terminal

Keep the backend running and open a new terminal window.

#### 3.2 Navigate to Frontend Directory

```
bash
cd frontend
```

#### 3.3 Install Dependencies

```
bash
npm install
```

This will install all required packages including:
- Next.js 16.1.6
- React 19.2.4
- TypeScript 5.7.3
- Tailwind CSS 4.2.0
- Radix UI components
- Lucide React icons
- Recharts
- React Hook Form + Zod

#### 3.4 Configure Environment Variables (Optional)

Create a `.env.local` file in the `frontend` directory:

```
bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8001

# Enable debug predictions (optional)
DEBUG_PREDICTION=false
```

#### 3.5 Start the Frontend Development Server

```
bash
npm run dev
```

The frontend will be available at:
- **Local URL:** http://localhost:3000
- **Production Build:** http://localhost:3001 (after build)

---

### Step 4: Verify Installation

#### Backend Verification

1. Open your browser and navigate to: http://127.0.0.1:8001/
2. You should see: `{"message": "Skin Disease Detection API is running"}`
3. For API documentation, go to: http://127.0.0.1:8001/docs

#### Frontend Verification

1. Open your browser and navigate to: http://localhost:3000
2. You should see the Skin Disease Detection homepage
3. Try uploading an image to test the prediction functionality

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```
bash
cd backend
uvicorn app.main:app --reload --port 8001
```

**Terminal 2 - Frontend:**
```
bash
cd frontend
npm run dev
```

Access the application at: http://localhost:3000

### Production Mode

#### Build Frontend:
```
bash
cd frontend
npm run build
npm start
```

#### Run Backend in Production:
```
bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

---

## Troubleshooting

### Common Issues

#### 1. TensorFlow Import Error

**Problem:** `ImportError: No module named 'tensorflow'`

**Solution:**
```
bash
pip install tensorflow
# or
conda install tensorflow
```

#### 2. Port Already in Use

**Problem:** `Error: Port 8001 is already in use`

**Solution:**
- Find and kill the process using the port, or
- Use a different port:
  
```
bash
  uvicorn app.main:app --reload --port 8002
  
```

#### 3. Node Modules Error

**Problem:** `Error: Cannot find module './node_modules/...'`

**Solution:**
```
bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. CORS Error

**Problem:** Cross-origin request blocked

**Solution:** Ensure the frontend URL is in the CORS origins list in `backend/app/main.py`:
```
python
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

#### 5. Model Not Found

**Problem:** `FileNotFoundError: trained_model.keras`

**Solution:** Ensure the model file exists at `backend/models/trained_model.keras`

#### 6. Geolocation Not Working

**Problem:** Cannot find nearby doctors

**Solution:** 
- Allow location access in the browser
- The app uses OpenStreetMap/Overpass API which requires internet connection

---

## API Documentation

### Prediction Endpoint

- **URL:** `http://localhost:8001/predict`
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Parameters:**
  - `file`: Image file (JPG, PNG)
  - `latitude`: User's latitude (optional)
  - `longitude`: User's longitude (optional)

### Response Format

```
json
{
  "condition": "Eczema",
  "confidence": 85.5,
  "guidance": {
    "do": ["...", "..."],
    "dont": ["...", "..."]
  },
  "nearby_doctors": [...]
}
```

---

## Additional Information

### Model Details

- **Input Size:** 128x128 pixels
- **Classes:** Eczema, Melanocytic_Nevi, Melanoma
- **Confidence Threshold:** 20%

### Technologies Used

#### Frontend
- Next.js 16.1.6
- React 19.2.4
- TypeScript 5.7.3
- Tailwind CSS 4.2.0
- Radix UI
- Lucide React

#### Backend
- FastAPI
- TensorFlow / Keras
- PIL (Pillow)
- Uvicorn
- Overpass API (OpenStreetMap)

---

## Support

For issues or questions, please refer to:
1. README.md for project overview
2. Check the console for error messages
3. Verify all dependencies are correctly installed

---

## License

This project is for educational and demonstration purposes.
>>>>>>> 02ddaa14fa5289c266dbe7c4459c6418d77ad217
