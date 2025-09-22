import { UseQueryProps, User, UserFormModalData } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/api-service";

interface CreateUserProps extends UseQueryProps {
  handleOnSuccess?: (data: User) => void;
}

export function useCreateUser({
  closeDialog,
  queryClient,
  token,
  handleOnSuccess,
}: CreateUserProps) {
  const mutation = useMutation({
    mutationFn: async (user: UserFormModalData) => {
      return await api.post<User>("users", user, {
        Authorization: token ?? "",
      });
    },

    onSuccess: (data) => {
      toast.success("User has been created");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      handleOnSuccess && handleOnSuccess(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { createUserMutation: mutation };
}
