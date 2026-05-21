import Layout from "@/components/Layout";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFAQs } from "@/hooks/useFAQs";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Crown, Gem, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const PLACEHOLDER_PRODUCTS = [
  {
    id: BigInt(1),
    title: "The Executive Leadership Compendium",
    description:
      "A comprehensive reference for senior leaders navigating complex organizations. Distills proven frameworks from 200+ leadership studies into actionable insight.",
    productType: "Compendium" as const,
    price: BigInt(9700),
    isActive: true,
  },
  {
    id: BigInt(2),
    title: "The Strategic Influence Framework",
    description:
      "A structured system for building stakeholder alignment and driving change at scale. Used by Fortune 500 executives to accelerate high-stakes decisions.",
    productType: "Framework" as const,
    price: BigInt(7700),
    isActive: true,
  },
  {
    id: BigInt(3),
    title: "The High-Performance Team Playbook",
    description:
      "Step-by-step plays for building, motivating, and retaining elite teams. Covers hiring, onboarding, performance, and psychological safety.",
    productType: "Playbook" as const,
    price: BigInt(6700),
    isActive: true,
  },
  {
    id: BigInt(4),
    title: "The Consulting Clarity Guide",
    description:
      "Essential frameworks for structuring client engagements, communicating recommendations, and delivering measurable value on every project.",
    productType: "Guide" as const,
    price: BigInt(4700),
    isActive: true,
  },
  {
    id: BigInt(5),
    title: "The Leadership Mastery Handbook",
    description:
      "An interactive workbook for executives and coaches. Structured reflection exercises, goal-setting rituals, and accountability systems built for busy leaders.",
    productType: "Handbook" as const,
    price: BigInt(5700),
    isActive: true,
  },
];

const TYPE_COLORS: Record<string, string> = {
  Compendium: "bg-primary/20 text-primary border-primary/40",
  Framework: "bg-primary/15 text-primary border-primary/30",
  Playbook: "bg-primary/20 text-primary border-primary/40",
  Guide: "bg-primary/15 text-primary border-primary/30",
  Handbook: "bg-primary/20 text-primary border-primary/40",
};

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(0)}`;
}

function ProductCard({
  product,
  index,
  onBuy,
}: {
  product: Product;
  index: number;
  onBuy: (product: Product) => void;
}) {
  const typeStr = String(product.productType);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className="h-full flex flex-col bg-card border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_8px_32px_oklch(0.65_0.18_55/0.12)] group"
        data-ocid={`products.item.${index + 1}`}
      >
        <CardContent className="flex flex-col h-full p-6 gap-4">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                TYPE_COLORS[typeStr] ??
                "bg-primary/15 text-primary border-primary/30"
              } font-display tracking-wide`}
            >
              {typeStr}
            </span>
            <Gem className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <span className="font-display text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <Button
              type="button"
              onClick={() => onBuy(product)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-5"
              data-ocid={`products.buy_button.${index + 1}`}
            >
              Get Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FAQSection() {
  const { data: faqs, isLoading } = useFAQs();

  const sorted = faqs
    ? [...faqs].sort((a, b) => Number(a.displayOrder) - Number(b.displayOrder))
    : [];

  return (
    <section
      id="support"
      className="py-24 bg-card/50 border-t border-border/40"
      data-ocid="support.section"
    >
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" /> Support
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="space-y-3" data-ocid="support.loading_state">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border/40 p-5">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="support.empty_state"
          >
            <p className="text-sm">No FAQs available yet. Check back soon.</p>
          </div>
        ) : (
          <Accordion.Root type="single" collapsible className="space-y-3">
            {sorted.map((faq, i) => (
              <Accordion.Item
                key={String(faq.id)}
                value={String(faq.id)}
                className="border border-border/40 rounded-lg overflow-hidden bg-card/80"
                data-ocid={`support.item.${i + 1}`}
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex items-center justify-between w-full px-5 py-4 text-left font-semibold text-foreground hover:text-primary transition-colors duration-200 group">
                    <span className="pr-4 text-sm md:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown className="w-4 h-4 text-primary shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                  {faq.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { data: backendProducts } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : (PLACEHOLDER_PRODUCTS as Product[]);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-background"
        data-ocid="hero.section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.25 0.04 260 / 0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 20%, oklch(0.65 0.18 55 / 0.08) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-8"
          >
            <Crown className="w-3.5 h-3.5" />
            Premium Leadership Resources
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.08] tracking-tight max-w-4xl mx-auto"
          >
            Elevate Your Leadership.{" "}
            <span className="text-primary">Transform Your Impact.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Precision-crafted compendiums, frameworks, playbooks, guides, and
            handbooks for executives, managers, consultants, and coaches who
            refuse to settle for average.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              type="button"
              onClick={scrollToProducts}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6 shadow-[0_4px_24px_oklch(0.65_0.18_55/0.35)] hover:shadow-[0_6px_32px_oklch(0.65_0.18_55/0.5)] transition-all duration-300"
              data-ocid="hero.explore_button"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Premium Resources
            </Button>
          </motion.div>

          {/* Decorative divider */}
          <div className="mt-20 flex items-center gap-4 justify-center">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
            <Crown className="w-4 h-4 text-primary/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="py-24 bg-background"
        data-ocid="products.section"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              <Gem className="w-3 h-3" /> The Collection
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Premium Leadership Resources
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Curated tools for leaders who operate at the highest level. Each
              resource is engineered for real-world application and lasting
              impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                index={i}
                onBuy={setSelectedProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* Closing CTA */}
      <section
        className="py-24 bg-background border-t border-border/40"
        data-ocid="cta.section"
      >
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest">
              <Crown className="w-3 h-3" /> Lead with Purpose
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Ready to Lead with Purpose?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every resource in the Leaders Edge collection is designed to move
              you from insight to impact. The next level of your leadership
              journey starts here.
            </p>
            <Button
              type="button"
              onClick={scrollToProducts}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base px-8 py-6 shadow-[0_4px_24px_oklch(0.65_0.18_55/0.3)] transition-all duration-300"
              data-ocid="cta.explore_button"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Explore the Collection
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      {selectedProduct && (
        <LeadCaptureModal
          productId={selectedProduct.id}
          productTitle={selectedProduct.title}
          productPrice={selectedProduct.price}
          productDescription={selectedProduct.description}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </Layout>
  );
}
