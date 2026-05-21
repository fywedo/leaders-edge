import Common "common";

module {
  public type Lead = {
    id : Common.LeadId;
    fullName : Text;
    email : Text;
    productId : Common.ProductId;
    purchaseDate : Common.Timestamp;
    stripeSessionId : Text;
  };
}
