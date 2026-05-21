export type ProductType =
  | "Compendium"
  | "Framework"
  | "Playbook"
  | "Guide"
  | "Handbook";

export interface Product {
  id: bigint;
  title: string;
  description: string;
  productType: ProductType;
  isActive: boolean;
  price: bigint;
}

export interface Lead {
  id: bigint;
  fullName: string;
  email: string;
  productId: bigint;
  purchaseDate: bigint;
  stripeSessionId: string;
}

export interface FAQ {
  id: bigint;
  question: string;
  answer: string;
  displayOrder: bigint;
}

export interface SiteSettings {
  facebookPixelId: string;
}

export interface CheckoutSessionResult {
  ok?: string;
  err?: string;
}
