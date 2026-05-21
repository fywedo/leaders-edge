import { useSiteSettings } from "@/hooks/useProducts";
import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (
      command: string,
      event: string,
      params?: Record<string, unknown>,
    ) => void;
    _fbq: unknown;
  }
}

/** Injects the Facebook Pixel script once the pixel ID is loaded from backend. */
export default function FacebookPixel() {
  const { data: settings } = useSiteSettings();
  const pixelId = settings?.facebookPixelId;

  useEffect(() => {
    if (!pixelId) return;

    // Prevent double-injection
    if (document.getElementById("fb-pixel-script")) return;

    /* eslint-disable */
    ((f: Window, b: Document, e: string, v: string) => {
      if (typeof f.fbq === "function") return;
      const n = (...args: unknown[]) => {
        (n as unknown as { callMethod: (...a: unknown[]) => void }).callMethod
          ? (
              n as unknown as { callMethod: (...a: unknown[]) => void }
            ).callMethod(...args)
          : (n as unknown as { queue: unknown[] }).queue.push(args);
      };
      (n as unknown as { push: typeof n }).push = n;
      (n as unknown as { loaded: boolean }).loaded = true;
      (n as unknown as { version: string }).version = "2.0";
      (n as unknown as { queue: unknown[] }).queue = [];
      f.fbq = n as unknown as Window["fbq"];
      if (!f._fbq) f._fbq = f.fbq;
      const t = b.createElement(e) as HTMLScriptElement;
      t.id = "fb-pixel-script";
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js",
    );
    /* eslint-enable */

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }, [pixelId]);

  return null;
}

/** Call on every route change. */
export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
}

/** Call when a purchase is completed. */
export function trackPurchase(value: number, currency = "USD") {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }
}

/** Call when a lead form is submitted. */
export function trackLead() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}
