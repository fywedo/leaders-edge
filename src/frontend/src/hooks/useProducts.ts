import { createActor } from "@/backend";
import type { Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getProducts();
      return products as Product[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return { facebookPixelId: "" };
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}
