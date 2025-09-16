import { Product, ProductFormModalData, UseProductProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api";

export function useCreateProduct({
  view,
  closeDialog,
  queryClient,
  token,
}: UseProductProps) {
  const mutation = useMutation<Product, Error, ProductFormModalData>({
    mutationFn: async ({
      name,
      description,
      price,
      category_id,
      images,
    }: ProductFormModalData) => {
      const payload = {
        product: {
          name,
          description,
          price: Number(price),
          category_id: Number(category_id),
        },
        images,
      };

      return await api.post<Product>("products", payload, {
        Authorization: token ?? "",
      });
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
