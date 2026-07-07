import sys
import os
import time
import random

# Adjust python path dynamically so worker can resolve database models if needed,
# or connect directly using an independent SessionLocal instance.
# 1. Build the path string pointing to the API directory
API_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend-api"))

# 2. Append to sys.path so the runtime engine can locate files
if API_PATH not in sys.path:
    sys.path.insert(0, API_PATH)

# 3. Direct imports
from database import SessionLocal
import models
def run_worker_cycle():
    """
    Simulates an independent AWS SQS background processor service.
    It wakes up, checks the shared logisync.db file, and advances a pending item.
    """
    print("🤖 LogiSync Worker: Checking message queue state...")
    db = SessionLocal()
    try:
        # Pull records that aren't finalized yet
        pending_shipments = db.query(models.Shipment).filter(models.Shipment.status != "DELIVERED").all()
        
        if pending_shipments:
            target_shipment = random.choice(pending_shipments)
            old_status = target_shipment.status
            
            if target_shipment.status == "ORDER_CREATED":
                target_shipment.status = "PROCESSING"
            elif target_shipment.status == "PROCESSING":
                target_shipment.status = "IN_TRANSIT"
            elif target_shipment.status == "IN_TRANSIT":
                target_shipment.status = "DELIVERED"
                
            db.commit()
            print(f"⚡ [WORKER MATCH]: Advanced {target_shipment.tracking_number} from {old_status} ➔ {target_shipment.status}")
        else:
            print("💤 No pending queue workflows found. System fully synchronized.")
            
    except Exception as e:
        print(f"❌ Worker Process Exception: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 LogiSync Background Worker Daemon Initialized Successfully.")
    print("Simulating event-driven SQS queue loop context. Press Ctrl+C to exit.")
    while True:
        run_worker_cycle()
        time.sleep(15) # Heartbeat intervals matching blueprint execution sequence