export const API_ENDPOINTS = {
  API_HEALTH: "/wind/health",
  WIND_ENERGY: {
    SUMMARY: "/wind/summary",
    DAILY: (targetDate: string) => `/wind/daily?target_date=${targetDate}`,
  },
} as const;

export const API_BASE_URL: string =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
