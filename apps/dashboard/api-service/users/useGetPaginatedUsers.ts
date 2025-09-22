import { useQuery } from "@tanstack/react-query";
import { Users } from "@/types/types";
import api from "@/api-service";

interface usePaginatedUsersProps {
  page: number;
  limit: number;
  search: string;
  role: string;
  token: string | null;
}

export function usePaginatedUsers({
  page,
  limit,
  search,
  role,
  token,
}: usePaginatedUsersProps) {
  return useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        queryParams.append("search", search);
      }

      if (role) {
        queryParams.append("role", role);
      }

      const query = queryParams.toString();

      return await api.get<Users>(`users?${query}`, {
        Authorization: token ?? "",
      });
    },
  });
}
