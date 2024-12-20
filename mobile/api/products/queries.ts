import { useInfiniteQuery } from "@tanstack/react-query";
import { listProducts } from ".";

type useInfiniteProductsProps = {
  searchPhrase?: string;
  categoryId?: string;
};

export function useInfiniteProducts({
  searchPhrase,
  categoryId,
}: useInfiniteProductsProps) {
  return useInfiniteQuery({
    queryKey: ["products-infinite", searchPhrase, categoryId],
    queryFn: async ({ pageParam }) =>
      await listProducts(pageParam, 10, searchPhrase, categoryId),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
