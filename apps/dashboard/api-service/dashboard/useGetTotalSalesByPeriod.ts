import { useQuery } from "@tanstack/react-query";
import api from "..";
import { DashboardIndicator, DashboardIndicatorProps } from "@/types/types";

export function useGetTotalSalesByPeriod({
  start,
  end,
  token,
}: DashboardIndicatorProps) {
  return useQuery({
    queryKey: ["salesTotal", start, end],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (start) {
        queryParams.append("start", start);
      }

      if (end) {
        queryParams.append("end", end);
      }
      const query = queryParams.toString();

      return await api.get<DashboardIndicator>(
        `dashboard/sales-total?${query}`,
        {
          Authorization: token ?? "",
        }
      );
    },
  });
}
