import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Category, UseQueryProps } from "@/types/types";
import api from "@/api";

export function useDeleteCategory({
  closeDialog,
  queryClient,
  token,
}: UseQueryProps) {
  const deleteCategoryMutation = useMutation({
    mutationFn: async (slug: string) => {
      return await api.delete<Category>(`categories/${slug}`, {
        Authorization: token ?? "",
      });
    },

    onSuccess: () => {
      toast.success("Category has been deleted");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { deleteCategoryMutation };
}
