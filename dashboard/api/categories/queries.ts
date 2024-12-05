import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from ".";

export function useGetCategories(search: string) {
  return useQuery({
    queryKey: ["categories", search],
    queryFn: async () => await fetchCategories(search),
  });
}
