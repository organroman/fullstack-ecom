import { CategoryFormModalData } from "@/types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateCategory } from "..";

interface UseCategoryProps {
  closeDialog: () => void;
  queryClient: QueryClient;
}

interface UseCategoryWithIdProps extends UseCategoryProps {
  id: number;
}

export function useUpdateCategory({
  closeDialog,
  queryClient,
}: UseCategoryWithIdProps) {
  const editCategoryMutation = useMutation<void, Error, CategoryFormModalData>({
    mutationFn: async (data) => {
      console.log(data);
      const res = await updateCategory(data);
      return res;
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
