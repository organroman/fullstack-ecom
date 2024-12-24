import { useQuery } from "@tanstack/react-query";
import api from "..";
import { Categories } from "@/types/types";

export function useGetCategories(query: string) {
  return useQuery({
    queryKey: ["categories", query],
    queryFn: async () => await api.get<Categories>(`categories?${query}`),
  });
}
