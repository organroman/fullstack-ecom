import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/types";
import api from "@/api";

interface useGetUserByIdProps {
  userId: number;
  token: string | null;
}

export function useGetUserById({ userId, token }: useGetUserByIdProps) {
  return useQuery<any, Error, User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await api.get<User>(`users/${userId}`, {
        Authorization: token ?? "",
      });
    },
  });
}
