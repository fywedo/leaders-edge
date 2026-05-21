import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function Checkout() {
  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div
          className="max-w-lg w-full text-center space-y-8"
          data-ocid="checkout.page"
        >
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-muted/60 border border-border/60 flex items-center justify-center">
              <AlertTriangle className="w-9 h-9 text-primary/70" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
              Session Expired
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Your session has expired or checkout was cancelled. No charges
              have been made to your account.
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Body copy */}
          <div className="bg-card border border-border/60 rounded-xl p-6 text-left space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you believe this is an error, or if you were in the middle of
              completing your purchase, please try again. Our premium resources
              are waiting for you.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Have questions before purchasing?{" "}
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("support")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Visit our FAQ
              </button>{" "}
              for answers.
            </p>
          </div>

          {/* CTA */}
          <Link to="/" data-ocid="checkout.back_home_button">
            <Button
              variant="default"
              size="lg"
              className="gap-2 font-medium px-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
