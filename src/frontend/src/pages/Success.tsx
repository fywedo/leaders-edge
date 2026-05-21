import { trackPurchase } from "@/components/FacebookPixel";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Crown, Mail } from "lucide-react";
import { useEffect } from "react";

export default function Success() {
  const search = useSearch({ strict: false }) as {
    session_id?: string;
    value?: string;
  };
  const sessionId = search?.session_id ?? "";
  const purchaseValue = search?.value ? Number.parseFloat(search.value) : 0;

  useEffect(() => {
    trackPurchase(purchaseValue || 0, "USD");
  }, [purchaseValue]);

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full space-y-10" data-ocid="success.page">
          {/* Success icon + heading */}
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-lg">
                <CheckCircle2
                  className="w-12 h-12 text-primary"
                  strokeWidth={1.5}
                />
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
                You've made an excellent investment in your leadership journey.
                Welcome to the Leaders Edge collection.
              </p>
            </div>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/40" />
            <Crown className="w-4 h-4 text-primary/40" />
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Order info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-card border border-border/60 rounded-xl p-6 space-y-3"
              data-ocid="success.order_card"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Order Confirmed
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your order has been successfully processed and confirmed.
              </p>
              {sessionId && (
                <p className="text-xs text-muted-foreground font-mono truncate">
                  Ref: {sessionId}
                </p>
              )}
            </div>

            <div
              className="bg-card border border-border/60 rounded-xl p-6 space-y-3"
              data-ocid="success.download_card"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Download Coming Soon
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A secure download link will be sent to your email once your
                product is ready for delivery.
              </p>
            </div>
          </div>

          {/* What to expect */}
          <div className="bg-muted/30 border border-border/40 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              What Happens Next
            </h3>
            <ul className="space-y-3">
              {[
                "Your payment receipt has been sent to your email address.",
                "You'll receive a secure download link as soon as your premium resource is uploaded and ready.",
                "Your purchase grants lifetime access to your chosen resource — no subscription required.",
              ].map((item, idx) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-[10px] font-bold">
                      {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link to="/" data-ocid="success.browse_more_button">
              <Button
                variant="default"
                size="lg"
                className="gap-2 font-medium px-10"
              >
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
