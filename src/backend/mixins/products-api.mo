import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import Common "../types/common";
import ProductTypes "../types/products";
import ProductsLib "../lib/products";

mixin (
  accessControlState : AccessControl.AccessControlState,
  productState : ProductsLib.ProductState,
) {
  public query func getProducts() : async [ProductTypes.Product] {
    ProductsLib.getAll(productState);
  };

  public query func getProductById(id : Common.ProductId) : async ?ProductTypes.Product {
    ProductsLib.getById(productState, id);
  };

  public query ({ caller }) func getAdminProducts() : async [ProductTypes.Product] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view all products");
    };
    ProductsLib.getAllAdmin(productState);
  };

  public shared ({ caller }) func upsertProduct(product : ProductTypes.Product) : async ProductTypes.Product {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can manage products");
    };
    ProductsLib.upsert(productState, product);
  };
}
