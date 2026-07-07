CREATE TABLE shipments (
    id TEXT PRIMARY KEY,
    tracking_number TEXT UNIQUE NOT NULL,
    sender_name TEXT NOT NULL,
    recipient_name TEXT NOT NULL,
    designation_address TEXT NOT NULL,
    weight REAL NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE milestones (
    id TEXT PRIMARY KEY,
    shipment_id TEXT NOT NULL,
    status_checkpoint TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments (id)
    );