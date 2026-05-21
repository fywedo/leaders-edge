import { api } from "@/lib/api";
import type { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.getProducts(),
  });
}
