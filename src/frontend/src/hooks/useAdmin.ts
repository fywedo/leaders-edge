import { api } from "@/lib/api";
import type { FAQ, Lead, Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: () => api.getLeads(),
  });
}

export function useAdminFAQs() {
  return useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: () => api.getFAQs(),
  });
}

export function useUpsertFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (faq: FAQ) => api.upsertFAQ(faq),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteFAQ(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useAdminProducts() {
  return useQuery<Product[]>({
    queryKey: ["adminProducts"],
    queryFn: () => api.getAdminProducts(),
  });
}

export function useUpsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => api.upsertProduct(product),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUploadPdf() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const { filePath } = await api.uploadPdf(file);
      return filePath;
    },
  });
}
