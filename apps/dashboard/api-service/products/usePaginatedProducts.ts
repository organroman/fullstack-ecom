import { useQuery } from "@tanstack/react-query";
import api from "@/api-service";
import { Products } from "@/types/types";
interface UsePaginatedProductsProps {
  page: number;
  limit: number;
  search: string;
  token: string | null;
}

export function usePaginatedProducts({
  page,
  limit,
  search,
  token,
}: UsePaginatedProductsProps) {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        queryParams.append("search", search);
      }

      const query = queryParams.toString();
      return await api.get<Products>(`products?${query}`, {
        Authorization: token ?? "",
      });
    },
  });
}
