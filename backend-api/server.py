import uuid
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
    Ingests a newly registered logistics parcel from the frontend form submission
    and permanently writes it down to the SQLite table cluster storage layer.
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
    return db_shipment

@app.get("/api/shipments", response_model=List[schemas.ShipmentResponse])
def get_all_shipments(db: Session = Depends(get_db)):
    """
    Fetches the active array collection rows out of logisync.db to synchronize
    the dashboard numbers, table data cells, and donut chart distribution graphs.
    """
    return db.query(models.Shipment).all()

class StatusUpdate(BaseModel):
    status: str

@app.patch("/api/shipments/{tracking_number}/status", response_model=schemas.ShipmentResponse)
def update_shipment_status(tracking_number: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    """
    Explicit patch endpoint allowing manual row state manipulation via 
    the select context drop menus inside the custom frontend spreadsheet.
    """
    db_shipment = db.query(models.Shipment).filter(models.Shipment.tracking_number == tracking_number).first()
    if not db_shipment:
        raise HTTPException(status_code=404, detail="Shipment profile not found.")
    db_shipment.status = payload.status
    db.commit()
    db.refresh(db_shipment)
    return db_shipment

@app.delete("/api/shipments/clear-test")
def delete_string_shipments(db: Session = Depends(get_db)):
    """
    Administrative macro tool utility to instantly scrub automated mock data 
    strings created during API document exploratory testing sequences.
    """
    test_records = db.query(models.Shipment).filter(models.Shipment.sender_name == "string").all()
    count = len(test_records)
    for record in test_records:
        db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Successfully deleted {count} test string records."}