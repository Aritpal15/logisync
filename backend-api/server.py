import uuid
import json
import boto3
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize database structures
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LogiSync Ingestion Engine")

# 📢 SWITCHED FROM SQS TO SNS
# Replace this string with your real Amazon SNS Topic ARN from the console!
SNS_TOPIC_ARN = "arn:aws:sns:ap-south-1:334856751456:logisync-shipment-topic"
sns_client = boto3.client("sns", region_name="ap-south-1")

# Allow connections from React frontend port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- API CORE FUNCTIONAL ENDPOINTS ---

@app.post("/api/shipments", response_model=schemas.ShipmentResponse)
def create_shipment(shipment: schemas.ShipmentCreate, db: Session = Depends(get_db)):
    """
    Ingests a newly registered logistics parcel, writes it to RDS,
    and publishes an event notification directly to Amazon SNS.
    """
    generated_id = str(uuid.uuid4())
    generated_tracking = f"LS-{str(uuid.uuid4())[:8].upper()}"

    db_shipment = models.Shipment(
        id=generated_id,
        tracking_number=generated_tracking,
        sender_name=shipment.sender_name,
        recipient_name=shipment.recipient_name,
        destination_address=shipment.destination_address,
        weight=shipment.weight,
        customer_email=shipment.customer_email,
        status="ORDER_CREATED"
    )

    db.add(db_shipment)
    db.commit()
    db.refresh(db_shipment)

    # 🚀 AMAZON SNS PUB/SUB FANOUT BROADCAST
    try:
        message_body = {
            "shipment_id": db_shipment.id,
            "tracking_number": db_shipment.tracking_number,
            "destination": db_shipment.destination_address,
            "weight": db_shipment.weight,
            "customer_email": db_shipment.customer_email
        }
        
        sns_client.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=json.dumps(message_body),
            Subject=f"LogiSync Alert: New Shipment Created {db_shipment.tracking_number}"
        )
        print(f"📢 Successfully published event to SNS for {db_shipment.tracking_number}")
    except Exception as e:
        print(f"Failed to broadcast to SNS: {str(e)}")

    return db_shipment

# ... keep get_all_shipments, update_shipment_status, and delete_string_shipments exactly as they are!

@app.get("/api/shipments", response_model=List[schemas.ShipmentResponse])
def get_all_shipments(db: Session = Depends(get_db)):
    """
    Retrieves all stored logistics parcel records from the RDS PostgreSQL instance.
    """
    return db.query(models.Shipment).all()

@app.put("/api/shipments/{shipment_id}/status", response_model=schemas.ShipmentResponse)
def update_shipment_status(shipment_id: str, payload: dict, db: Session = Depends(get_db)):
    """
    Updates the execution phase state of a targeted parcel tracking lifecycle.
    """
    db_shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
    if not db_shipment:
        raise HTTPException(status_with=404, detail="Shipment not found")
    
    new_status = payload.get("status")
    if new_status:
        db_shipment.status = new_status
        db.commit()
        db.refresh(db_shipment)
    return db_shipment