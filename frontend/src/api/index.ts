type ApiValue = string | ((...args: string[]) => string);

export const API_ENDPOINTS: Record<string, ApiValue | Record<string, ApiValue>> = {
  API_HEALTH: "/health",
  WIND_ENERGY: {
    DASHBOARD: "/wind-energy/dashboard",
    SUMMARY: "/wind-energy/summary",
    GET_BY_RANGE: (start_date: string, end_date: string) =>
      `/wind-energy/generation?start_date=${start_date}&end_date=${end_date}`,
  },
};
