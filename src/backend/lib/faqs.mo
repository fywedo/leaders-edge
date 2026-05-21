import List "mo:core/List";
import Common "../types/common";
import FaqTypes "../types/faqs";

module {
  public type FAQ = FaqTypes.FAQ;
  public type FaqId = Common.FaqId;

  public type FaqState = {
    faqs : List.List<FAQ>;
    state : { var nextId : Nat };
  };

  let defaultFaqs : [FAQ] = [
    {
      id = 1;
      question = "What types of products do you offer?";
      answer = "We offer premium digital leadership resources including Compendiums, Frameworks, Playbooks, Guides, and Handbooks/Workbooks. Each product is meticulously crafted to help executives, managers, consultants, coaches, and leaders create lasting impact.";
      displayOrder = 1;
    },
    {
      id = 2;
      question = "How do I access my products after purchase?";
      answer = "Immediately after your payment is confirmed, you will receive access to download your purchased product. Your downloads are available securely and can be accessed anytime from your purchase confirmation.";
      displayOrder = 2;
    },
    {
      id = 3;
      question = "What payment methods do you accept?";
      answer = "We accept all major credit and debit cards through our secure Stripe payment processing. All transactions are encrypted and your financial information is never stored on our servers.";
      displayOrder = 3;
    },
    {
      id = 4;
      question = "What is your refund policy?";
      answer = "Due to the digital nature of our products, all sales are final. However, if you experience any technical issues accessing your purchase, please contact our support team and we will make it right.";
      displayOrder = 4;
    },
    {
      id = 5;
      question = "How can I contact support?";
      answer = "For any questions, technical issues, or feedback, please reach out through our support chat. Our team is dedicated to ensuring you have the best experience with our premium leadership resources.";
      displayOrder = 5;
    },
  ];

  public func getAll(faqState : FaqState) : [FAQ] {
    if (faqState.faqs.size() == 0) {
      for (f in defaultFaqs.vals()) {
        faqState.faqs.add(f);
      };
      faqState.state.nextId := 6;
    };
    faqState.faqs.toArray();
  };

  public func upsert(faqState : FaqState, faq : FAQ) : FAQ {
    if (faq.id == 0) {
      // New FAQ
      let newId = faqState.state.nextId;
      faqState.state.nextId += 1;
      let newFaq : FAQ = { faq with id = newId };
      faqState.faqs.add(newFaq);
      newFaq;
    } else {
      // Update existing
      var found = false;
      faqState.faqs.mapInPlace(func(f) {
        if (f.id == faq.id) { found := true; faq } else { f };
      });
      if (not found) {
        faqState.faqs.add(faq);
      };
      faq;
    };
  };

  public func delete(faqState : FaqState, id : FaqId) : Bool {
    let sizeBefore = faqState.faqs.size();
    faqState.faqs.retain(func(f) { f.id != id });
    faqState.faqs.size() < sizeBefore;
  };
}
