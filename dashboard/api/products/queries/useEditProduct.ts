import {
  Product,
  ProductFormModalData,
  UseProductWithIdProps,
} from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api";

export function useEditProduct({
  closeDialog,
  queryClient,
  view,
  token,
}: UseProductWithIdProps) {
  const editProductMutation = useMutation<Product, Error, ProductFormModalData>(
    {
      mutationFn: async (product: ProductFormModalData) => {
        const { images, ...rest } = product;

        const payload = {
          product: {
            ...rest,
            category_id: Number(rest.category_id),
            price: Number(rest.price),
          },
          images: images,
        };
        return await api.put<Product>(`products/${product.id}`, payload, {
          Authorization: token ?? "",
        });
      },

      onSuccess: () => {
        toast.success("Product has been updated");
        closeDialog();
        queryClient.invalidateQueries({
          queryKey: [view === "table" ? "products" : "products-infinite"],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  return { editProductMutation };
}
