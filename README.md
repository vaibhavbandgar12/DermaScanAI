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
