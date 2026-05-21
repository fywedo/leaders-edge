import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import LeadsLib "lib/leads";
import FaqsLib "lib/faqs";
import ProductsLib "lib/products";
import ProductTypes "types/products";
import ProductsApi "mixins/products-api";
import LeadsApi "mixins/leads-api";
import FaqsApi "mixins/faqs-api";
import SettingsApi "mixins/settings-api";
import SettingsLib "lib/settings";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Products state
  let productsStorage = List.empty<ProductTypes.Product>();
  let productsCounter = { var nextId : Nat = 1 };
  let productState : ProductsLib.ProductState = { products = productsStorage; state = productsCounter };

  // Leads state
  let leadsStorage = List.empty<LeadsLib.Lead>();
  let leadsCounter = { var nextId : Nat = 1 };
  let leadState : LeadsLib.LeadState = { leads = leadsStorage; state = leadsCounter };

  // FAQs state
  let faqsStorage = List.empty<FaqsLib.FAQ>();
  let faqsCounter = { var nextId : Nat = 1 };
  let faqState : FaqsLib.FaqState = { faqs = faqsStorage; state = faqsCounter };

  // Settings state
  let settingsState : SettingsLib.SettingsState = { var facebookPixelId = "" };

  // Include mixins
  include ProductsApi(accessControlState, productState);
  include LeadsApi(accessControlState, leadState);
  include FaqsApi(accessControlState, faqState);
  include SettingsApi(accessControlState, settingsState);

  // Stripe state — must be declared directly in actor
  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe has not been configured") };
      case (?c) { c };
    };
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(
      getStripeConfig(),
      caller,
      items,
      successUrl,
      cancelUrl,
      transform,
    );
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
}
