import { createActor } from "@/backend";
import type { FAQ } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useFAQs() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return [];
      const faqs = await actor.getFAQs();
      return faqs as FAQ[];
    },
    enabled: !!actor && !isFetching,
  });
}
