import { UseQueryProps, User, UserFormModalData } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api";

export function useCreateUser({
  closeDialog,
  queryClient,
  token,
}: UseQueryProps) {
  const mutation = useMutation({
    mutationFn: async (user: UserFormModalData) => {
      return await api.post<User>("users", user, {
        Authorization: token ?? "",
      });
    },

    onSuccess: () => {
      toast.success("User has been created");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { createUserMutation: mutation };
}
