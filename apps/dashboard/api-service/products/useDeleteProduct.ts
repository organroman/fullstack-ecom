import { Product, UseProductProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api-service";

export function useDeleteProduct({
  closeDialog,
  queryClient,
  view,
  token,
}: UseProductProps) {
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete<Product>(`products/${id}`, {
        Authorization: token ?? "",
      });
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

  return { deleteProductMutation };
}
