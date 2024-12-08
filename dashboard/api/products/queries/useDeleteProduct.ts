import { UseProductProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { deleteProduct } from "..";

export function useDeleteProduct({
  closeDialog,
  queryClient,
  view,
}: UseProductProps) {
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await deleteProduct(id);
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

  return { deleteProductMutation };
}
