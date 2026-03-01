from pathlib import Path

# Try to import TensorFlow only if available; allow server to start without it
try:
    from tensorflow.keras.models import load_model
    TENSORFLOW_AVAILABLE = True
except Exception:
    load_model = None
    TENSORFLOW_AVAILABLE = False

# Resolve model path relative to the backend package directory
BASE_DIR = Path(__file__).resolve().parent.parent
model_path = BASE_DIR / "models" / "trained_model.keras"

model = None

if not TENSORFLOW_AVAILABLE:
    print("⚠ TensorFlow not installed. Model loading is skipped. Install tensorflow to enable predictions.")
else:
    if model_path.exists():
        # Try loading as .keras first, then fall back to legacy H5 format
        try:
            model = load_model(str(model_path))
            print("✅ Model Loaded Successfully (keras format)", model_path)
        except Exception as e1:
            print(f"⚠ .keras format failed: {e1}")
            print("🔄 Retrying as legacy H5 format...")
            try:
                # The file may be HDF5 despite the .keras extension
                h5_path = model_path.with_suffix(".h5")
                import shutil
                shutil.copy2(str(model_path), str(h5_path))
                model = load_model(str(h5_path))
                print("✅ Model Loaded Successfully (H5 format)", model_path)
            except Exception as e2:
                print("❌ Failed to load model:", e2)
                model = None
    else:
        print("❌ Model file NOT FOUND at:", model_path)
        model = None