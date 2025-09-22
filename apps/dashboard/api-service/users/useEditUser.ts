import { UserFormModalData, UseQueryProps, User } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/api-service";

export function useEditUser({ closeDialog, queryClient }: UseQueryProps) {
  const editUserMutation = useMutation({
    mutationFn: async (user: UserFormModalData) => {
      return await api.put<User>(`users/${user.id}`, {
        ...user,
        id: String(user?.id),
      });
    },

    onSuccess: () => {
      toast.success("User has been updated");
      closeDialog();
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { editUserMutation };
}
