import {
  ProductFormModalData,
  UseProductWithIdProps,
} from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "..";

export function useEditProduct({
  closeDialog,
  queryClient,
  view,
}: UseProductWithIdProps) {
  const editProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async (product: ProductFormModalData) => {
      const { images, ...rest } = product;
      const data = await updateProduct({
        product: {
          ...rest,
          category_id: Number(rest.category_id),
          price: Number(rest.price),
        },
        images: images,
      });
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been deleted");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editProductMutation };
}
