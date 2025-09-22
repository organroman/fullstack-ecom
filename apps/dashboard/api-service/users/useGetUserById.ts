import { useQuery } from "@tanstack/react-query";
import { User } from "@/types/types";
import api from "..";

interface useGetUserByIdProps {
  userId: number;
}

export function useGetUserById({ userId }: useGetUserByIdProps) {
  return useQuery<any, Error, User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      return await api.get<User>(`users/${userId}`);
    },
  });
}
