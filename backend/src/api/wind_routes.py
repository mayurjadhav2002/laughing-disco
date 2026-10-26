from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date

from src.db.database import get_db
from src.services.wind_service import WindService
from src.schemas.wind_schema import MonthlySummaryResponse, DailyProfileResponse

router = APIRouter(prefix="/wind", tags=["Wind Generation"])

@router.get("/summary", response_model=MonthlySummaryResponse)
def get_monthly_summary(db: Session = Depends(get_db)):
    metrics = WindService.get_monthly_metrics(db)
    return MonthlySummaryResponse(**metrics)


@router.get("/daily", response_model=DailyProfileResponse)
def get_daily_profile(
    target_date: date = Query(..., description="Target date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    profile = WindService.get_daily_profile_data(db, target_date)
    return DailyProfileResponse(**profile)


@router.get("/health")
def health_check():
    return {"status": "healthy"}