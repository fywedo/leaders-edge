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
  useAdminSiteSettings,
  useDeleteFAQ,
  useLeads,
  useUpdateSiteSettings,
  useUpsertFAQ,
} from "@/hooks/useAdmin";
import type { FAQ } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogIn,
  MessageSquare,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function LoginGate({ children }: { children: React.ReactNode }) {
  const { loginStatus, login } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <Card className="border border-border bg-card shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="font-display text-2xl text-foreground">
                Admin Access
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in with Internet Identity to access the dashboard.
              </p>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                className="w-full"
                size="lg"
                onClick={() => login()}
                data-ocid="admin.login_button"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign in with Internet Identity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function StatCards() {
  const { data: leads = [], isLoading: leadsLoading } = useLeads();
  const { data: faqs = [], isLoading: faqsLoading } = useAdminFAQs();
  const { data: settings, isLoading: settingsLoading } = useAdminSiteSettings();

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
      badge: settingsLoading
        ? null
        : settings?.facebookPixelId
          ? "Configured"
          : "Not Configured",
      badgeVariant: settings?.facebookPixelId ? "default" : "secondary",
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
                  className={
                    stat.badgeVariant === "default"
                      ? "bg-primary/20 text-primary border-primary/30"
                      : ""
                  }
                >
                  {stat.badge ?? "…"}
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
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              {stat.desc}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function LeadsTab() {
  const { data: leads = [], isLoading } = useLeads();

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {["sk-lead-1", "sk-lead-2", "sk-lead-3", "sk-lead-4", "sk-lead-5"].map(
          (k) => (
            <Skeleton key={k} className="h-12 w-full rounded-lg" />
          ),
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Customer Leads
        </h2>
        <Badge variant="secondary" className="font-mono">
          {leads.length} {leads.length === 1 ? "record" : "records"}
        </Badge>
      </div>

      {leads.length === 0 ? (
        <div
          className="text-center py-16 rounded-xl border border-dashed border-border bg-muted/20"
          data-ocid="leads.empty_state"
        >
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium">No leads yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Customer purchases will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Full Name
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Product ID
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Purchase Date
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Stripe Session
                  </th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <tr
                    key={String(lead.id)}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                    data-ocid={`leads.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-foreground font-medium">
                      {lead.fullName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {String(lead.productId)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(lead.purchaseDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary truncate block max-w-[160px]">
                        {lead.stripeSessionId || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const EMPTY_FAQ: Omit<FAQ, "id"> = {
  question: "",
  answer: "",
  displayOrder: 1n,
};

function FAQTab() {
  const { data: faqs = [], isLoading } = useAdminFAQs();
  const upsert = useUpsertFAQ();
  const deleteFAQ = useDeleteFAQ();

  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState<Omit<FAQ, "id">>(EMPTY_FAQ);

  const startEdit = (faq: FAQ) => {
    setEditing(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      displayOrder: faq.displayOrder,
    });
  };

  const resetForm = () => {
    setEditing(null);
    setForm(EMPTY_FAQ);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Question and answer are required.");
      return;
    }
    const faqPayload: FAQ = {
      id: editing ? editing.id : 0n,
      question: form.question.trim(),
      answer: form.answer.trim(),
      displayOrder: form.displayOrder,
    };
    await upsert.mutateAsync(faqPayload);
    toast.success(
      editing ? "FAQ updated successfully." : "FAQ added successfully.",
    );
    resetForm();
  };

  const handleDelete = async (id: bigint) => {
    await deleteFAQ.mutateAsync(id);
    toast.success("FAQ deleted.");
  };

  const sortedFaqs = [...faqs].sort(
    (a, b) => Number(a.displayOrder) - Number(b.displayOrder),
  );

  return (
    <div className="space-y-8">
      {/* FAQ list */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">
            Published FAQs
          </h2>
          <Badge variant="secondary" className="font-mono">
            {faqs.length} items
          </Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {["sk-faq-1", "sk-faq-2", "sk-faq-3"].map((k) => (
              <Skeleton key={k} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : sortedFaqs.length === 0 ? (
          <div
            className="text-center py-10 rounded-xl border border-dashed border-border bg-muted/20"
            data-ocid="faqs.empty_state"
          >
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-foreground font-medium text-sm">No FAQs yet</p>
            <p className="text-muted-foreground text-xs mt-1">
              Add your first FAQ below.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedFaqs.map((faq, idx) => (
              <div
                key={String(faq.id)}
                className="rounded-lg border border-border bg-card p-4"
                data-ocid={`faqs.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">
                      {faq.question}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                      {faq.answer}
                    </p>
                    <span className="text-xs text-muted-foreground/60 mt-1 block">
                      Order: {String(faq.displayOrder)}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(faq)}
                      data-ocid={`faqs.edit_button.${idx + 1}`}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(faq.id)}
                      disabled={deleteFAQ.isPending}
                      data-ocid={`faqs.delete_button.${idx + 1}`}
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

      {/* Add / Edit form */}
      <div className="rounded-xl border border-border bg-card/60 p-6">
        <h3 className="text-base font-display font-semibold text-foreground mb-5">
          {editing ? "Edit FAQ" : "Add New FAQ"}
        </h3>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="faq-question"
              className="text-foreground mb-1.5 block"
            >
              Question
            </Label>
            <Input
              id="faq-question"
              value={form.question}
              onChange={(e) =>
                setForm((f) => ({ ...f, question: e.target.value }))
              }
              placeholder="Enter the FAQ question"
              data-ocid="faqs.question_input"
            />
          </div>
          <div>
            <Label
              htmlFor="faq-answer"
              className="text-foreground mb-1.5 block"
            >
              Answer
            </Label>
            <Textarea
              id="faq-answer"
              rows={4}
              value={form.answer}
              onChange={(e) =>
                setForm((f) => ({ ...f, answer: e.target.value }))
              }
              placeholder="Enter the FAQ answer"
              data-ocid="faqs.answer_textarea"
            />
          </div>
          <div className="max-w-[160px]">
            <Label htmlFor="faq-order" className="text-foreground mb-1.5 block">
              Display Order
            </Label>
            <Input
              id="faq-order"
              type="number"
              min={1}
              value={Number(form.displayOrder)}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  displayOrder: BigInt(e.target.value || "1"),
                }))
              }
              data-ocid="faqs.order_input"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              onClick={handleSave}
              disabled={upsert.isPending}
              data-ocid="faqs.save_button"
            >
              {upsert.isPending
                ? "Saving…"
                : editing
                  ? "Update FAQ"
                  : "Add FAQ"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                data-ocid="faqs.cancel_button"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  const { data: settings, isLoading } = useAdminSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const [pixelId, setPixelId] = useState("");

  useEffect(() => {
    if (settings?.facebookPixelId) {
      setPixelId(settings.facebookPixelId);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings.mutateAsync(pixelId.trim());
    toast.success("Site settings saved successfully.");
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-display font-semibold text-foreground mb-6">
        Site Settings
      </h2>
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <CardTitle className="text-base font-medium text-foreground">
              Facebook Pixel
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Track ad conversions and download events for campaign optimization.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <div>
              <Label
                htmlFor="pixel-id"
                className="text-foreground mb-1.5 block"
              >
                Facebook Pixel ID
              </Label>
              <Input
                id="pixel-id"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="Enter your Facebook Pixel ID"
                data-ocid="settings.pixel_id_input"
              />
              {pixelId && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Current:{" "}
                  <span className="text-primary font-mono">{pixelId}</span>
                </p>
              )}
            </div>
          )}
          <Button
            type="button"
            onClick={handleSave}
            disabled={updateSettings.isPending || isLoading}
            data-ocid="settings.save_button"
          >
            {updateSettings.isPending ? "Saving…" : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Admin() {
  return (
    <LoginGate>
      <div className="min-h-screen bg-background">
        {/* Admin header */}
        <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage leads, FAQs, and site settings
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Tabs defaultValue="overview" data-ocid="admin.tabs">
            <TabsList className="mb-8 bg-muted/40 border border-border h-auto p-1 gap-0.5 flex-wrap">
              <TabsTrigger
                value="overview"
                className="gap-1.5"
                data-ocid="admin.overview_tab"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="leads"
                className="gap-1.5"
                data-ocid="admin.leads_tab"
              >
                <Users className="w-3.5 h-3.5" />
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="faqs"
                className="gap-1.5"
                data-ocid="admin.faqs_tab"
              >
                <BookOpen className="w-3.5 h-3.5" />
                FAQ Management
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="gap-1.5"
                data-ocid="admin.settings_tab"
              >
                <Settings className="w-3.5 h-3.5" />
                Site Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" data-ocid="admin.overview_panel">
              <div className="mb-6">
                <h2 className="text-xl font-display font-semibold text-foreground">
                  Overview
                </h2>
                <p className="text-muted-foreground text-sm mt-0.5">
                  Key metrics at a glance
                </p>
              </div>
              <StatCards />
            </TabsContent>

            <TabsContent value="leads" data-ocid="admin.leads_panel">
              <LeadsTab />
            </TabsContent>

            <TabsContent value="faqs" data-ocid="admin.faqs_panel">
              <FAQTab />
            </TabsContent>

            <TabsContent value="settings" data-ocid="admin.settings_panel">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </LoginGate>
  );
}
