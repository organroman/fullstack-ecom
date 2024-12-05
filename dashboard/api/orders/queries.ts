import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchOrderById, fetchOrders, updateOrderStatus } from "@/api/orders";

export function useUpdateOrderStatus(orderId: number) {
  const mutation = useMutation({
    mutationFn: (status: string) => updateOrderStatus(orderId, status),
    onSuccess: () => toast.success("Order status updated"),
    onError: (error) => toast.error(error.message),
  });

  return { updateStatus: mutation };
}
// ----------------------
export function useOrderById(orderId: number) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => await fetchOrderById(orderId),
  });
}
// ------------------------ 
export function usePaginatedOrders(
  page: number,
  limit: number,
  search: string,
  status: string
) {
  return useQuery({
    queryKey: ["orders", page, limit, search, status],
    queryFn: async () => await fetchOrders(page, limit, search, status),
  });
}
