import { Order } from "@/types/types";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/authStore";
import api from "..";

export function useGetOrderById(id: string) {
  return useQuery<any, Error, { order: Order }>({
    queryKey: ["order", id],
    queryFn: async () => {
      const token = useAuth.getState().token;

      if (!token) {
        throw new Error("Unauthorized");
      }

      return await api.get(`orders/${id}`, { Authorization: token });
    },
  });
}
