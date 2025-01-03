import { Category, CategoryFormModalData } from "@/types/types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api";

interface UseProductParams {
  closeDialog: () => void;
  queryClient: QueryClient;
  token: string | null;
}

export function useCreateCategory({
  closeDialog,
  queryClient,
  token,
}: UseProductParams) {
  const createCategoryMutation = useMutation<
    Category,
    Error,
    CategoryFormModalData
  >({
    mutationFn: async (payload: CategoryFormModalData) => {
      return await api.post<Category>("categories", payload, {
        Authorization: token ?? "",
      });
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
