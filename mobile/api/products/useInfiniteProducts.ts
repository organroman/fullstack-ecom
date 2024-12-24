import { Products } from "@/types/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "..";

interface useInfiniteProductsProps {
  searchPhrase?: string;
  categoryId?: string;
}

export function useInfiniteProducts({
  searchPhrase,
  categoryId,
}: useInfiniteProductsProps) {
  return useInfiniteQuery({
    queryKey: ["products-infinite", searchPhrase, categoryId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: String(10),
      });

      if (searchPhrase) {
        params.append("search", searchPhrase);
      }

      if (categoryId) {
        params.append("categoryId", categoryId);
      }
      const path = `products?${params.toString()}`;

      return await api.get<Products>(path);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
