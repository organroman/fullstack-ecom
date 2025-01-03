import { Orders } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import api from "..";

interface UseGetPaginatedOrders {
  page: number;
  limit: number;
  search: string;
  status: string;
  token: string | null;
}

export function usePaginatedOrders({
  page,
  limit,
  search,
  status,
  token,
}: UseGetPaginatedOrders) {
  return useQuery<Orders>({
    queryKey: ["orders", page, limit, search, status],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        queryParams.append("search", search);
      }

      if (status) {
        queryParams.append("status", status);
      }
      const query = queryParams.toString();

      return await api.get<Orders>(`orders?${query}`, {
        Authorization: token ?? "",
      });

      // await fetchOrders(page, limit, search, status)
    },
  });
}
