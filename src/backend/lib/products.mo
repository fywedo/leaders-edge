import List "mo:core/List";
import Common "../types/common";
import ProductTypes "../types/products";

module {
  public type Product = ProductTypes.Product;
  public type ProductId = Common.ProductId;

  public type ProductState = {
    products : List.List<Product>;
    state : { var nextId : Nat };
  };

  let placeholders : [Product] = [
    {
      id = 1;
      title = "Leadership Compendium Vol. 1";
      productType = #Compendium;
      description = "A comprehensive collection of proven leadership principles and executive frameworks. Distilled from decades of research into a single, authoritative reference for today's high-impact leaders.";
      price = 4700;
      isActive = true;
      fileUrl = "";
    },
    {
      id = 2;
      title = "The Executive Framework Mastery";
      productType = #Framework;
      description = "A structured decision-making framework designed for executives who lead with clarity and conviction. Apply proven models to navigate complexity and drive organizational performance.";
      price = 5700;
      isActive = true;
      fileUrl = "";
    },
    {
      id = 3;
      title = "High-Impact Leadership Playbook";
      productType = #Playbook;
      description = "Step-by-step strategies and tactical playbooks used by the world's most influential leaders. Transform your leadership approach and elevate your team to extraordinary results.";
      price = 6700;
      isActive = true;
      fileUrl = "";
    },
    {
      id = 4;
      title = "The Leader's Strategic Guide";
      productType = #Guide;
      description = "An essential guide for leaders who want to make a lasting impact on their organizations and industries. Navigate challenges with confidence using battle-tested leadership strategies.";
      price = 3700;
      isActive = true;
      fileUrl = "";
    },
    {
      id = 5;
      title = "Executive Leadership Handbook & Workbook";
      productType = #Handbook;
      description = "An interactive handbook and workbook that transforms leadership theory into daily practice. Work through powerful exercises designed to accelerate your leadership growth and deepen your impact.";
      price = 7700;
      isActive = true;
      fileUrl = "";
    },
  ];

  func ensureSeeded(productState : ProductState) {
    if (productState.products.size() == 0) {
      for (p in placeholders.vals()) {
        productState.products.add(p);
      };
      productState.state.nextId := 6;
    };
  };

  public func getAll(productState : ProductState) : [Product] {
    ensureSeeded(productState);
    productState.products.filter(func(p) { p.isActive }).toArray();
  };

  public func getAllAdmin(productState : ProductState) : [Product] {
    ensureSeeded(productState);
    productState.products.toArray();
  };

  public func getById(productState : ProductState, id : ProductId) : ?Product {
    ensureSeeded(productState);
    productState.products.find(func(p) { p.id == id });
  };

  public func upsert(productState : ProductState, product : Product) : Product {
    if (product.id == 0) {
      let newId = productState.state.nextId;
      productState.state.nextId += 1;
      let newProduct : Product = { product with id = newId };
      productState.products.add(newProduct);
      newProduct;
    } else {
      var found = false;
      productState.products.mapInPlace(func(p) {
        if (p.id == product.id) { found := true; product } else { p };
      });
      if (not found) {
        productState.products.add(product);
      };
      product;
    };
  };
}
