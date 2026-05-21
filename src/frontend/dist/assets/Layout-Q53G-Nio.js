import { j as jsxRuntimeExports, L as Link } from "./index-BDmAAkp7.js";
import { c as createLucideIcon } from "./button-DuFqpJyI.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
];
const Crown = createLucideIcon("crown", __iconNode);
function Layout({ children }) {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border/60 shadow-sm sticky top-0 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "flex items-center gap-2.5 group",
          "data-ocid": "nav.logo_link",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center transition-smooth group-hover:bg-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-semibold tracking-wide text-primary", children: "Leaders Edge" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "nav",
        {
          className: "hidden md:flex items-center gap-8",
          "aria-label": "Main navigation",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200",
                "data-ocid": "nav.home_link",
                children: "Home"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  (_a = document.getElementById("products")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                className: "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200",
                "data-ocid": "nav.products_link",
                children: "Products"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  (_a = document.getElementById("support")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                className: "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200",
                "data-ocid": "nav.support_link",
                children: "Support"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/20 transition-smooth",
          "data-ocid": "nav.cta_button",
          onClick: (e) => {
            var _a;
            e.preventDefault();
            (_a = document.getElementById("products")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-3.5 h-3.5" }),
            "View Collection"
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 bg-background", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-card border-t border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold text-primary", children: "Leaders Edge" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Premium resources for executives and leaders who drive lasting impact." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Navigate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/",
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "footer.home_link",
                children: "Home"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = document.getElementById("products")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "footer.products_link",
                children: "Products"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = document.getElementById("support")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
                },
                className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
                "data-ocid": "footer.support_link",
                children: "Support"
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: "Legal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Privacy Policy" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Terms of Service" }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          year,
          " Leaders Edge. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Built with love using",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: caffeineUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-primary/70 hover:text-primary transition-colors",
              children: "caffeine.ai"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Crown as C,
  Layout as L
};
