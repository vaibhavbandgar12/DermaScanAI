# Skin Disease Detection Project

## Overview

This is a full-stack web application that provides AI-powered skin condition analysis. Users can upload a photo of a skin concern and receive instant analysis with actionable guidance, severity indicators, and nearby dermatologist recommendations.

---

## Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6
- **Language:** TypeScript 5.7.3
- **UI Library:** React 19.2.4
- **Styling:** Tailwind CSS 4.2.0
- **Components:** Radix UI (for accessible UI primitives)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Form Handling:** React Hook Form + Zod
- **Theme:** next-themes (Dark/Light mode support)

### Backend
- **Framework:** FastAPI (Python)
- **Machine Learning:** TensorFlow / Keras
- **ImagePillow), Open Processing:** PIL (CV
- **API Server:** Uvicorn
- **Location Services:** Overpass API (OpenStreetMap)

### Model
- **Model Format:** Keras (.keras)
- **Input Size:** 128x128 pixels
- **Classes:** Eczema, Melanocytic_Nevi, Melanoma

---

## APIs Used

### 1. Prediction API (Custom)
- **Endpoint:** `POST /predict`
- **Parameters:**
  - `file`: Image file (JPG, PNG)
  - `latitude`: User's latitude
  - `longitude`: User's longitude
- **Response:** Condition, confidence, guidance (Do's/Don'ts), nearby doctors

### 2. Overpass API (OpenStreetMap)
- **URL:** `https://overpass-api.de/api/interpreter`
- **Purpose:** Finding nearby dermatologists, clinics, and hospitals
- **Search:** 5km Radius from user's location
- **No API key required** (Free and open-source)

---

## Features

### Core Features
1. **AI-Powered Skin Analysis**
   - Upload skin images (drag & drop or click to browse)
   - Instant AI prediction using TensorFlow/Keras model
   - Confidence score display

2. **Three Condition Classification**
   - Eczema
   - Melanocytic Nevi (Moles)
   - Melanoma (Skin Cancer)

3. **Guidance System**
   - Do's and Don'ts for each condition
   - Personalized recommendations based on prediction
   - Clear next steps for users

4. **Severity Indicator**
   - Urgent flag for Melanoma predictions
   - Low confidence warning (below 20% threshold)
   - Medical disclaimer

5. **Nearby Doctor Finder**
   - Uses OpenStreetMap/Overpass API
   - Finds dermatologists within 5km radius
   - Shows clinic names, addresses, and specialties
   - Falls back to general clinics if no dermatologists found

6. **User Experience**
   - Responsive design (mobile-friendly)
   - Dark/Light theme toggle
   - Image preview before submission
   - Loading states and error handling
   - Clear disclaimer about AI limitations

### Additional Features
- Modern UI with smooth animations
- Feature chips showing key capabilities
- How-it-works section
- Info section with educational content

---

## Dataset Used

The model appears to be trained on a skin disease dataset, most likely:

### HAM10000 (Human Against Machine with 10000 Training Images)
- **Description:** A widely-used skin lesion dataset
- **Source:** Philipmetrics (Harvard Dataverse)
- **Classes:** 7 types of skin lesions (but this project uses 3)
- **Image Size:** Originally varying sizes, resized to 128x128 for this model

The three classes used in this project:
1. **Eczema** - Inflammatory skin condition
2. **Melanocytic Nevi** - Common moles
3. **Melanoma** - Serious skin cancer

---

## Pros

### Advantages of This Project

1. **Free to Use**
   - No paid API keys required
   - OpenStreetMap provides free location data
   - Self-hostable backend

2. **Fast and Responsive**
   - Client-side image preview
   - Quick AI predictions (seconds)
   - Modern, snappy UI

3. **Privacy-Focused**
   - Images processed locally on server
   - No permanent storage of user images
   - Basic medical disclaimer

4. **Accessibility**
   - Works on mobile devices
   - Dark/Light theme support
   - User-friendly interface

5. **Educational**
   - Provides Do's and Don'ts
   - Informs users about severity
   - Encourages professional consultation

6. **Fallback Mechanisms**
   - Low confidence handling (threshold: 20%)
   - Default location (Delhi) if geolocation denied
   - General clinic search if no dermatologist found

---

## Cons

### Limitations and Challenges

1. **Limited Scope**
   - Only 3 skin conditions (many more exist)
   - Cannot diagnose all skin diseases
   - Not a substitute for professional medical advice

2. **Accuracy Concerns**
   - AI model may have false positives/negatives
   - 20% confidence threshold may be too low for medical decisions
   - Training data may not represent all skin types

3. **Dependency on External Services**
   - Overpass API rate limiting
   - Internet connection required
   - Backend must be running for predictions

4. **Location Data Quality**
   - OpenStreetMap data varies by region
   - May not find doctors in rural areas
   - Address information may be incomplete

5. **Technical Limitations**
   - Image quality affects prediction accuracy
   - No multi-image analysis
   - No historical comparison of lesions

6. **Medical Disclaimer**
   - Should not be used for self-diagnosis
   - Always consult a dermatologist
   - For informational purposes only

---

## Similar Websites

### Other Skin Disease Detection Platforms

1. **SkinVision**
   - URL: https://www.skinvision.com
   - AI-powered skin cancer detection
   - Certified by CE marking

2. **First Derm**
   - URL: https://www.firstderm.com
   - Online dermatologist consultation
   - Image-based skin assessment

3. **Aysa**
   - URL: https://www.aysa.app
   - Skin condition symptom checker
   - AI-powered guidance

4. **Docotel (ISIC - International Skin Imaging Collaboration)**
   - URL: https://www.isic-archive.com
   - melanoma detection
   - Research-focused platform

5. **Miiskin**
   - URL: https://www.miiskin.com
   - Skin tracking and monitoring
   - Mole tracking features

6. **OptiMal**
   - URL: https://www.optimaldm.org
   - Dermatology AI tools
   - Professional medical use

7. **Ada Health**
   - URL: https://ada.com
   - General symptom checker
   - Includes skin condition assessment

8. **K Health**
   - URL: https://khealth.com
   - AI-powered health assessment
   - Includes skin concerns

---

## Project Structure

```
skin_01/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app setup
│   │   ├── routes.py        # Prediction endpoint
│   │   ├── model_loader.py  # TensorFlow model loader
│   │   ├── utils.py        # Guidance text
│   │   └── location.py     # OpenStreetMap integration
│   ├── models/
│   │   └── trained_model.keras
│   └── src/
│       └── predict.py      # Prediction utilities
│
└── frontend/
    ├── app/
    │   ├── page.tsx         # Main page
    │   ├── layout.tsx      # Layout
    │   └── globals.css     # Global styles
    ├── components/
    │   ├── header.tsx
    │   ├── hero.tsx
    │   ├── skin-upload.tsx # Upload & prediction
    │   ├── prediction-result.tsx
    │   ├── nearby-doctors.tsx
    │   ├── how-it-works.tsx
    │   ├── info-section.tsx
    │   ├── footer.tsx
    │   └── ui/             # Radix UI components
    └── public/
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- TensorFlow (for backend)

### Installation

1. **Backend:**
   
```
bash
   cd backend
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8001
   
```

2. **Frontend:**
   
```
bash
   cd frontend
   npm install
   npm run dev
   
```

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8000)
- `DEBUG_PREDICTION` - Enable raw prediction scores (optional)

---

## Disclaimer

This tool provides informational guidance only and does **NOT** replace professional medical diagnosis. Always consult a certified dermatologist for accurate medical advice. The AI model is for screening purposes only and may not be 100% accurate.

---

## License

This project is for educational and demonstration purposes.
