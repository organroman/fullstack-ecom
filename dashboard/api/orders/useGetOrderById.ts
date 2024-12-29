import { useQuery } from "@tanstack/react-query";
import api from "..";
import { Order } from "@/types/types";

interface UseGetOrderById {
  id: number;
  token: string | null;
}
export function useGetOrderById({ id, token }: UseGetOrderById) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      return await api.get<Order>(`orders/${id}`, {
        Authorization: token ?? "",
      });

      // await fetchOrderById(orderId),
    },
  });
}
