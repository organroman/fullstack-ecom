import { useQuery } from "@tanstack/react-query";
import api from "@/api-service";
import { Product } from "@/types/types";

interface UseProductById {
  productId: number;
}

export function useProductById({ productId }: UseProductById) {
  return useQuery<Product, Error, Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      return await api.get<Product>(`products/${productId}`);
    },
  });
}
