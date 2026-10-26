import { API_ENDPOINTS } from "@/api";
import { apiClient } from "@/config/apiClient";
import type { MonthlySummaryResponse } from "@/types/wind";
import { useQuery } from "@tanstack/react-query";

export const useWindSummary = () => {
  return useQuery<MonthlySummaryResponse>({
    queryKey: ["windSummary"],
    queryFn: async () => {
      const endpoint = API_ENDPOINTS.WIND_ENERGY.SUMMARY;
      const { data } = await apiClient.get(endpoint);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
};
