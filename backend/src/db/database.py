import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.config import settings 


if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL)
else:
    os.makedirs("data", exist_ok=True)
    engine = create_engine("sqlite:///./data/gridbricks.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()