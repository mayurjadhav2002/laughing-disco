from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional

# Schema for Actual Data
class ActualResponse(BaseModel):
    start_time: datetime
    generation: float

    model_config = ConfigDict(from_attributes=True)

# Schema for Forecast Data
class ForecastResponse(BaseModel):
    start_time: datetime
    publish_time: datetime
    generation: float
    horizon_hours: float

    model_config = ConfigDict(from_attributes=True)

# Schema for Combined Dashboard Data (Actual vs Forecast)
class DashboardDataPoint(BaseModel):
    start_time: datetime
    actual_generation: Optional[float] = None
    forecast_generation: Optional[float] = None
    error_mw: Optional[float] = None

# Final Response Payload
class DashboardResponse(BaseModel):
    mae: float  
    dependable_capacity_mw: float # The calculated dependable reliable capacity
    data: List[DashboardDataPoint]