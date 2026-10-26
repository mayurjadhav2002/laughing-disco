import { API_ENDPOINTS } from "@/api";
import { apiClient } from "@/config/apiClient";
import type { DailyProfileResponse } from "@/types/wind";
import { useQuery } from "@tanstack/react-query";

export const useDailyProfile = (targetDate: string) => {
  const getDailyUrl = API_ENDPOINTS.WIND_ENERGY.DAILY;

  return useQuery<DailyProfileResponse>({
    queryKey: ["dailyProfile", targetDate],
    queryFn: async () => {
      const { data } = await apiClient.get(getDailyUrl(targetDate));
      return data;
    },
    enabled: !!targetDate, // run query if a date is selected
  });
};
