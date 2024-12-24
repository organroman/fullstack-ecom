import { useAuth } from "@/store/authStore";
import { useMutation } from "@tanstack/react-query";
import api from "..";
import { UpdatedUser, User } from "@/types/types";

export function useChangePassword(onSuccess: (data: UpdatedUser) => void) {
  const changePasswordMutation = useMutation({
    mutationFn: async ({
      oldPassword,
      password,
    }: {
      oldPassword: string;
      password: string;
    }) => {
      const token = useAuth.getState().token;
      const user = useAuth.getState().user;

      if (!user || !token) {
        throw new Error("User is missing");
      }
      const body = { oldPassword, password };

      return await api.put<UpdatedUser>(
        `users/${user?.id}/change-password`,
        body,
        {
          Authorization: token,
        }
      );
    },
    onSuccess: (data) => onSuccess(data),
  });

  return { changePasswordMutation };
}
