import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { EOrderStatus, Order, OrderItem } from "@/types/types";
import api from "..";

interface UseUpdateOrderStatusProps {
  token: string | null;
  queryClient: QueryClient;
  order: Order | {};
}

export type UpdateOrderMutationParams = {
  status?: EOrderStatus;
  delivery_address?: string;
  updatedItems?: OrderItem[];
};

export function useUpdateOrder({
  token,
  queryClient,
  order,
}: UseUpdateOrderStatusProps) {
  const mutation = useMutation<Order, Error, UpdateOrderMutationParams>({
    mutationFn: async ({ status, delivery_address, updatedItems }) => {
      if (!isOrder(order)) {
        throw new Error("Invalid order");
      }
      const orderItems = updatedItems
        ? updatedItems.map((item) => ({
            id: item.id,
            order_id: order.id,
            quantity: item.quantity,
            price: item.price,
            product_id: item.product.id,
          }))
        : order?.items?.map((item) => ({
            id: item.id,
            order_id: order.id,
            quantity: item.quantity,
            price: item.price,
            product_id: item.product.id,
          }));

      const { user, items, ...rest } = order;
      return await api.put<Order>(
        `orders/${order.id}`,
        {
          order: {
            rest,
            status: status || order.status,
            delivery_address: delivery_address || order.delivery_address,
            user_id: order.user.id,
          },
          items: orderItems,
        },
        { Authorization: token ?? "" }
      );
    },
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => toast.error(error.message),
  });

  return { updateOrderMutation: mutation };
}

function isOrder(order: any): order is Order {
  return (
    order && typeof order === "object" && "id" in order && "items" in order
  );
}
