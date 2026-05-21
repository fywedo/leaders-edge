import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import FaqTypes "../types/faqs";
import FaqsLib "../lib/faqs";

mixin (
  accessControlState : AccessControl.AccessControlState,
  faqState : FaqsLib.FaqState,
) {
  public query func getFAQs() : async [FaqTypes.FAQ] {
    FaqsLib.getAll(faqState);
  };

  public shared ({ caller }) func upsertFAQ(faq : FaqTypes.FAQ) : async FaqTypes.FAQ {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage FAQs");
    };
    FaqsLib.upsert(faqState, faq);
  };

  public shared ({ caller }) func deleteFAQ(id : Common.FaqId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete FAQs");
    };
    FaqsLib.delete(faqState, id);
  };
}
