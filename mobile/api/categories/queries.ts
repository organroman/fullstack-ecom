import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from ".";

export function useGetCategories(query: string) {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await fetchCategories(query),
  });
}
