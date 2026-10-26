from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from src.db.database import get_db
from src.models.wind import ActualGeneration, ForecastGeneration
from src.schemas.wind_schema import DashboardResponse, DashboardDataPoint
from src.services.metrics import calculate_mae, calculate_dependable_capacity


router = APIRouter(prefix="/wind-energy", tags=["Wind Generation"])


@router.get("/dashboard", response_model=DashboardResponse)
def get_wind_dashboard(db: Session = Depends(get_db)):
    # Perform a SQL JOIN on start_time
    results = db.query(
        ActualGeneration.start_time,
        ActualGeneration.generation.label("actual"),
        ForecastGeneration.generation.label("forecast")
    ).outerjoin(
        ForecastGeneration, 
        ActualGeneration.start_time == ForecastGeneration.start_time
    ).order_by(ActualGeneration.start_time.asc()).all()

    data_points = []
    actual_values = []

    for row in results:
        actual_gen = row.actual
        forecast_gen = row.forecast
        
        actual_values.append(actual_gen)
        
        error_mw = None
        if actual_gen is not None and forecast_gen is not None:
            error_mw = round(actual_gen - forecast_gen, 2)

        data_points.append({
            "start_time": row.start_time,
            "actual_generation": actual_gen,
            "forecast_generation": forecast_gen,
            "error_mw": error_mw
        })

    mae = calculate_mae(data_points)
    dependable_capacity = calculate_dependable_capacity(actual_values)

    return DashboardResponse(
        mae=mae,
        dependable_capacity_mw=dependable_capacity,
        data=data_points
    )