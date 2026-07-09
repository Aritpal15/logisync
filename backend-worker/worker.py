import os
import time
import json
import boto3
from database import SessionLocal
import models

# Initialize SQS client
SQS_QUEUE_URL = "https://sqs.ap-south-1.amazonaws.com/334856751456/logisync-shipment-queue"
sqs_client = boto3.client("sqs", region_name="ap-south-1")

def process_shipment_lifecycle(shipment_id):
    """
    Simulates the shipping lifecycle quickly so you can take screenshots!
    """
    db = SessionLocal()
    try:
        shipment = db.query(models.Shipment).filter(models.Shipment.id == shipment_id).first()
        if not shipment:
            return

        # 1. Move to IN_TRANSIT almost instantly
        time.sleep(45) 
        shipment.status = "IN_TRANSIT"
        db.commit()
        print(f"📦 Shipment {shipment.tracking_number} is now IN_TRANSIT")

        # 2. Move to DELIVERED quickly right after
        time.sleep(45)
        shipment.status = "DELIVERED"
        db.commit()
        print(f"✅ Shipment {shipment.tracking_number} is now DELIVERED")

    except Exception as e:
        print(f"Error updating lifecycle: {str(e)}")
    finally:
        db.close()

def poll_queue():
    print(" SQS Background Worker listening for shipment events...")
    while True:
        try:
            # Pull messages from Amazon SQS
            response = sqs_client.receive_message(
                QueueUrl=SQS_QUEUE_URL,
                MaxNumberOfMessages=1,
                WaitTimeSeconds=5  # Long polling to reduce CPU usage
            )

            messages = response.get("Messages", [])
            for message in messages:
                body = json.loads(message["Body"])
                shipment_id = body.get("shipment_id")
                
                print(f"📥 Received new shipment event from SQS for ID: {shipment_id}")
                
                # Process the fast 4-second lifecycle transitions
                process_shipment_lifecycle(shipment_id)

                # Delete the message from the queue so it isn't processed again
                sqs_client.delete_message(
                    QueueUrl=SQS_QUEUE_URL,
                    ReceiptHandle=message["ReceiptHandle"]
                )

        except Exception as e:
            print(f"Worker polling error: {str(e)}")
            time.sleep(5)

if __name__ == "__main__":
    poll_queue()