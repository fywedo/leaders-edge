import List "mo:core/List";
import ProductTypes "../types/products";
import ProductsLib "../lib/products";

mixin (products : List.List<ProductTypes.Product>) {
  public query func getProducts() : async [ProductTypes.Product] {
    ProductsLib.getAll(products);
  };
}
