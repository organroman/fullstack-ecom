import { useQuery } from "@tanstack/react-query";
import api from "..";
import { Order } from "@/types/types";

interface UseGetOrderById {
  id: number;
}
export function useGetOrderById({ id }: UseGetOrderById) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      return await api.get<Order>(`orders/${id}`);
    },
  });
}
