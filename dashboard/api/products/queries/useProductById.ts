import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { Product } from "@/types/types";

interface UseProductById {
  productId: number;
  token: string | null;
}

export function useProductById({ productId, token }: UseProductById) {
  return useQuery<any, Error, Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      return await api.get<Product>(`products/${productId}`, {
        Authorization: token ?? "",
      });
    },
  });
}
