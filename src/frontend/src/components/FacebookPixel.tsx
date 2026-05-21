import { useEffect } from "react";

declare global {
  interface Window {
    fbq: (command: string, event: string, params?: Record<string, unknown>) => void;
    _fbq: unknown;
  }
}

export default function FacebookPixel() {
  const pixelId = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;

  useEffect(() => {
    if (!pixelId) return;
    if (document.getElementById("fb-pixel-script")) return;

    /* eslint-disable */
    ((f: Window, b: Document, e: string, v: string) => {
      if (typeof f.fbq === "function") return;
      const n = (...args: unknown[]) => {
        (n as any).callMethod
          ? (n as any).callMethod(...args)
          : (n as any).queue.push(args);
      };
      (n as any).push = n;
      (n as any).loaded = true;
      (n as any).version = "2.0";
      (n as any).queue = [];
      f.fbq = n as unknown as Window["fbq"];
      if (!f._fbq) f._fbq = f.fbq;
      const t = b.createElement(e) as HTMLScriptElement;
      t.id = "fb-pixel-script";
      t.async = true;
      t.src = v;
      b.getElementsByTagName(e)[0]?.parentNode?.insertBefore(t, b.getElementsByTagName(e)[0]);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }, [pixelId]);

  return null;
}

export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
}

export function trackPurchase(value: number, currency = "USD") {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", { value, currency });
  }
}

export function trackLead() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead");
  }
}
