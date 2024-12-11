import { UserFormModalData, UseQueryProps } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser } from "..";

export function useEditUser({ closeDialog, queryClient }: UseQueryProps) {
  const editUserMutation = useMutation<void, Error, UserFormModalData>({
    mutationFn: async (user: UserFormModalData) => {
      if (!user.id) return;
      const data = await updateUser({ ...user, id: String(user?.id) });
      return data;
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
