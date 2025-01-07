import { CartItem, Order } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

import api from "..";
import { useAuth } from "@/store/authStore";

interface UseCreateOrderProps {
  items: CartItem[];
  deliveryAddress: string;
  phone: string;
}

export function useCreateOrder({
  handleOnSuccess,
}: {
  handleOnSuccess: (data: Order) => void;
}) {
  const createOrderMutation = useMutation({
    mutationFn: async ({
      phone,
      deliveryAddress,
      items,
    }: UseCreateOrderProps) => {
      const token = useAuth.getState().token;
      const user = useAuth.getState().user;

      if (!token) {
        throw new Error(`Unauthorized`);
      }
      const mappedItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const body = {
        order: {
          delivery_address: deliveryAddress,
          contact_phone: phone,
          user_id: user?.id,
        },
        items: mappedItems,
      };

      const order = await api.post<Order>("orders", body, {
        Authorization: token,
      });

      return order;
    },

    onSuccess: (data) => {
      handleOnSuccess(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { createOrderMutation };
}
