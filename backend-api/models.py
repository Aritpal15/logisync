from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(String, primary_key=True, index=True)
    tracking_number = Column(String, unique=True, index=True, nullable=False)
    sender_name = Column(String, nullable=False)
    recipient_name = Column(String, nullable=False)
    destination_address = Column(String, nullable=False)
    weight = Column(Float, nullable=False)
    customer_email = Column(String, nullable=False)
    status = Column(String, default="ORDER_CREATED")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True, index=True)
    shipment_id = Column(String, ForeignKey("shipments.id"), nullable=False)
    status_checkpoint = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())