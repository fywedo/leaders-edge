import Common "common";

module {
  public type ProductType = {
    #Compendium;
    #Framework;
    #Playbook;
    #Guide;
    #Handbook;
  };

  public type Product = {
    id : Common.ProductId;
    title : Text;
    productType : ProductType;
    description : Text;
    price : Nat; // in cents
    isActive : Bool;
  };
}
