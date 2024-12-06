import { Category, CategoryFormModalData } from "@/types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory } from "..";

interface UseCategoryProps {
  closeDialog: () => void;
  queryClient: QueryClient;
}

//TODO: replace with update

export function useUpdateCategory({
  closeDialog,
  queryClient,
}: UseCategoryProps) {
  const editCategoryMutation = useMutation<void, Error, Category>({
    mutationFn: async (payload: CategoryFormModalData) => {
      const data = await createCategory(payload);
      return data;
    },

    onSuccess: () => {
      toast.success("Category has been created");
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
