import Common "common";

module {
  public type FAQ = {
    id : Common.FaqId;
    question : Text;
    answer : Text;
    displayOrder : Nat;
  };
}
