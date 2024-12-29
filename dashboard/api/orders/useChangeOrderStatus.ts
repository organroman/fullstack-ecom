import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EOrderStatus, Order } from "@/types/types";
import api from "..";

interface UseUpdateOrderStatusProps {
  orderId: number;
  token: string | null;
  queryClient: QueryClient;
}

export function useUpdateOrderStatus({
  orderId,
  token,
  queryClient,
}: UseUpdateOrderStatusProps) {
  const mutation = useMutation({
    mutationFn: async (status: EOrderStatus) => {
      return await api.put<Order>(
        `orders/${orderId}`,
        {
          status: status,
        },
        { Authorization: token ?? "" }
      );
    },
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateStatus: mutation };
}
