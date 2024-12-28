import { View } from "@/types/types";

import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api";

export function useDeleteProductImage({
  queryClient,
  view,
  token,
}: {
  view: View;
  queryClient: QueryClient;
  token: string | null;
}) {
  const deleteProductImageMutation = useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`products/images/${id}`, {
        Authorization: token ?? "",
      });
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
