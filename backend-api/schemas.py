from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class ShipmentCreate(BaseModel):
    sender_name: str
    recipient_name: str
    destination_address: str
    weight: float
    customer_email: EmailStr

class ShipmentResponse(BaseModel):
    id: str
    tracking_number: str
    sender_name: str
    recipient_name: str
    destination_address: str
    weight: float
    customer_email: EmailStr
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True