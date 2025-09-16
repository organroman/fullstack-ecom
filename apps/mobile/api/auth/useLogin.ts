import { useMutation } from "@tanstack/react-query";
import api from "..";
import { LoginFormData, UpdatedUser } from "@/types/types";

export function useLogin(onSuccess: (data: UpdatedUser) => void) {
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      const body = { email, password };

      return await api.post<UpdatedUser>(`auth/login`, body);
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  return { loginMutation };
}
