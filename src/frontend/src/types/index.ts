export type ProductType =
  | "Compendium"
  | "Framework"
  | "Playbook"
  | "Guide"
  | "Handbook";

export interface Product {
  id: number;
  title: string;
  description: string;
  productType: string;
  isActive: boolean;
  price: number; // cents
  fileUrl: string;
}

export interface Lead {
  id: number;
  fullName: string;
  email: string;
  productId: number;
  purchasedAt: string; // ISO datetime string
  stripeSessionId: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
}
