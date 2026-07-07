import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Dynamically locate the directory containing this database.py file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 2. Force the DB path to always lock onto backend-api/logisync.db
DB_PATH = os.path.join(BASE_DIR, "logisync.db")

# 3. Use that absolute path for the engine fallback string
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()