import time
import json
import os
import boto3
from sqlalchemy.orm import sessionmaker
from database import engine
import models

# Standard database connection setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize AWS SQS Client
sqs = boto3.client('sqs', region_name='ap-south-1')
QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/334856751456/logisync-shipment-queue"

print(" SQS Background Worker listening for shipment events...")

while True:
    try:
        # Long poll for messages from the SQS Queue
        response = sqs.receive_message(
            QueueUrl=QUEUE_URL,
            MaxNumberOfMessages=1,
            WaitTimeSeconds=10
        )

        if 'Messages' in response:
            for msg in response['Messages']:
                receipt_handle = msg['ReceiptHandle']
                
                # 📦 UNWRAP THE SNS ENVELOPE HERE:
                sqs_body = json.loads(msg['Body'])
                
                # SNS puts the actual payload inside a string field named 'Message'
                if 'TopicArn' in sqs_body and 'Message' in sqs_body:
                    # Parse the inner shipment JSON payload
                    payload = json.loads(sqs_body['Message'])
                else:
                    # Fallback configuration in case it's a raw direct SQS message
                    payload = sqs_body

                shipment_id = payload.get("shipment_id")
                tracking_number = payload.get("tracking_number")

                if not shipment_id:
                    print("⚠️ Message skipped: No valid shipment_id found in payload.")
                    sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=receipt_handle)
                    continue

                print(f"📥 Received new shipment event via SNS fanout for ID: {shipment_id}")

                db = SessionLocal()
                try:
                    # --- STAGE 2: IN_TRANSIT (45 Second Mark) ---
                    time.sleep(45)
                    shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
                    if shipment:
                        shipment.status = "IN_TRANSIT"
                        db.commit()
                        print(f"📦 Shipment {tracking_number} is now IN_TRANSIT")

                    # --- STAGE 3: DELIVERED (Next 45 Second Mark) ---
                    time.sleep(45)
                    db.refresh(shipment)
                    if shipment:
                        shipment.status = "DELIVERED"
                        db.commit()
                        print(f"✅ Shipment {tracking_number} is now DELIVERED")

                except Exception as db_err:
                    print(f"Database update failure: {str(db_err)}")
                    db.rollback()
                finally:
                    db.close()

                # Remove item cleanly from queue so it isn't processed twice
                sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=receipt_handle)

    except Exception as e:
        print(f"Worker polling error: {str(e)}")
    
    # Tiny cycle rest to prevent CPU burn
    time.sleep(1)