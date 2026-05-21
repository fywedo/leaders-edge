import type { FAQ, Lead, Product } from "@/types";

const BASE = "/api";

export function getAdminToken(): string | null {
  return localStorage.getItem("admin_token");
}

export function clearAdminToken(): void {
  localStorage.removeItem("admin_token");
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);

  if (res.status === 401) {
    clearAdminToken();
    // Let callers handle the redirect so hooks can react properly
    throw new Error("Unauthorized");
  }

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }

  return body as T;
}

function auth(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function json(extra: HeadersInit = {}): HeadersInit {
  return { "Content-Type": "application/json", ...extra };
}

export const api = {
  // --- Public ---
  getProducts: () => apiFetch<Product[]>("/products.php"),

  getFAQs: () => apiFetch<FAQ[]>("/faqs.php"),

  checkout: (body: { productId: number; fullName: string; email: string }) =>
    apiFetch<{ url: string }>("/checkout.php", {
      method: "POST",
      headers: json(),
      body: JSON.stringify(body),
    }),

  verifySession: (sessionId: string) =>
    apiFetch<{ paid: boolean; downloadToken?: string; productTitle?: string }>(
      `/checkout.php?session_id=${encodeURIComponent(sessionId)}`,
    ),

  // --- Admin ---
  login: (username: string, password: string) =>
    apiFetch<{ token: string }>("/auth.php", {
      method: "POST",
      headers: json(),
      body: JSON.stringify({ username, password }),
    }),

  getLeads: () => apiFetch<Lead[]>("/leads.php", { headers: auth() }),

  getAdminProducts: () =>
    apiFetch<Product[]>("/products.php?admin=1", { headers: auth() }),

  upsertProduct: (product: Partial<Product> & { id: number }) =>
    apiFetch<Product>("/products.php", {
      method: "POST",
      headers: json(auth()),
      body: JSON.stringify(product),
    }),

  upsertFAQ: (faq: Partial<FAQ> & { id: number }) =>
    apiFetch<FAQ>("/faqs.php", {
      method: "POST",
      headers: json(auth()),
      body: JSON.stringify(faq),
    }),

  deleteFAQ: (id: number) =>
    apiFetch<void>(`/faqs.php?id=${id}`, {
      method: "DELETE",
      headers: auth(),
    }),

  uploadPdf: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<{ filePath: string }>("/upload.php", {
      method: "POST",
      headers: auth(),
      body: form,
    });
  },
};
