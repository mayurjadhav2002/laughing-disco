import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.core.config import settings 


def get_database() -> dict:
    if settings.DATABASE_URL:
        return {
            "URL": settings.DATABASE_URL,
            "engine_args": {}
        }
    else:
        os.makedirs("data", exist_ok=True)
        return {
            "URL": "sqlite:///./data/gridbricks.db",
            "engine_args": {"connect_args": {"check_same_thread": False}}
        }

db_config = get_database()

engine = create_engine(db_config["URL"], **db_config["engine_args"])
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()