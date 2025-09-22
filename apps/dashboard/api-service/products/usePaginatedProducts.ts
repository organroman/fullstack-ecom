import { useQuery } from "@tanstack/react-query";
import api from "@/api-service";
import { Products } from "@/types/types";
interface UsePaginatedProductsProps {
  // page: number;
  // limit: number;
  // search: string;
  query: string;
  enabled: boolean;
}

export function usePaginatedProducts({
  // page,
  // limit,
  // search,
  query,
  enabled,
}: UsePaginatedProductsProps) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      // const queryParams = new URLSearchParams({
      //   page: page.toString(),
      //   limit: limit.toString(),
      // });

      // if (search) {
      //   queryParams.append("search", search);
      // }

      // const query = queryParams.toString();
      return await api.get<Products>(`products?${query}`);
    },
  });
}
