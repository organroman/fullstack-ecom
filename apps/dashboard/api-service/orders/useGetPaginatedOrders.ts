import { Orders } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import api from "..";

interface UseGetPaginatedOrders {
  query: string;
  enabled: boolean;
}

export function usePaginatedOrders({ query, enabled }: UseGetPaginatedOrders) {
  return useQuery<Orders>({
    queryKey: ["orders", query],
    queryFn: async () => {
      return await api.get<Orders>(`orders?${query}`);
    },
    enabled: enabled,
  });
}
