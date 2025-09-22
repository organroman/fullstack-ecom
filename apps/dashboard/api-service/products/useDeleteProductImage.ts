import { View } from "@/types/types";

import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api-service";

export function useDeleteProductImage({
  queryClient,
  view,
}: {
  view: View;
  queryClient: QueryClient;
}) {
  const deleteProductImageMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`products/images/${id}`);
    },

    onSuccess: () => {
      toast.success("Image has been deleted");
      queryClient.invalidateQueries({
        queryKey: [view === "table" ? "products" : "products-infinite"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deleteProductImageMutation };
}
