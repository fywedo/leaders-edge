import { createActor } from "@/backend";
import type { FAQ, Lead, SiteSettings } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLeads() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      const leads = await actor.getLeads();
      return leads as Lead[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminFAQs() {
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

export function useUpsertFAQ() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (faq: FAQ) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.upsertFAQ(faq) as Promise<FAQ>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFAQ() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteFAQ(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useAdminSiteSettings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return { facebookPixelId: "" };
      return actor.getSiteSettings() as Promise<SiteSettings>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (pixelId: string) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSiteSettings(pixelId) as Promise<SiteSettings>;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}
