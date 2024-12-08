import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "..";

export function useProductById(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => await fetchProductById(id),
  });
}
