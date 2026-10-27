import logging
import pandas as pd
from datetime import date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from src.db.database import SessionLocal, engine
from src.core.config import settings
from src.models.wind import ActualGeneration, ForecastGeneration, Base
from src.services.elexon_client import ElexonClient

logger = logging.getLogger(__name__)

def ingest_actuals(db: Session, start_date: date, end_date: date):
    """ETL Pipeline for Actual Wind Generation."""
    logger.info("Starting Actuals (FUELHH) ingestion...")
    all_actuals = []

    for chunk_start, chunk_end in ElexonClient.generate_date_chunks(start_date, end_date, chunk_days=10):
        params = {
            "settlementDateFrom": chunk_start.isoformat(),
            "settlementDateTo": chunk_end.isoformat(),
            "fuelType": "WIND"
        }
        data = ElexonClient.fetch_with_retries(settings.ELEXON_BMRS_FUELHH_URL, params)
        if data:
            all_actuals.extend(data)

    if not all_actuals:
        return

    df = pd.DataFrame(all_actuals)
    df['startTime'] = pd.to_datetime(df['startTime'], utc=True)
    df['publishTime'] = pd.to_datetime(df['publishTime'], utc=True)
    df['generation'] = pd.to_numeric(df['generation'], errors='coerce').fillna(0.0)
    
    # Deduplicate: Keep latest published correction
    df = df.sort_values('publishTime').drop_duplicates(subset=['startTime'], keep='last')

    records = [
        {"start_time": row['startTime'].to_pydatetime().replace(tzinfo=None), "generation": float(row['generation'])}
        for _, row in df.iterrows()
    ]
    db.bulk_insert_mappings(ActualGeneration, records)
    logger.info(f"Inserted {len(records)} actual generation records.")


def ingest_forecasts(db: Session, start_date: date, end_date: date):
    """ETL Pipeline for Forecast Wind Generation with 30-minute interpolation."""
    logger.info("Starting Forecasts (WINDFOR) ingestion...")
    all_forecasts = []
    
    fetch_start = start_date - timedelta(days=2) 
    
    for chunk_start, chunk_end in ElexonClient.generate_date_chunks(fetch_start, end_date, chunk_days=7):
        params = {
            "publishDateTimeFrom": f"{chunk_start.isoformat()}T00:00:00Z",
            "publishDateTimeTo": f"{chunk_end.isoformat()}T23:59:59Z"
        }
        data = ElexonClient.fetch_with_retries(settings.ELEXON_BMRS_WINDFOR_URL, params)
        if data:
            all_forecasts.extend(data)

    if not all_forecasts:
        return

    df = pd.DataFrame(all_forecasts)
    df['startTime'] = pd.to_datetime(df['startTime'], utc=True)
    df['publishTime'] = pd.to_datetime(df['publishTime'], utc=True)
    df['generation'] = pd.to_numeric(df['generation'], errors='coerce').fillna(0.0)
    
   
    df = df.sort_values(['startTime', 'publishTime'])

    df['horizon_hours'] = (df['startTime'] - df['publishTime']).dt.total_seconds() / 3600.0

    # Filter - strict target month range
    start_ts, end_ts = pd.to_datetime(start_date, utc=True), pd.to_datetime(end_date, utc=True) + pd.Timedelta(days=1)
    mask = (df['startTime'] >= start_ts) & (df['startTime'] < end_ts) & (df['horizon_hours'] >= 0) & (df['horizon_hours'] <= 48)
    df_filtered = df[mask].copy()

    if df_filtered.empty:
        return

    df_filtered = df_filtered.set_index('startTime')
    # Group by publish_time or handle per horizon block, or resample directly on generation:
    df_resampled = df_filtered.resample('30min').agg({
        'generation': 'mean',
        'publishTime': 'max',
        'horizon_hours': 'mean'
    })
    
    # interpolate missing 30-min generation slots (e.g. bridging :00 and :00 hourly points)
    df_resampled['generation'] = df_resampled['generation'].interpolate(method='linear')
    df_resampled['horizon_hours'] = df_resampled['horizon_hours'].interpolate(method='linear').fillna(24.0)
    df_resampled['publishTime'] = df_resampled['publishTime'].ffill().bfill()
    
    df_resampled = df_resampled.reset_index()

    records = [
        {
            "start_time": row['startTime'].to_pydatetime().replace(tzinfo=None),
            "publish_time": row['publishTime'].to_pydatetime().replace(tzinfo=None) if pd.notnull(row['publishTime']) else row['startTime'].to_pydatetime().replace(tzinfo=None),
            "generation": float(row['generation']),
            "horizon_hours": round(float(row['horizon_hours']), 2)
        }
        for _, row in df_resampled.iterrows() if pd.notnull(row['generation'])
    ]
    
    if records:
        db.bulk_insert_mappings(ForecastGeneration, records)
        logger.info(f"Inserted {len(records)} interpolated 30-min forecast records.")


def seed_database():
    """Main orchestration function to be triggered on app startup."""
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    try:
        if db.query(ActualGeneration).count() > 0:
            logger.info("Database already seeded. Skipping ingestion.")
            return

        logger.info("Database is empty. Initiating January 2026 data sync...")
        target_start, target_end = date(2026, 1, 1), date(2026, 1, 31)

        ingest_actuals(db, target_start, target_end)
        ingest_forecasts(db, target_start, target_end)
        
        db.commit()
        logger.info("Data ingestion completed successfully.")

    except Exception as e:
        db.rollback()
        logger.error(f"Critical failure during seeding process: {e}")
    finally:
        db.close()