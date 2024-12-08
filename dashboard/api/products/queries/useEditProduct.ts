import { ProductFormModalData, UseProductWithIdProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateProduct } from "..";

export function useEditProduct({
  id,
  closeDialog,
  queryClient,
  view,
}: UseProductWithIdProps) {
  const editProductMutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      images,
    }: ProductFormModalData) => {
      const data = await updateProduct(id, name, description, images, price);
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
