import { CategoryFormModalData } from "@/types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory } from "..";

interface UseProductProps {
  closeDialog: () => void;
  queryClient: QueryClient;
}

export function useCreateCategory({
  closeDialog,
  queryClient,
}: UseProductProps) {
  const createCategoryMutation = useMutation<
    void,
    Error,
    CategoryFormModalData
  >({
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
  return { createCategoryMutation };
}
