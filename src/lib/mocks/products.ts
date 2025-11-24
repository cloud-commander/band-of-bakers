import type {
  ProductCategory,
  Product,
  ProductVariant,
  ProductWithVariants,
} from "@/lib/validators/product";

// ============================================================================
// PRODUCT CATEGORIES - MOCK DATA
// ============================================================================

export const mockProductCategories: ProductCategory[] = [
  {
    id: "cat-breads",
    name: "Breads",
    slug: "breads",
    description: "Freshly baked artisan breads",
    sort_order: 1,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-pastries",
    name: "Pastries",
    slug: "pastries",
    description: "Delicious sweet and savoury pastries",
    sort_order: 2,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-cakes",
    name: "Cakes",
    slug: "cakes",
    description: "Homemade cakes for all occasions",
    sort_order: 3,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-cookies",
    name: "Cookies",
    slug: "cookies",
    description: "Chewy and crispy cookies",
    sort_order: 4,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// ============================================================================
// PRODUCTS - MOCK DATA
// ============================================================================

export const mockProducts: Product[] = [
  // BREADS
  {
    id: "prod-sourdough",
    category_id: "cat-breads",
    name: "Artisan Sourdough",
    slug: "artisan-sourdough",
    description:
      "Traditional sourdough made with our 50-year-old starter. Crusty outside, soft inside.",
    base_price: 5.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-wholemeal",
    category_id: "cat-breads",
    name: "Wholemeal Loaf",
    slug: "wholemeal-loaf",
    description: "100% wholemeal flour, perfect for toast and sandwiches.",
    base_price: 3.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-baguette",
    category_id: "cat-breads",
    name: "French Baguette",
    slug: "french-baguette",
    description: "Crispy French-style baguette, baked fresh daily.",
    base_price: 2.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-rye",
    category_id: "cat-breads",
    name: "Dark Rye Bread",
    slug: "dark-rye-bread",
    description: "Dense and flavourful rye bread with caraway seeds.",
    base_price: 4.75,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // PASTRIES
  {
    id: "prod-croissant",
    category_id: "cat-pastries",
    name: "Butter Croissant",
    slug: "butter-croissant",
    description: "Flaky, buttery croissant made with French butter.",
    base_price: 2.75,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-pain-chocolat",
    category_id: "cat-pastries",
    name: "Pain au Chocolat",
    slug: "pain-au-chocolat",
    description: "Classic French pastry with dark chocolate.",
    base_price: 3.25,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-danish",
    category_id: "cat-pastries",
    name: "Fruit Danish",
    slug: "fruit-danish",
    description: "Sweet Danish pastry with seasonal fruit filling.",
    base_price: 3.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-sausage-roll",
    category_id: "cat-pastries",
    name: "Sausage Roll",
    slug: "sausage-roll",
    description: "Homemade sausage roll with seasoned pork and flaky pastry.",
    base_price: 3.0,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // CAKES
  {
    id: "prod-victoria-sponge",
    category_id: "cat-cakes",
    name: "Victoria Sponge",
    slug: "victoria-sponge",
    description: "Classic British sponge cake with jam and buttercream.",
    base_price: 12.0,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-lemon-drizzle",
    category_id: "cat-cakes",
    name: "Lemon Drizzle Cake",
    slug: "lemon-drizzle-cake",
    description: "Zesty lemon cake with sweet glaze.",
    base_price: 10.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-cake",
    category_id: "cat-cakes",
    name: "Chocolate Fudge Cake",
    slug: "chocolate-fudge-cake",
    description: "Rich chocolate cake with fudge frosting.",
    base_price: 14.0,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-carrot-cake",
    category_id: "cat-cakes",
    name: "Carrot Cake",
    slug: "carrot-cake",
    description: "Moist carrot cake with cream cheese frosting.",
    base_price: 11.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // COOKIES
  {
    id: "prod-choc-chip",
    category_id: "cat-cookies",
    name: "Chocolate Chip Cookies",
    slug: "chocolate-chip-cookies",
    description: "Classic chocolate chip cookies (pack of 6).",
    base_price: 4.5,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-oat-raisin",
    category_id: "cat-cookies",
    name: "Oat & Raisin Cookies",
    slug: "oat-raisin-cookies",
    description: "Wholesome oat cookies with raisins (pack of 6).",
    base_price: 4.0,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-shortbread",
    category_id: "cat-cookies",
    name: "Scottish Shortbread",
    slug: "scottish-shortbread",
    description: "Traditional butter shortbread (pack of 8).",
    base_price: 5.0,
    image_url: null,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// Export by category
export const mockBreadProducts = mockProducts.filter((p) => p.category_id === "cat-breads");
export const mockPastryProducts = mockProducts.filter((p) => p.category_id === "cat-pastries");
export const mockCakeProducts = mockProducts.filter((p) => p.category_id === "cat-cakes");
export const mockCookieProducts = mockProducts.filter((p) => p.category_id === "cat-cookies");

// ============================================================================
// PRODUCT VARIANTS - MOCK DATA
// ============================================================================

export const mockProductVariants: ProductVariant[] = [
  // Sourdough sizes
  {
    id: "var-sourdough-small",
    product_id: "prod-sourdough",
    name: "Small (400g)",
    price_adjustment: 0, // Base price
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-sourdough-large",
    product_id: "prod-sourdough",
    name: "Large (800g)",
    price_adjustment: 2.5, // +£2.50
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Victoria Sponge sizes
  {
    id: "var-victoria-small",
    product_id: "prod-victoria-sponge",
    name: "Small (6 inches)",
    price_adjustment: 0, // Base price
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-victoria-medium",
    product_id: "prod-victoria-sponge",
    name: "Medium (8 inches)",
    price_adjustment: 6.0, // +£6
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-victoria-large",
    product_id: "prod-victoria-sponge",
    name: "Large (10 inches)",
    price_adjustment: 12.0, // +£12
    sort_order: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// ============================================================================
// COMBINED DATA
// ============================================================================

export const mockProductsWithVariants: ProductWithVariants[] = mockProducts.map((product) => ({
  ...product,
  variants: mockProductVariants.filter((v) => v.product_id === product.id),
}));

// ============================================================================
// EDGE CASES
// ============================================================================

// Empty states
export const mockProductsEmpty: Product[] = [];
export const mockProductCategoriesEmpty: ProductCategory[] = [];

// Single items
export const mockProductsSingle: Product[] = [mockProducts[0]];
export const mockProductCategoriesSingle: ProductCategory[] = [mockProductCategories[0]];

// Inactive product
export const mockProductInactive: Product = {
  id: "prod-inactive",
  category_id: "cat-breads",
  name: "Out of Season Bread",
  slug: "out-of-season-bread",
  description: "This product is currently unavailable.",
  base_price: 5.0,
  image_url: null,
  is_active: false,
  created_at: "2023-01-01T00:00:00.000Z",
  updated_at: "2024-06-01T00:00:00.000Z",
};

// Long name/description
export const mockProductLongText: Product = {
  id: "prod-long",
  category_id: "cat-breads",
  name: "This Is An Extremely Long Product Name That Will Definitely Break The UI If Not Handled With Proper Truncation",
  slug: "extremely-long-product-name",
  description:
    "This is an extremely long product description that goes on and on and on, providing excessive detail about every single aspect of this product including its ingredients, baking process, history, and everything else you could possibly imagine. It continues for multiple paragraphs and should test text overflow and truncation in the UI.",
  base_price: 5.0,
  image_url: null,
  is_active: true,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

// Many products (for pagination/scrolling)
export const mockProductsMany: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: `prod-many-${i}`,
  category_id: mockProductCategories[i % 4].id,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: `Description for product ${i + 1}`,
  base_price: Math.round((3 + Math.random() * 15) * 100) / 100, // £3-18
  image_url: null,
  is_active: i % 7 !== 0, // Every 7th is inactive
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
}));
