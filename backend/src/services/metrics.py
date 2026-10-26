import math
from typing import List, Dict

def calculate_mae(data_points: List[Dict]) -> float:
    """Calculates Mean Absolute Error between actuals and forecasts."""
    errors = [
        abs(pt["actual_generation"] - pt["forecast_generation"]) 
        for pt in data_points 
        if pt["actual_generation"] is not None and pt["forecast_generation"] is not None
    ]
    if not errors:
        return 0.0
    return round(sum(errors) / len(errors), 2)

def calculate_dependable_capacity(actuals: List[float]) -> float:
    """Calculates the 95% dependable capacity (value exceeded 95% of the time)."""
    valid_actuals = [x for x in actuals if x is not None]
    if not valid_actuals:
        return 0.0
    
    # Sort ascending: the 5th percentile represents the 95% exceedance threshold
    valid_actuals.sort()
    index = int(math.ceil(0.05 * len(valid_actuals))) - 1
    index = max(0, index)
    
    return round(valid_actuals[index], 2)