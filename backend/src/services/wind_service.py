from sqlalchemy.orm import Session
from datetime import date
from src.models.wind import ActualGeneration, ForecastGeneration
from src.services.metrics import calculate_mae, calculate_dependable_capacity

class WindService:
    @staticmethod
    def get_joined_wind_data(db: Session):
        """Database operation: Fetches actuals joined with Day-Ahead (>24h) forecasts."""
        return db.query(
            ActualGeneration.start_time,
            ActualGeneration.generation.label("actual"),
            ForecastGeneration.generation.label("forecast")
        ).join(
            ForecastGeneration, 
            ActualGeneration.start_time == ForecastGeneration.start_time
        ).filter(
            # Enforce day-ahead horizon requirement
            ForecastGeneration.horizon_hours >= 24
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
        
        # Filter rows for the specific date
        day_data = [row for row in results if row.start_time.date() == target_date]
        
        intraday_points = []
        day_actuals = []
        day_forecasts = []
        abs_errors = []
        
        for row in day_data:
            if row.actual is not None:
                day_actuals.append(row.actual)
            if row.forecast is not None:
                day_forecasts.append(row.forecast)
                
            error = round(row.actual - row.forecast, 2) if row.actual and row.forecast else None
            if row.actual is not None and row.forecast is not None:
                abs_errors.append(abs(row.actual - row.forecast))
                
            intraday_points.append({
                "start_time": row.start_time,
                "actual_generation": row.actual,
                "forecast_generation": row.forecast,
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