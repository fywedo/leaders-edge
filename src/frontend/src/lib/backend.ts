import { ShoppingItem, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { FAQ, Lead, Product, SiteSettings } from "@/types";

/**
 * Returns the typed backend actor.
 * Use this in hooks — not directly in components.
 */
export function useBackendActor() {
  return useActor(createActor);
}

/**
 * Type-safe wrappers around raw actor calls.
 * These are called inside React Query hooks.
 */
export async function getProducts(
  actor: Awaited<ReturnType<typeof createActor>>
): Promise<Product[]> {
  return actor.getProducts() as Promise<Product[]>;
}

export async function getFAQs(
  actor: Awaited<ReturnType<typeof createActor>>
): Promise<FAQ[]> {
  return actor.getFAQs() as Promise<FAQ[]>;
}

export async function getSiteSettings(
  actor: Awaited<ReturnType<typeof createActor>>
): Promise<SiteSettings> {
  return actor.getSiteSettings() as Promise<SiteSettings>;
}

export async function createCheckoutSession(
  actor: Awaited<ReturnType<typeof createActor>>,
  items: ShoppingItem[],
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  return actor.createCheckoutSession(items, successUrl, cancelUrl) as Promise<string>;
}
