import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "..";

export function useInfiniteProducts() {
  return useInfiniteQuery({
    queryKey: ["products-infinite"],
    queryFn: async ({ pageParam }) => await fetchProducts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
