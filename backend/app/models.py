from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Password Reset Fields
    reset_token = Column(String, unique=True, index=True, nullable=True)
    reset_token_expiry = Column(DateTime, nullable=True)
    
    # Relationship to history
    history = relationship("PredictionHistory", back_populates="owner")

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    prediction = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    urgent = Column(Boolean, default=False)
    image_path = Column(String, nullable=True) # Optional path to saved image
    heatmap_path = Column(String, nullable=True) # Optional path to saved heatmap
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="history")
