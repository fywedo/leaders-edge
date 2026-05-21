import { trackPurchase } from "@/components/FacebookPixel";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Crown, Download, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";

type DownloadState = "idle" | "checking" | "ready" | "no-file" | "failed";

export default function Success() {
  const search = useSearch({ strict: false }) as {
    session_id?: string;
    value?: string;
    productId?: string;
  };
  const sessionId = search?.session_id ?? "";
  const purchaseValue = search?.value ? Number.parseFloat(search.value) : 0;

  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [downloadToken, setDownloadToken] = useState("");

  useEffect(() => {
    trackPurchase(purchaseValue || 0, "USD");
  }, [purchaseValue]);

  useEffect(() => {
    if (!sessionId) return;

    setDownloadState("checking");

    api
      .verifySession(sessionId)
      .then(({ paid, downloadToken: token }) => {
        if (!paid) {
          setDownloadState("failed");
          return;
        }
        if (!token) {
          setDownloadState("no-file");
          return;
        }
        setDownloadToken(token);
        setDownloadState("ready");
      })
      .catch(() => setDownloadState("failed"));
  }, [sessionId]);

  const downloadUrl = downloadToken ? `/api/download.php?token=${downloadToken}` : "";

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full space-y-10" data-ocid="success.page">
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                Purchase Confirmed
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
                Thank You for Your Purchase!
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
                You've made an excellent investment in your leadership journey. Welcome to the Vanguard Executives collection.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/40" />
            <Crown className="w-4 h-4 text-primary/40" />
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border/60 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Order Confirmed</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your order has been successfully processed and confirmed.
              </p>
              {sessionId && (
                <p className="text-xs text-muted-foreground font-mono truncate">Ref: {sessionId}</p>
              )}
            </div>

            <div className="bg-card border border-border/60 rounded-xl p-6 space-y-3">
              {downloadState === "checking" && (
                <>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <h3 className="text-sm font-semibold text-foreground">Preparing Download…</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Verifying your payment, please wait.</p>
                </>
              )}

              {downloadState === "ready" && (
                <>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Your Resource is Ready</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Click below to download your premium resource. Link valid for 48 hours.
                  </p>
                  <a href={downloadUrl} download>
                    <Button size="sm" className="w-full gap-2 mt-1">
                      <Download className="w-4 h-4" />
                      Download Now
                    </Button>
                  </a>
                </>
              )}

              {(downloadState === "idle" || downloadState === "no-file" || downloadState === "failed") && (
                <>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Check Your Email</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A download link has been sent to your email address and is valid for 48 hours.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="bg-muted/30 border border-border/40 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              What Happens Next
            </h3>
            <ul className="space-y-3">
              {[
                "Your payment receipt and download link have been sent to your email address.",
                "Your purchase grants lifetime access — no subscription required.",
                "Re-download using the secure link from your purchase confirmation email.",
              ].map((item, idx) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <Link to="/">
              <Button variant="default" size="lg" className="gap-2 font-medium px-10">
                <Crown className="w-4 h-4" />
                Browse More Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
