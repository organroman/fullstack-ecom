import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "..";

export function usePaginatedProducts(
  page: number,
  limit: number,
  search: string
) {
  return useQuery({
    queryKey: ["products", page, limit, search],
    queryFn: async () => await fetchProducts(page, limit, search),
  });
}
