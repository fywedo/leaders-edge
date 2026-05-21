import List "mo:core/List";
import Common "../types/common";
import ProductTypes "../types/products";

module {
  public type Product = ProductTypes.Product;
  public type ProductId = Common.ProductId;

  let placeholders : [Product] = [
    {
      id = 1;
      title = "Leadership Compendium Vol. 1";
      productType = #Compendium;
      description = "A comprehensive collection of proven leadership principles and executive frameworks. Distilled from decades of research into a single, authoritative reference for today's high-impact leaders.";
      price = 4700;
      isActive = true;
    },
    {
      id = 2;
      title = "The Executive Framework Mastery";
      productType = #Framework;
      description = "A structured decision-making framework designed for executives who lead with clarity and conviction. Apply proven models to navigate complexity and drive organizational performance.";
      price = 5700;
      isActive = true;
    },
    {
      id = 3;
      title = "High-Impact Leadership Playbook";
      productType = #Playbook;
      description = "Step-by-step strategies and tactical playbooks used by the world's most influential leaders. Transform your leadership approach and elevate your team to extraordinary results.";
      price = 6700;
      isActive = true;
    },
    {
      id = 4;
      title = "The Leader's Strategic Guide";
      productType = #Guide;
      description = "An essential guide for leaders who want to make a lasting impact on their organizations and industries. Navigate challenges with confidence using battle-tested leadership strategies.";
      price = 3700;
      isActive = true;
    },
    {
      id = 5;
      title = "Executive Leadership Handbook & Workbook";
      productType = #Handbook;
      description = "An interactive handbook and workbook that transforms leadership theory into daily practice. Work through powerful exercises designed to accelerate your leadership growth and deepen your impact.";
      price = 7700;
      isActive = true;
    },
  ];

  public func getAll(products : List.List<Product>) : [Product] {
    if (products.size() == 0) {
      for (p in placeholders.vals()) {
        products.add(p);
      };
    };
    products.filter(func(p) { p.isActive }).toArray();
  };
}
