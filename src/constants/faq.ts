/**
 * FAQ Page Constants
 * Centralized content for frequently asked questions organized by category
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "delivery" | "products" | "general";
  sort_order: number;
}

export interface FAQCategory {
  id: string;
  label: string;
  icon: string;
}

// ============================================================================
// PAGE HEADER
// ============================================================================

export const FAQ_PAGE_HEADER = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about ordering, delivery, and our products",
} as const;

// ============================================================================
// PAGE CTA SECTION
// ============================================================================

export const FAQ_CTA_SECTION = {
  heading: "Still Have Questions?",
  description: "We're here to help! Get in touch with us directly.",
  ctaText: "Contact Us",
  ctaEmail: "hello@bandofbakers.co.uk",
} as const;

// Canonical FAQ content for the site
export const FAQS: FAQ[] = [
  // ORDERING
  {
    id: "faq-1",
    question: "How do I place an order?",
    answer:
      "Browse our menu, select your items, choose a bake sale date, and complete checkout. You must order before the cutoff date (typically 2 days before the bake sale).",
    category: "ordering",
    sort_order: 1,
  },
  {
    id: "faq-2",
    question: "What is the order cutoff time?",
    answer:
      "Orders must be placed at least 24 hours before the bake sale date, typically by 11:00 AM. Check each bake sale listing for specific cutoff times.",
    category: "ordering",
    sort_order: 2,
  },
  {
    id: "faq-3",
    question: "Can I modify or cancel my order?",
    answer:
      "Yes, you can modify or cancel your order up until the cutoff time. After that, we've already started baking and changes cannot be made.",
    category: "ordering",
    sort_order: 3,
  },
  {
    id: "faq-4",
    question: "Do you accept payment on collection?",
    answer:
      "Yes! We accept both online payment (Stripe) and payment on collection. If paying on collection, we accept cash and card.",
    category: "ordering",
    sort_order: 4,
  },

  // DELIVERY & COLLECTION
  {
    id: "faq-5",
    question: "Do you offer delivery?",
    answer:
      "Yes, we offer delivery to selected areas in Shropshire for a small fee. Delivery areas include Cressage, Shrewsbury, and Telford. Check your postcode at checkout.",
    category: "delivery",
    sort_order: 1,
  },
  {
    id: "faq-6",
    question: "What are the collection times?",
    answer:
      "Collection times vary by location and bake sale. Typical hours are 10:00 AM - 4:00 PM. You'll receive specific collection details in your order confirmation.",
    category: "delivery",
    sort_order: 2,
  },
  {
    id: "faq-7",
    question: "What if I can't collect at the specified time?",
    answer:
      "Please contact us as soon as possible if you need to arrange an alternative collection time. We'll do our best to accommodate you within the same day.",
    category: "delivery",
    sort_order: 3,
  },

  // PRODUCTS
  {
    id: "faq-8",
    question: "Are your products suitable for vegetarians?",
    answer:
      "Most of our products are vegetarian. We use local dairy and eggs. Check individual product descriptions for specific dietary information.",
    category: "products",
    sort_order: 1,
  },
  {
    id: "faq-9",
    question: "Do you cater for allergies and dietary requirements?",
    answer:
      "While we list common allergens on our products, all items are made in a kitchen that handles nuts, gluten, dairy, and eggs. Please contact us for specific allergy concerns.",
    category: "products",
    sort_order: 2,
  },
  {
    id: "faq-10",
    question: "How long do your baked goods stay fresh?",
    answer:
      "Our bread is best within 2-3 days and can be frozen for up to 3 months. Pastries are best enjoyed on the day of collection. Cakes will last 3-5 days when stored properly.",
    category: "products",
    sort_order: 3,
  },
  {
    id: "faq-11",
    question: "What makes your sourdough special?",
    answer:
      "Our sourdough is made with a natural starter that's been cultivated for years. We use long fermentation (up to 24 hours) for better flavor, texture, and digestibility.",
    category: "products",
    sort_order: 4,
  },

  // GENERAL
  {
    id: "faq-12",
    question: "How often do you have bake sales?",
    answer:
      "We typically hold bake sales weekly or fortnightly at various locations around Shropshire. Check our menu or follow us on social media for the latest schedule.",
    category: "general",
    sort_order: 1,
  },
  {
    id: "faq-13",
    question: "Can I place a custom order?",
    answer:
      "Yes! We accept custom orders for special occasions. Please contact us at least 2 weeks in advance to discuss your requirements and pricing.",
    category: "general",
    sort_order: 2,
  },
  {
    id: "faq-14",
    question: "Do you offer wholesale or supply to cafes/restaurants?",
    answer:
      "We're currently focused on our bake sale model for individual customers, but we're happy to discuss wholesale opportunities. Please get in touch to explore options.",
    category: "general",
    sort_order: 3,
  },
  {
    id: "faq-15",
    question: "How can I stay updated on new products and bake sales?",
    answer:
      "Follow us on Instagram, Facebook, and Twitter for the latest updates, special bakes, and bake sale announcements. You can also subscribe to our newsletter (coming soon!).",
    category: "general",
    sort_order: 4,
  },
];

// By category
export const FAQS_BY_CATEGORY = {
  ordering: FAQS.filter((faq) => faq.category === "ordering"),
  delivery: FAQS.filter((faq) => faq.category === "delivery"),
  products: FAQS.filter((faq) => faq.category === "products"),
  general: FAQS.filter((faq) => faq.category === "general"),
};

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: "ordering", label: "Ordering", icon: "🛒" },
  { id: "delivery", label: "Delivery & Collection", icon: "🚚" },
  { id: "products", label: "Products", icon: "🍞" },
  { id: "general", label: "General", icon: "❓" },
];
