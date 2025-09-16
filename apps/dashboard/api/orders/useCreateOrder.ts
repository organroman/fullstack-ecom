import { EOrderStatus, Order, OrderItem, User } from "@/types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import api from "..";
import { toast } from "sonner";

interface OrderFormData {
  user: User;
  status: EOrderStatus;
  items: OrderItem[];
}

interface useCreateOrderProps {
  queryClient: QueryClient;
  token: string | null;
  handleSuccess?: (data: Order) => void;
}

export function useCreateOrder({
  token,
  queryClient,
  handleSuccess,
}: useCreateOrderProps) {
  const mutation = useMutation<Order, Error, OrderFormData>({
    mutationFn: async ({ user, status, items }: OrderFormData) => {
      const mappedItems = items.map((i) => ({
        product_id: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const payload = {
        order: {
          delivery_address: user.address,
          contact_phone: user.phone,
          status: status,
          user_id: user.id,
        },
        items: mappedItems,
      };

      const order = await api.post<Order>("orders", payload, {
        Authorization: token ?? "",
      });

      return order;
    },
    onSuccess: (data) => {
      toast.success("Order has been created");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      handleSuccess && handleSuccess(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createOrderMutation: mutation };
}
