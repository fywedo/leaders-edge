import { api } from "@/lib/api";
import type { FAQ } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useFAQs() {
  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: () => api.getFAQs(),
  });
}
