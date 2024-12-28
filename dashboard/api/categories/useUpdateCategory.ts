import { Category, CategoryFormModalData, UseQueryProps } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api";

export function useUpdateCategory({
  closeDialog,
  queryClient,
  token,
}: UseQueryProps) {
  const editCategoryMutation = useMutation<
    Category,
    Error,
    CategoryFormModalData
  >({
    mutationFn: async (data) => {
      const payload = { ...data, display_order: parseInt(data.display_order) };
      return await api.put<Category>(`categories/${data.slug}`, payload, {
        Authorization: token ?? "",
      });
    },

    onSuccess: () => {
      toast.success("Category has been updated");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { editCategoryMutation };
}
