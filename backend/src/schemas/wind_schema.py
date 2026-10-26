from pydantic import BaseModel
from datetime import date, datetime
from typing import List, Optional

class MonthlySummaryResponse(BaseModel):
    mae: float
    dependable_capacity_mw: float
    average_generation: float

class IntradayPoint(BaseModel):
    start_time: datetime
    actual_generation: Optional[float]
    forecast_generation: Optional[float]
    error_mw: Optional[float]

class DailyProfileResponse(BaseModel):
    date: date
    avg_actual: float
    avg_forecast: float
    daily_mae: float
    data: List[IntradayPoint]