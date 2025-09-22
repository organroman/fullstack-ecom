import { useQuery } from "@tanstack/react-query";
import api from "@/api-service";
import { Categories } from "@/types/types";

interface UseGetCategoriesParams {
  search: string;
  token: string | null;
}

export function useGetCategories({ search, token }: UseGetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", search],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (search) {
        queryParams.append("search", search);
      }

      const query = queryParams.toString();

      return await api.get<Categories>(`categories?${query}`, {
        Authorization: token ?? "",
      });
    },
  });
}
