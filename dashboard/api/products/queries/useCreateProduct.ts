import { ProductFormModalData, UseProductProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { createProduct } from "..";

export function useCreateProduct({
  view,
  closeDialog,
  queryClient,
}: UseProductProps) {
  const mutation = useMutation<void, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      category_id,
      images,
    }: ProductFormModalData) => {
      const data = await createProduct({
        product: {
          name: name,
          description: description,
          price: Number(price),
          category_id: Number(category_id),
        },
        images,
      });
      return data;
    },

    onSuccess: () => {
      toast.success("Product has been created");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: view === "table" ? ["products"] : ["products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { createProductMutation: mutation };
}
