import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteCategory } from "..";

interface UseCategoryProps {
  closeDialog: () => void;
  queryClient: QueryClient;
}

export function useDeleteCategory({
  closeDialog,
  queryClient,
}: UseCategoryProps) {
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const data = await deleteCategory(id);
      return data;
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
