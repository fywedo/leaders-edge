import List "mo:core/List";
import Time "mo:core/Time";
import Common "../types/common";
import LeadTypes "../types/leads";

module {
  public type Lead = LeadTypes.Lead;
  public type LeadId = Common.LeadId;

  public type LeadState = {
    leads : List.List<Lead>;
    state : { var nextId : Nat };
  };

  public func getById(leadState : LeadState, id : LeadId) : ?Lead {
    leadState.leads.find(func(l) { l.id == id });
  };

  public func getAll(leadState : LeadState) : [Lead] {
    leadState.leads.toArray();
  };

  public func create(
    leadState : LeadState,
    fullName : Text,
    email : Text,
    productId : Common.ProductId,
    stripeSessionId : Text,
  ) : Lead {
    let id = leadState.state.nextId;
    leadState.state.nextId += 1;
    let lead : Lead = {
      id;
      fullName;
      email;
      productId;
      purchaseDate = Time.now();
      stripeSessionId;
    };
    leadState.leads.add(lead);
    lead;
  };
}
