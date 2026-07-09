import uuid
import json
import boto3  # <--- Added for AWS integration
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

# Initialize SQS Client
# Replace this string with your real Amazon SQS Queue URL from yesterday!
SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/334856751456/logisync-shipment-queue"
sqs_client = boto3.client("sqs", region_name="ap-south-1")

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
    and publishes an optimization event message directly to Amazon SQS.
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

    # 🚀 AMAZON SQS BROADCAST LOGIC
    try:
        message_body = {
            "shipment_id": db_shipment.id,
            "tracking_number": db_shipment.tracking_number,
            "destination": db_shipment.destination_address,
            "weight": db_shipment.weight
        }
        
        sqs_client.send_message(
            QueueUrl=SQS_QUEUE_URL,
            MessageBody=json.dumps(message_body)
        )
    except Exception as e:
        print(f"Failed to broadcast to SQS: {str(e)}")
        # We don't crash the API response even if queue broadcast fails

    return db_shipment

@app.get("/api/shipments", response_model=List[schemas.ShipmentResponse])
def get_all_shipments(db: Session = Depends(get_db)):
    return db.query(models.Shipment).all()

class StatusUpdate(BaseModel):
    status: str

@app.patch("/api/shipments/{tracking_number}/status", response_model=schemas.ShipmentResponse)
def update_shipment_status(tracking_number: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    db_shipment = db.query(models.Shipment).filter(models.Shipment.tracking_number == tracking_number).first()
    if not db_shipment:
        raise HTTPException(status_code=404, detail="Shipment profile not found.")
    db_shipment.status = payload.status
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@app.delete("/api/shipments/clear-test")
def delete_string_shipments(db: Session = Depends(get_db)):
    test_records = db.query(models.Shipment).filter(models.Sender_name == "string").all()
    count = len(test_records)
    for record in test_records:
        db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Successfully deleted {count} test string records."}