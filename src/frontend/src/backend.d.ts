import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface FAQ {
    id: FaqId;
    question: string;
    displayOrder: bigint;
    answer: string;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type LeadId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Lead {
    id: LeadId;
    purchaseDate: Timestamp;
    fullName: string;
    productId: ProductId;
    email: string;
    stripeSessionId: string;
}
export interface SiteSettings {
    facebookPixelId: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type FaqId = bigint;
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ProductId = bigint;
export interface Product {
    id: ProductId;
    title: string;
    description: string;
    productType: ProductType;
    isActive: boolean;
    price: bigint;
}
export enum ProductType {
    Playbook = "Playbook",
    Guide = "Guide",
    Compendium = "Compendium",
    Handbook = "Handbook",
    Framework = "Framework"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createLead(fullName: string, email: string, productId: ProductId, stripeSessionId: string): Promise<Lead>;
    deleteFAQ(id: FaqId): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getFAQs(): Promise<Array<FAQ>>;
    getLead(id: LeadId): Promise<Lead | null>;
    getLeads(): Promise<Array<Lead>>;
    getProducts(): Promise<Array<Product>>;
    getSiteSettings(): Promise<SiteSettings>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateSiteSettings(pixelId: string): Promise<SiteSettings>;
    upsertFAQ(faq: FAQ): Promise<FAQ>;
}
