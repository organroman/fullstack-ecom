import { Product } from "@/types/types";

import { useQuery } from "@tanstack/react-query";

import api from "..";

export function useGetProductById(id: string) {
  return useQuery<any, Error, Product>({
    queryKey: ["product", id],
    queryFn: async () => await api.get<Product>(`products/${id}`),
  });
}
