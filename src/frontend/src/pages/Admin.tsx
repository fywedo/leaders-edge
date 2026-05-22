import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminFAQs,
  useAdminProducts,
  useDeleteFAQ,
  useLeads,
  useUploadPdf,
  useUpsertFAQ,
  useUpsertProduct,
} from "@/hooks/useAdmin";
import { api, clearAdminToken, getAdminToken } from "@/lib/api";
import type { FAQ, Product } from "@/types";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Login Gate ──────────────────────────────────────────────────────────────

function LoginGate({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token: jwt } = await api.login(username, password);
      localStorage.setItem("admin_token", jwt);
      setToken(jwt);
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <Card className="border border-border bg-card shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl text-foreground">Admin Access</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">Sign in to access the dashboard.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-user" className="text-foreground mb-1.5 block">Username</Label>
                  <Input
                    id="admin-user"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-pass" className="text-foreground mb-1.5 block">Password</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Logout button injected via context via header — pass it down */}
      {children}
      <button
        type="button"
        id="admin-logout-trigger"
        className="hidden"
        onClick={handleLogout}
      />
    </>
  );
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function StatCards() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: faqs = [], isLoading: faqsLoading } = useAdminFAQs();
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;

  const stats = [
    {
      label: "Total Leads",
      value: leadsLoading ? null : leads.length,
      icon: <Users className="w-5 h-5 text-primary" />,
      desc: "Customers who purchased",
    },
    {
      label: "Total FAQs",
      value: faqsLoading ? null : faqs.length,
      icon: <MessageSquare className="w-5 h-5 text-primary" />,
      desc: "Published help articles",
    },
    {
      label: "Facebook Pixel",
      value: null,
      icon: <Settings className="w-5 h-5 text-primary" />,
      desc: "Ad tracking status",
      badge: pixelId ? "Configured" : "Not Configured",
      badgeVariant: pixelId ? "default" : "secondary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {stat.icon}
              </div>
              {stat.badge !== undefined && (
                <Badge
                  variant={stat.badgeVariant as "default" | "secondary"}
                  className={stat.badgeVariant === "default" ? "bg-primary/20 text-primary border-primary/30" : ""}
                >
                  {stat.badge}
                </Badge>
              )}
            </div>
            <p className="text-3xl font-display font-semibold text-foreground">
              {stat.value !== null && stat.value !== undefined ? (
                stat.value
              ) : stat.badge !== undefined ? (
                ""
              ) : (
                <Skeleton className="h-8 w-12" />
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">{stat.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab() {
  const { data: leads = [], isLoading } = useLeads();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const formatDate = (ts: string) =>
    new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((k) => (
          <Skeleton key={k} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const COLS = ["Full Name", "Email", "Phone", "Organization", "Date", "Ethics", "Stripe Session"];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-display font-semibold text-foreground">Customer Leads</h2>
        <Badge variant="secondary" className="font-mono">
          {leads.length} {leads.length === 1 ? "record" : "records"}
        </Badge>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border bg-muted/20">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No leads yet</p>
          <p className="text-muted-foreground text-sm mt-1">Customer purchases will appear here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  {COLS.map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <>
                    <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{lead.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.email}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{lead.phone || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{lead.organization || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(lead.purchasedAt)}</td>
                      <td className="px-4 py-3">
                        {lead.ethicsStatement ? (
                          <button
                            type="button"
                            onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                            className="text-xs text-primary hover:underline text-left max-w-[140px] block truncate"
                          >
                            {expandedId === lead.id ? "Collapse ▲" : `${lead.ethicsStatement.slice(0, 40)}…`}
                          </button>
                        ) : (
                          <span className="text-muted-foreground/50 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-primary truncate block max-w-[160px]">
                          {lead.stripeSessionId || "—"}
                        </span>
                      </td>
                    </tr>
                    {expandedId === lead.id && lead.ethicsStatement && (
                      <tr key={`${lead.id}-ethics`} className="bg-muted/30 border-b border-border/50">
                        <td colSpan={COLS.length} className="px-4 py-3">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Personal Code of Ethics</p>
                          <p className="text-sm text-foreground leading-relaxed">{lead.ethicsStatement}</p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAQ Tab ──────────────────────────────────────────────────────────────────

const EMPTY_FAQ: Omit<FAQ, "id"> = { question: "", answer: "", displayOrder: 1 };

function FAQTab() {
  const { data: faqs = [], isLoading } = useAdminFAQs();
  const upsert = useUpsertFAQ();
  const deleteFAQ = useDeleteFAQ();
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState<Omit<FAQ, "id">>(EMPTY_FAQ);

  const startEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, displayOrder: faq.displayOrder });
  };

  const resetForm = () => { setEditing(null); setForm(EMPTY_FAQ); };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    await upsert.mutateAsync({ id: editing ? editing.id : 0, ...form });
    toast.success(editing ? "FAQ updated." : "FAQ added.");
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await deleteFAQ.mutateAsync(id);
    toast.success("FAQ deleted.");
  };

  const sortedFaqs = [...faqs].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Published FAQs</h2>
          <Badge variant="secondary" className="font-mono">{faqs.length} items</Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((k) => <Skeleton key={k} className="h-20 w-full rounded-lg" />)}
          </div>
        ) : sortedFaqs.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-border bg-muted/20">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium text-sm">No FAQs yet</p>
            <p className="text-muted-foreground text-xs mt-1">Add your first FAQ below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedFaqs.map((faq, idx) => (
              <div key={faq.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{faq.question}</p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{faq.answer}</p>
                    <span className="text-xs text-muted-foreground/60 mt-1 block">Order: {faq.displayOrder}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(faq)}>Edit</Button>
                    <Button
                      type="button" size="sm" variant="destructive"
                      onClick={() => handleDelete(faq.id)}
                      disabled={deleteFAQ.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-6">
        <h3 className="text-base font-display font-semibold text-foreground mb-5">
          {editing ? "Edit FAQ" : "Add New FAQ"}
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="faq-question" className="text-foreground mb-1.5 block">Question</Label>
            <Input
              id="faq-question"
              value={form.question}
              onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="Enter the FAQ question"
            />
          </div>
          <div>
            <Label htmlFor="faq-answer" className="text-foreground mb-1.5 block">Answer</Label>
            <Textarea
              id="faq-answer"
              rows={4}
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              placeholder="Enter the FAQ answer"
            />
          </div>
          <div className="max-w-[160px]">
            <Label htmlFor="faq-order" className="text-foreground mb-1.5 block">Display Order</Label>
            <Input
              id="faq-order"
              type="number"
              min={1}
              value={form.displayOrder}
              onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value || "1") }))}
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" onClick={handleSave} disabled={upsert.isPending}>
              {upsert.isPending ? "Saving…" : editing ? "Update FAQ" : "Add FAQ"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;

  const handleLogout = () => {
    clearAdminToken();
    window.location.reload();
  };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-display font-semibold text-foreground">Site Settings</h2>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium text-foreground">Facebook Pixel</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Track ad conversions for campaign optimization.</p>
        </CardHeader>
        <CardContent>
          {pixelId ? (
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">Configured</Badge>
              <span className="text-sm font-mono text-muted-foreground">{pixelId}</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not configured. Set <code className="bg-muted px-1 rounded text-xs">VITE_FB_PIXEL_ID</code> in your GitHub Actions secret and redeploy.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium text-foreground">Session</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">You are logged in as admin.</p>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

const PRODUCT_TYPES: Product["productType"][] = [
  "Compendium", "Framework", "Playbook", "Guide", "Handbook",
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  title: "", description: "", productType: "Guide", price: 0, isActive: true, fileUrl: "",
};

function ProductsTab() {
  const { data: products = [], isLoading } = useAdminProducts();
  const upsert = useUpsertProduct();
  const uploadPdf = useUploadPdf();
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [priceInput, setPriceInput] = useState("0");

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, productType: p.productType, price: p.price, isActive: p.isActive, fileUrl: p.fileUrl });
    setPriceInput(String(p.price / 100));
  };

  const resetForm = () => { setEditing(null); setForm(EMPTY_PRODUCT); setPriceInput("0"); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    const payload: Product = {
      id: editing ? editing.id : 0,
      ...form,
      price: Math.round(Number.parseFloat(priceInput || "0") * 100),
    };
    await upsert.mutateAsync(payload);
    toast.success(editing ? "Product updated." : "Product created.");
    resetForm();
  };

  const handleToggleActive = async (p: Product) => {
    await upsert.mutateAsync({ ...p, isActive: !p.isActive });
    toast.success(p.isActive ? "Product deactivated." : "Product activated.");
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">All Products</h2>
          <Badge variant="secondary" className="font-mono">{products.length} items</Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((k) => <Skeleton key={k} className="h-20 w-full rounded-lg" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 rounded-xl border border-dashed border-border bg-muted/20">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium text-sm">No products yet</p>
            <p className="text-muted-foreground text-xs mt-1">Add your first product below.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm">{p.title}</p>
                      <Badge
                        variant={p.isActive ? "default" : "secondary"}
                        className={p.isActive ? "bg-primary/20 text-primary border-primary/30 text-xs" : "text-xs"}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs font-mono">{p.productType}</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-4 mt-1.5">
                      <span className="text-xs text-primary font-semibold">${(p.price / 100).toFixed(2)}</span>
                      {p.fileUrl ? (
                        <span className="text-xs text-primary/70 truncate max-w-[200px]">📄 {p.fileUrl}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">No PDF uploaded</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button type="button" size="sm" variant="outline" onClick={() => startEdit(p)}>Edit</Button>
                    <Button
                      type="button" size="sm"
                      variant={p.isActive ? "destructive" : "outline"}
                      onClick={() => handleToggleActive(p)}
                      disabled={upsert.isPending}
                    >
                      {p.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-6">
        <h3 className="text-base font-display font-semibold text-foreground mb-5">
          {editing ? "Edit Product" : "Add New Product"}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-1.5 block">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Product title"
              />
            </div>
            <div>
              <Label className="text-foreground mb-1.5 block">Type</Label>
              <select
                value={form.productType}
                onChange={(e) => setForm((f) => ({ ...f, productType: e.target.value as Product["productType"] }))}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <Label className="text-foreground mb-1.5 block">Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Product description"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-foreground mb-1.5 block">Price (USD)</Label>
              <Input
                type="number" min="0" step="0.01"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="e.g. 49.00"
              />
            </div>
            <div>
              <Label className="text-foreground mb-1.5 block">PDF File</Label>
              <Input
                value={form.fileUrl}
                onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
                placeholder="Upload a PDF or enter filename"
                className="text-sm"
              />
              <label className="mt-2 flex items-center gap-2 cursor-pointer w-fit">
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const filename = await uploadPdf.mutateAsync(file);
                      setForm((f) => ({ ...f, fileUrl: filename }));
                      toast.success("PDF uploaded successfully.");
                    } catch {
                      toast.error("Upload failed. Please try again.");
                    }
                    e.target.value = "";
                  }}
                />
                <Button type="button" variant="outline" size="sm" disabled={uploadPdf.isPending} asChild>
                  <span className="gap-1.5 flex items-center">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadPdf.isPending ? "Uploading…" : "Upload PDF"}
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="product-active"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="product-active" className="text-foreground cursor-pointer">
              Active (visible on storefront)
            </Label>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" onClick={handleSave} disabled={upsert.isPending}>
              {upsert.isPending ? "Saving…" : editing ? "Update Product" : "Add Product"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Admin() {
  return (
    <LoginGate>
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground leading-tight">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage products, leads, FAQs, and settings</p>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          <Tabs defaultValue="overview">
            <TabsList className="mb-8 bg-muted/40 border border-border h-auto p-1 gap-0.5 flex-wrap">
              <TabsTrigger value="overview" className="gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" /> Overview
              </TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5">
                <Package className="w-3.5 h-3.5" /> Products
              </TabsTrigger>
              <TabsTrigger value="leads" className="gap-1.5">
                <Users className="w-3.5 h-3.5" /> Leads
              </TabsTrigger>
              <TabsTrigger value="faqs" className="gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> FAQ Management
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="mb-6">
                <h2 className="text-xl font-display font-semibold text-foreground">Overview</h2>
                <p className="text-muted-foreground text-sm mt-0.5">Key metrics at a glance</p>
              </div>
              <StatCards />
            </TabsContent>

            <TabsContent value="products"><ProductsTab /></TabsContent>
            <TabsContent value="leads"><LeadsTab /></TabsContent>
            <TabsContent value="faqs"><FAQTab /></TabsContent>
            <TabsContent value="settings"><SettingsTab /></TabsContent>
          </Tabs>
        </main>
      </div>
    </LoginGate>
  );
}
