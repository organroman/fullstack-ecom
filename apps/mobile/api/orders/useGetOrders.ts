import { Order } from "@/types/types";

import { useQuery } from "@tanstack/react-query";
import api from "..";
import { useAuth } from "@/store/authStore";

export function useGetOrders() {
  return useQuery<any, Error, { orders: Order[] }>({
    queryKey: ["orders"],
    queryFn: async () => {
      const token = useAuth.getState().token;

      if (!token) {
        throw new Error("Unauthorized");
      }
      return await api.get(`orders`, { Authorization: token });
    },
  });
}
