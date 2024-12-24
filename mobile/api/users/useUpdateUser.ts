import { User, UpdateUserSchema } from "@/types/types";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "@/store/authStore";
import api from "..";

export function useUpdateUser(user: User) {
  const updateUserMutation = useMutation({
    mutationFn: async ({ name, email, phone, address }: UpdateUserSchema) => {
      const token = useAuth.getState().token;
      if (!user.id || !token) {
        throw new Error("User id is missing");
      }
      const body = { name, email, phone, address };

      return await api.put<User>(`users/${user.id}`, body, {
        Authorization: token,
      });
    },
  });

  return { updateUserMutation };
}
