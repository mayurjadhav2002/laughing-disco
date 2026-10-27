from sqlalchemy.orm import Session
from datetime import date
from src.models.wind import ActualGeneration, ForecastGeneration
from src.services.metrics import calculate_mae, calculate_dependable_capacity
from sqlalchemy import func
class WindService:
    @staticmethod
    def get_joined_wind_data(db: Session):
                
        subq = db.query(
            ForecastGeneration.start_time,
            func.max(ForecastGeneration.publish_time).label("max_publish")
        ).filter(
            ForecastGeneration.horizon_hours >= 24,
            ForecastGeneration.horizon_hours <= 48
        ).group_by(ForecastGeneration.start_time).subquery()

        latest_forecasts = db.query(ForecastGeneration).join(
            subq,
            (ForecastGeneration.start_time == subq.c.start_time) & 
            (ForecastGeneration.publish_time == subq.c.max_publish)
        ).subquery()

        return db.query(
            ActualGeneration.start_time,
            ActualGeneration.generation.label("actual"),
            latest_forecasts.c.generation.label("forecast")
        ).outerjoin(
            latest_forecasts, 
            ActualGeneration.start_time == latest_forecasts.c.start_time
        ).order_by(ActualGeneration.start_time.asc()).all()


    @staticmethod
    def get_monthly_metrics(db: Session):
        results = WindService.get_joined_wind_data(db)
        
        actual_values = [row.actual for row in results if row.actual is not None]
        all_data_points = [{"actual_generation": row.actual, "forecast_generation": row.forecast} for row in results]
        
        return {
            "mae": calculate_mae(all_data_points),
            "dependable_capacity_mw": calculate_dependable_capacity(actual_values),
            "average_generation": round(sum(actual_values) / len(actual_values), 2) if actual_values else 0.0
        }


    @staticmethod
    def get_daily_profile_data(db: Session, target_date: date):
        results = WindService.get_joined_wind_data(db)
        
        day_data = [row for row in results if row.start_time.date() == target_date]
        
        intraday_points = []
        day_actuals = []
        day_forecasts = []
        abs_errors = []
        
        last_known_forecast = 0.0
        
        # First pass to find a valid starting forecast if available
        for row in day_data:
            if row.forecast is not None and row.forecast > 0:
                last_known_forecast = row.forecast
                break

        for row in day_data:
            if row.actual is not None:
                day_actuals.append(row.actual)
                
            if row.forecast is not None and row.forecast > 0:
                last_known_forecast = row.forecast
                
            forecast_val = row.forecast if (row.forecast is not None and row.forecast > 0) else last_known_forecast
            
            if forecast_val > 0:
                day_forecasts.append(forecast_val)
                
            error = round(row.actual - forecast_val, 2) if row.actual and forecast_val else None
            if row.actual is not None and forecast_val > 0:
                abs_errors.append(abs(row.actual - forecast_val))
                
            intraday_points.append({
                "start_time": row.start_time,
                "actual_generation": row.actual,
                "forecast_generation": forecast_val,
                "error_mw": error
            })
            
        avg_actual = round(sum(day_actuals) / len(day_actuals), 2) if day_actuals else 0.0
        avg_forecast = round(sum(day_forecasts) / len(day_forecasts), 2) if day_forecasts else 0.0
        daily_mae = round(sum(abs_errors) / len(abs_errors), 2) if abs_errors else 0.0

        return {
            "date": target_date,
            "avg_actual": avg_actual,
            "avg_forecast": avg_forecast,
            "daily_mae": daily_mae,
            "data": intraday_points
        }