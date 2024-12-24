import { useMutation } from "@tanstack/react-query";
import api from "..";
import { SignUpFormData, UpdatedUser } from "@/types/types";

export function useRegister(
  onSuccess: (data: UpdatedUser, variables: SignUpFormData) => void
) {
  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: SignUpFormData) => {
      const body = { name, email, password };

      return await api.post<UpdatedUser>(`auth/register`, body);
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
  });

  return { registerMutation };
}
