import { useQuery } from "@tanstack/react-query";
import { fetchUserById, listUsers } from ".";
import { IUser } from "@/types/types";

// ------------------------
export function usePaginatedUsers(
  page: number,
  limit: number,
  search: string,
  role: string
) {
  return useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: async () => await listUsers(page, limit, search, role),
  });
}

// ----------------------
export function useUserById(userId: number) {
  return useQuery<any, Error, IUser>({
    queryKey: ["user", userId],
    queryFn: async () => await fetchUserById(userId),
  });
}
