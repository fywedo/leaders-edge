import type { backendInterface } from "../backend";
import { ProductType, UserRole } from "../backend";

export const mockBackend: backendInterface = {
  assignCallerUserRole: async (_user, _role) => undefined,

  createCheckoutSession: async (_items, _successUrl, _cancelUrl) =>
    "mock_session_id_abc123",

  createLead: async (_fullName, _email, _productId, _stripeSessionId) => ({
    id: BigInt(1),
    purchaseDate: BigInt(Date.now() * 1_000_000),
    fullName: _fullName,
    productId: _productId,
    email: _email,
    stripeSessionId: _stripeSessionId,
  }),

  deleteFAQ: async (_id) => true,

  getCallerUserRole: async () => UserRole.guest,

  getFAQs: async () => [
    {
      id: BigInt(1),
      question: "How are the digital products delivered?",
      displayOrder: BigInt(1),
      answer:
        "Upon successful payment, you will receive instant access to download your purchased product directly from your confirmation page. A receipt is sent to your email.",
    },
    {
      id: BigInt(2),
      question: "Are there specific requirements for accessing the content?",
      displayOrder: BigInt(2),
      answer:
        "No special software is required. All products are delivered as high-quality PDF documents compatible with any device — desktop, tablet, or mobile.",
    },
    {
      id: BigInt(3),
      question: "What kind of support is available?",
      displayOrder: BigInt(3),
      answer:
        "Our support team is available to assist with any questions about your purchase. Use the FAQ widget on this page or contact us through the support portal.",
    },
    {
      id: BigInt(4),
      question: "Can I share the products with my team?",
      displayOrder: BigInt(4),
      answer:
        "Each purchase is for individual use. Team and enterprise licensing options are available — contact us for bulk pricing tailored to your organization.",
    },
  ],

  getLead: async (_id) => ({
    id: BigInt(1),
    purchaseDate: BigInt(Date.now() * 1_000_000),
    fullName: "Jane Executive",
    productId: BigInt(1),
    email: "jane@example.com",
    stripeSessionId: "mock_session_abc",
  }),

  getLeads: async () => [
    {
      id: BigInt(1),
      purchaseDate: BigInt(Date.now() * 1_000_000),
      fullName: "Jane Executive",
      productId: BigInt(1),
      email: "jane@example.com",
      stripeSessionId: "session_001",
    },
    {
      id: BigInt(2),
      purchaseDate: BigInt(Date.now() * 1_000_000 - 86400000000000),
      fullName: "Marcus Thornton",
      productId: BigInt(2),
      email: "m.thornton@corp.com",
      stripeSessionId: "session_002",
    },
  ],

  getProducts: async () => [
    {
      id: BigInt(1),
      title: "The Quartermaster Compendium: Global Markets Q3",
      description:
        "Curated frameworks, compendiums, and strategic playbooks designed to sharpen executive decision-making and drive high-impact results.",
      productType: ProductType.Compendium,
      isActive: true,
      price: BigInt(4900),
    },
    {
      id: BigInt(2),
      title: "Boardroom Dynamics Framework",
      description:
        "Curated frameworks, dynamics, and compendium for Boardroom Dynamics Framework.",
      productType: ProductType.Framework,
      isActive: true,
      price: BigInt(3900),
    },
    {
      id: BigInt(3),
      title: "The CEO's First 100 Days Playbook",
      description:
        "Curated frameworks, the CEO days too ino Inprocon and executive-making.",
      productType: ProductType.Playbook,
      isActive: true,
      price: BigInt(5900),
    },
    {
      id: BigInt(4),
      title: "The Strategic Foresight Guide: AI Integration",
      description:
        "Curated braeronreoncfer ofnraught ouds The Stratagic FareSight Guide: AI Integration.",
      productType: ProductType.Guide,
      isActive: true,
      price: BigInt(4500),
    },
  ],

  getSiteSettings: async () => ({
    facebookPixelId: "",
  }),

  getStripeSessionStatus: async (_sessionId) => ({
    __kind__: "completed",
    completed: { response: "paid" },
  }),

  isCallerAdmin: async () => false,

  isStripeConfigured: async () => false,

  setStripeConfiguration: async (_config) => undefined,

  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  updateSiteSettings: async (_pixelId) => ({
    facebookPixelId: _pixelId,
  }),

  upsertFAQ: async (faq) => faq,

  _initializeAccessControl: async () => undefined,
};
