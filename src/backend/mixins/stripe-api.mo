import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AccessControl "mo:caffeineai-authorization/access-control";
import LeadsLib "../lib/leads";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  stripeConfig : { var config : ?Stripe.StripeConfiguration },
  leadState : LeadsLib.LeadState,
) {
  func getConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig.config) {
      case (null) { Runtime.trap("Stripe has not been configured") };
      case (?c) { c };
    };
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig.config != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig.config := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(
    productId : Common.ProductId,
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(
      getConfig(),
      caller,
      [],
      successUrl,
      cancelUrl,
      transform,
    );
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
}
