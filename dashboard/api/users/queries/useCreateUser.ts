import { UseQueryProps, UserFormModalData } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser } from "..";

export function useCreateUser({ closeDialog, queryClient }: UseQueryProps) {
  const mutation = useMutation<void, Error, UserFormModalData>({
    mutationFn: async (user: UserFormModalData) => {
      const data = await createUser(user);
      return data;
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
