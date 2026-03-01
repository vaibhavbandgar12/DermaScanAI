# app/routes.py

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os

from app.model_loader import model
from app.utils import get_guidance
from app.location import find_dermatologists
from app.gradcam import make_gradcam_heatmap, generate_gradcam_overlay
from app import models, database, auth

router = APIRouter()


class_names = ['Eczema', 'Melanocytic_Nevi', 'Melanoma']

# Increased threshold for Medical AI Safety
CONFIDENCE_THRESHOLD = 0.60
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB limit


def run_inference(image_array):
    """Run TensorFlow inference synchronously. Will be called in a threadpool."""
    return model.predict(image_array)


@router.post("/predict")
async def predict(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    current_user: models.User = Depends(auth.get_optional_current_user),
    db: Session = Depends(database.get_db)
):
    # 🔒 Security: Validate File Size (Max 5MB)
    file.file.seek(0, 2)
    file_size = file.file.tell()
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB limit."
        )
    file.file.seek(0)
    
    # Read uploaded image bytes
    contents = await file.read()
    
    try:
        # Load directly from memory (No disk I/O tempfiles needed)
        img_pil = Image.open(io.BytesIO(contents)).convert("RGB")
        img_pil = img_pil.resize((128, 128))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file format."
        )

    # Convert to numpy array
    input_arr = np.array(img_pil, dtype=np.float32)

    # 🛑 QUALITY CHECK: Blur & Contrast Detection
    import cv2
    try:
        # Convert to grayscale for structural analysis
        gray = cv2.cvtColor(input_arr, cv2.COLOR_RGB2GRAY)
        
        # 1. Blur Detection (Laplacian Variance)
        # Low variance means edges are missing (blurry)
        focus_measure = cv2.Laplacian(gray, cv2.CV_64F).var()
        if focus_measure < 50.0:  # Threshold for extreme blur
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image quality insufficient for AI analysis: Image is too blurry. Please retake in focus."
            )
            
        # 2. Contrast check (RMS Contrast - standard deviation of pixel intensities)
        # Low std means image is mostly one color (too dark or washed out)
        contrast = gray.std()
        if contrast < 20.0:  # Threshold for extreme low contrast
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image quality insufficient for AI analysis: Lighting is too poor or contrast is too low."
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Quality Check Warning: {e}") # Non-fatal if cv2 fails

    # Convert single image to batch (matches tf.keras preprocessing)
    input_arr = np.expand_dims(input_arr, axis=0) 

    # Ensure model is loaded
    if model is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Model not available on server. Contact admin.")

    # Predict securely without blocking the event loop
    try:
        raw_prediction = await run_in_threadpool(run_inference, input_arr)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Prediction failed: {e}")

    # ==========================================
    # 🧠 AI CONFIDENCE CALIBRATION (Temperature Scaling)
    # Reduces overconfidence on Out-Of-Distribution data
    # ==========================================
    TEMPERATURE = 1.5  # Softens the distribution curve
    
    # Check if the model outputs probabilities (Softmax) or raw Logits
    # If the sum is ~1.0, it's already Softmaxed probabilities.
    is_softmax = np.isclose(np.sum(raw_prediction[0]), 1.0, atol=1e-3)
    
    if is_softmax:
        # Reverse engineer approximate logits from probabilities
        logits = np.log(raw_prediction[0] + 1e-7)
    else:
        # Model outputs raw logits directly
        logits = raw_prediction[0]

    # Apply Temperature Scaling
    scaled_logits = logits / TEMPERATURE
    
    # Re-apply Softmax to get calibrated probabilities
    exp_logits = np.exp(scaled_logits - np.max(scaled_logits)) # Stable softmax
    calibrated_probs = exp_logits / np.sum(exp_logits)

    result_index = np.argmax(calibrated_probs)
    confidence = float(np.max(calibrated_probs))
    model_prediction = class_names[result_index]

    # 🔒 Low confidence safety check (AI Refusal Mode)
    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "condition": "Uncertain",
            "confidence": round(confidence, 4),
            "message": "Prediction confidence is below the reliable medical threshold. Please consult a dermatologist.",
            "disclaimer": "This tool provides informational guidance only and does not replace professional medical diagnosis."
        }

    # Get Do's and Don'ts
    guidance = get_guidance(model_prediction)

    # Find nearby dermatologists (Async OSM request)
    nearby_doctors = await find_dermatologists(latitude, longitude)

    # 🚨 Urgent flag logic
    urgent_flag = True if model_prediction == "Melanoma" or confidence < CONFIDENCE_THRESHOLD else False

    # 🔬 EXPLAINABILITY: Confidence-Gated Grad-CAM
    heatmap_url = None
    
    # 🔥 Only generate expensive heatmaps for suspicious (Melanoma) or Uncertain cases
    if urgent_flag or confidence < CONFIDENCE_THRESHOLD:
        try:
            # Generate the activation heatmap
            # conv2d_19 is the final active Convolutional block in this specific model
            heatmap = make_gradcam_heatmap(input_arr, model, 'conv2d_19', pred_index=result_index)
            
            # Create an overlay on the original unprocessed image for visual clarity
            img_array_original = np.array(img_pil, dtype=np.uint8)
            heatmap_url, overlayed_bgr = generate_gradcam_overlay(img_array_original, heatmap, alpha=0.4)
            
            # 🏥 AUDIT TRAIL: Save heatmap to disk for medical compliance review
            import uuid
            from pathlib import Path
            import cv2
            
            BASE_DIR = Path(__file__).resolve().parent.parent
            audit_dir = BASE_DIR / "audits" / "heatmaps"
            audit_dir.mkdir(parents=True, exist_ok=True)
            
            audit_filename = audit_dir / f"{uuid.uuid4()}_{model_prediction}_{round(confidence*100)}.jpg"
            
            # Save using OpenCV directly
            cv2.imwrite(str(audit_filename), overlayed_bgr)
                
        except Exception as e:
            print(f"Grad-CAM Generation Failed: {e}")

    # Save to history if user is authenticated
    image_path = None
    if current_user:
        import uuid
        user_upload_dir = os.path.join("uploads", str(current_user.id))
        os.makedirs(user_upload_dir, exist_ok=True)
        
        filename = f"{uuid.uuid4()}.jpg"
        filepath = os.path.join(user_upload_dir, filename)
        
        # Save image locally
        img_pil.save(filepath, format="JPEG")
        image_path = f"/uploads/{current_user.id}/{filename}"
        
        # Create DB record
        new_history = models.PredictionHistory(
            user_id=current_user.id,
            prediction=model_prediction,
            confidence=confidence,
            urgent=urgent_flag,
            image_path=image_path,
            heatmap_path=heatmap_url # store the path to heatmap if available
        )
        db.add(new_history)
        db.commit()

    response = {
        "condition": model_prediction,
        "confidence": round(confidence, 4),
        "dos": guidance["dos"],
        "dont": guidance["dont"],
        "urgent": urgent_flag,
        "nearby_dermatologists": nearby_doctors,
        "heatmap_url": heatmap_url,
        "image_path": image_path,
        "disclaimer": "This tool provides informational guidance only and does not replace professional medical diagnosis."
    }

    # Debugging helper: include raw model scores when DEBUG_PREDICTION=1
    if os.getenv("DEBUG_PREDICTION") == "1":
        try:
            response["raw_prediction"] = raw_prediction[0].tolist()
            response["calibrated_prediction"] = calibrated_probs.tolist()
        except Exception:
            response["raw_prediction"] = []
        response["result_index"] = int(result_index)

    return response

@router.get("/history")
def get_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    history = db.query(models.PredictionHistory).filter(models.PredictionHistory.user_id == current_user.id).order_by(models.PredictionHistory.created_at.desc()).limit(50).all()
    return history