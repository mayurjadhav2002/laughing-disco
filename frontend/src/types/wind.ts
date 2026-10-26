export interface MonthlySummaryResponse {
  mae: number;
  dependable_capacity_mw: number;
  average_generation: number;
}

export interface IntradayPoint {
  start_time: string; // ISO datetime string
  actual_generation: number | null;
  forecast_generation: number | null;
  error_mw: number | null;
}

export interface DailyProfileResponse {
  date: string; // Format "YYYY-MM-DD"
  avg_actual: number;
  avg_forecast: number;
  daily_mae: number;
  data: IntradayPoint[];
}
