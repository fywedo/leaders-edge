import List "mo:core/List";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import LeadTypes "../types/leads";
import LeadsLib "../lib/leads";

mixin (
  accessControlState : AccessControl.AccessControlState,
  leadState : LeadsLib.LeadState,
) {
  public query ({ caller }) func getLead(id : Common.LeadId) : async ?LeadTypes.Lead {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    LeadsLib.getById(leadState, id);
  };

  public query ({ caller }) func getLeads() : async [LeadTypes.Lead] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    LeadsLib.getAll(leadState);
  };

  public shared func createLead(
    fullName : Text,
    email : Text,
    productId : Common.ProductId,
    stripeSessionId : Text,
  ) : async LeadTypes.Lead {
    LeadsLib.create(leadState, fullName, email, productId, stripeSessionId);
  };
}
