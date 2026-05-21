import { Link } from "@tanstack/react-router";
import { Crown } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
              data-ocid="nav.logo_link"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center transition-smooth group-hover:bg-primary/30">
                <Crown className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold tracking-wide text-primary">
                Vanguard Executives
              </span>
            </Link>

            {/* Navigation */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Main navigation"
            >
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-ocid="nav.home_link"
              >
                Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-ocid="nav.products_link"
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("support")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                data-ocid="nav.support_link"
              >
                Support
              </button>
            </nav>

            {/* CTA */}
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-smooth"
              data-ocid="nav.cta_button"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Crown className="w-3.5 h-3.5" />
              View Collection
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <span className="font-display text-lg font-semibold text-primary">
                  Vanguard Executives
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium resources for executives and leaders who drive lasting
                impact.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Navigate
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.home_link"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("products")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.products_link"
                  >
                    Products
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("support")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-ocid="footer.support_link"
                  >
                    Support
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-muted-foreground">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground">
                    Terms of Service
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              © {year} Vanguard Executives. All rights reserved.
            </p>
            {/* <p className="text-xs text-muted-foreground">
              Built with love using{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary/70 hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
