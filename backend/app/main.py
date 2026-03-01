# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import router
from app.auth import router as auth_router
from app import models
from app.database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

import os
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="Skin Condition Guidance API",
    description="Upload skin image and get early guidance",
    version="1.0"
)

# Allow the frontend dev server to access the API securely
import os

origins_env = os.getenv("ALLOWED_ORIGINS", "")
if origins_env:
    origins = [orig.strip() for orig in origins_env.split(",") if orig.strip()]
else:
    # Default local dev origins
    origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(router)


@app.get("/")
def home():
    return {"message": "Skin Disease Detection API is running"}