import { useQuery } from "@tanstack/react-query";
import api from "..";
import { DashboardIndicatorProps } from "@/types/types";

interface RecentSale {
  orderId: number;
  userName: string;
  userEmail: string;
  orderAmount: number;
}

interface RecentSales {
  totalOrders: number;
  recentSales: RecentSale[];
}

export function useGetRecentSalesByPeriod({
  start,
  end,
}: DashboardIndicatorProps) {
  return useQuery({
    queryKey: ["salesRecent", start, end],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (start) {
        queryParams.append("start", start);
      }

      if (end) {
        queryParams.append("end", end);
      }
      const query = queryParams.toString();

      return await api.get<RecentSales>(`dashboard/sales-recent?${query}`);
    },
  });
}
