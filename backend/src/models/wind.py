from sqlalchemy import Column, Integer, Float, DateTime
from src.db.database import Base


class ActualGeneration(Base):
    __tablename__ = "actual_generation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(DateTime, unique=True, index=True, nullable=False)
    generation = Column(Float, nullable=False)


class ForecastGeneration(Base):
    __tablename__ = "forecast_generation"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    start_time = Column(DateTime, index=True, nullable=False)
    publish_time = Column(DateTime, nullable=False)
    generation = Column(Float, nullable=False)
    horizon_hours = Column(Float, nullable=False) 