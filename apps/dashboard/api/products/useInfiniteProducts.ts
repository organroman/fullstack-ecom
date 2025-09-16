import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/api";
import { Products } from "@/types/types";

interface UseInfiniteProductsProps {
  search: string;
  token: string | null;
}

export function useInfiniteProducts({
  search,
  token,
}: UseInfiniteProductsProps) {
  return useInfiniteQuery({
    queryKey: ["products-infinite", search],
    queryFn: async ({ pageParam }) => {
      const queryParams = new URLSearchParams({
        page: pageParam.toString(),
        limit: String(10),
      });

      if (search) {
        queryParams.append("search", search);
      }

      const query = queryParams.toString();
      return await api.get<Products>(`products?${query}`, {
        Authorization: token ?? "",
      });
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
