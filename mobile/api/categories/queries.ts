import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from ".";

export function useGetCategories(query: string) {
  console.log("useGetCategories", query);
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await fetchCategories(query),
  });
}
