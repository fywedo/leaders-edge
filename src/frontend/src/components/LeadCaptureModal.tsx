import { trackLead } from "@/components/FacebookPixel";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Crown, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface LeadCaptureModalProps {
  productId: number;
  productTitle: string;
  productPrice: number;
  productDescription: string;
  onClose: () => void;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(0)}`;
}

export default function LeadCaptureModal({
  productId,
  productTitle,
  productPrice,
  productDescription,
  onClose,
}: LeadCaptureModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function validateEmail(value: string) {
    if (!value) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
    return "";
  }

  function validateName(value: string) {
    if (!value.trim()) return "Full name is required.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ne = validateName(fullName);
    const ee = validateEmail(email);
    setNameError(ne);
    setEmailError(ee);
    if (ne || ee) return;

    setIsSubmitting(true);
    setSessionError("");

    try {
      const { url } = await api.checkout({ productId, fullName, email });
      trackLead();
      window.location.href = url;
    } catch (err) {
      setSessionError("Unable to create checkout session. Please try again or contact support.");
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && !isSubmitting) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border/60 rounded-xl shadow-[0_20px_60px_oklch(0.1_0.02_260/0.6)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          aria-describedby="lead-modal-desc"
        >
          <div className="relative px-6 pt-6 pb-4 border-b border-border/40">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">Premium Access</span>
            </div>
            <Dialog.Title className="font-display text-xl font-bold text-foreground leading-snug">
              {productTitle}
            </Dialog.Title>
            <Dialog.Description id="lead-modal-desc" className="mt-1 text-sm text-muted-foreground">
              Complete your details to proceed to secure checkout.{" "}
              <span className="text-primary font-semibold">{formatPrice(productPrice)}</span>
            </Dialog.Description>
            <Dialog.Close asChild disabled={isSubmitting}>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Alexandra Chen"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); if (nameError) setNameError(""); }}
                onBlur={() => setNameError(validateName(fullName))}
                className={`bg-background border-input ${nameError ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {nameError && <p className="text-xs text-destructive">{nameError}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-email" className="text-sm font-medium text-foreground">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-email"
                type="email"
                autoComplete="email"
                placeholder="e.g. alex@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                onBlur={() => setEmailError(validateEmail(email))}
                className={`bg-background border-input ${emailError ? "border-destructive" : ""}`}
                disabled={isSubmitting}
              />
              {emailError && <p className="text-xs text-destructive">{emailError}</p>}
            </div>

            {sessionError && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{sessionError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-5 text-sm shadow-[0_4px_16px_oklch(0.65_0.18_55/0.3)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparing Secure Checkout…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Proceed to Secure Checkout
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full text-muted-foreground hover:text-foreground text-sm"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground pt-1">
              🔒 Secure checkout powered by Stripe. Your information is protected.
            </p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
