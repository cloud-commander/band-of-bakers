/**
 * Real Products Data from Band of Bakers
 * Parsed from seed-products/products.txt
 * Used by seed script when --real-products flag is set
 */

import type { InsertProductCategory, InsertProduct, InsertProductVariant } from "@/db/schema";

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

export const realProductCategories: InsertProductCategory[] = [
  {
    id: "cat_breads_loaves",
    name: "Breads & Loaves",
    slug: "breads-loaves",
    description: "Freshly baked artisan breads and loaves",
    image_url: "/images/categories/foccacia-detail.webp",
    sort_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_pastries",
    name: "Pastries",
    slug: "pastries",
    description: "Buttery, flaky pastries and sweet treats",
    image_url: "/images/categories/cinnamon_knots-detail.webp",
    sort_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_pies_tarts",
    name: "Pies & Tarts",
    slug: "pies-tarts",
    description: "Sweet and savory pies and tarts",
    image_url: "/images/categories/large_apple_pie-detail.webp",
    sort_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_cakes_slices",
    name: "Cakes & Slices",
    slug: "cakes-slices",
    description: "Delicious cakes by the slice or whole",
    image_url: "/images/categories/frangipane_slice-detail.webp",
    sort_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_savory",
    name: "Savory Items",
    slug: "savory",
    description: "Savory baked goods and specialties",
    image_url: "/images/categories/pesto_swirl-detail.webp",
    sort_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat_biscuits_bars",
    name: "Biscuits & Bars",
    slug: "biscuits-bars",
    description: "Flapjacks, biscuits, and sweet bars",
    image_url: "/images/categories/tiffin_cake_slice-detail.webp",
    sort_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================================================
// PRODUCTS
// ============================================================================

export const realProducts: InsertProduct[] = [
  // Breads & Loaves
  {
    id: "prod_foccacia",
    category_id: "cat_breads_loaves",
    name: "Focaccia",
    slug: "foccacia",
    description: "Italian flatbread with herbs and olive oil",
    base_price: 4.0,
    image_url: "/images/products/breads-loaves/foccacia-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_sourdough",
    category_id: "cat_breads_loaves",
    name: "Sourdough",
    slug: "sourdough",
    description: "Traditional sourdough bread with crispy crust",
    base_price: 4.0,
    image_url: "/images/products/breads-loaves/sourdough-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_wholemeal_loaf",
    category_id: "cat_breads_loaves",
    name: "Wholemeal Loaf",
    slug: "wholemeal_loaf",
    description: "Healthy wholemeal bread loaf",
    base_price: 3.5,
    image_url: "/images/products/breads-loaves/wholemeal_loaf-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_malt_loaf",
    category_id: "cat_breads_loaves",
    name: "Malt Loaf",
    slug: "malt_loaf",
    description: "Sweet malt loaf, perfect with butter",
    base_price: 7.0,
    image_url: "/images/products/breads-loaves/malt_loaf-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_apple_cinnamon_loaf",
    category_id: "cat_breads_loaves",
    name: "Apple & Cinnamon Loaf",
    slug: "apple_cinnamon_loaf",
    description: "Sweet loaf with apple and cinnamon",
    base_price: 7.0,
    image_url: "/images/products/breads-loaves/apple_cinnamon_loaf-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Pastries
  {
    id: "prod_croissants",
    category_id: "cat_pastries",
    name: "Croissants",
    slug: "croissants",
    description: "Buttery, flaky French croissants",
    base_price: 2.0,
    image_url: "/images/products/pastries/croissants-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_savoury_croissants",
    category_id: "cat_pastries",
    name: "Savoury Croissants",
    slug: "savoury_croissants",
    description: "Croissants filled with savory ingredients",
    base_price: 3.5,
    image_url: "/images/products/pastries/savoury_croissants-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_peach_pastry",
    category_id: "cat_pastries",
    name: "Peach Pastries",
    slug: "peach_pastry",
    description: "Sweet pastries with peach filling",
    base_price: 1.5,
    image_url: "/images/products/pastries/peach_pastry-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_pistacio_pastry",
    category_id: "cat_pastries",
    name: "Pistachio Pastries",
    slug: "pistacio_pastry",
    description: "Delicate pastries with pistachio cream",
    base_price: 1.5,
    image_url: "/images/products/pastries/pistacio_pastry-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_portuguese_custard_tarts",
    category_id: "cat_pastries",
    name: "Portuguese Custard Tarts",
    slug: "portuguese_custard_tarts",
    description: "Traditional Pastéis de Nata",
    base_price: 1.0,
    image_url: "/images/products/pastries/portuguese_custard_tarts-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_cinnamon_knots",
    category_id: "cat_pastries",
    name: "Cinnamon Knots",
    slug: "cinnamon_knots",
    description: "Sweet cinnamon pastry knots",
    base_price: 2.5,
    image_url: "/images/products/pastries/cinnamon_knots-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Pies & Tarts
  {
    id: "prod_apple_pies",
    category_id: "cat_pies_tarts",
    name: "Apple Pies",
    slug: "small_apple_pies",
    description: "Classic apple pies in various sizes",
    base_price: 4.5, // Small size base
    image_url: "/images/products/pies-tarts/small_apple_pies-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_apple_blackberry_pies",
    category_id: "cat_pies_tarts",
    name: "Small Apple & Blackberry Pies",
    slug: "small_appleblackberry_pies",
    description: "Apple and blackberry pies",
    base_price: 4.5,
    image_url: "/images/products/pies-tarts/small_appleblackberry_pies-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_large_apple_pie",
    category_id: "cat_pies_tarts",
    name: "Large Apple Pie",
    slug: "large_apple_pie",
    description: "Large family-sized apple pie",
    base_price: 9.0,
    image_url: "/images/products/pies-tarts/large_apple_pie-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_lemon_meringue_pie",
    category_id: "cat_pies_tarts",
    name: "Lemon Meringue Pie",
    slug: "lemon_meringue_pie",
    description: "Tangy lemon filling with fluffy meringue",
    base_price: 10.0,
    image_url: "/images/products/pies-tarts/lemon_meringue_pie-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_tarte_au_citron",
    category_id: "cat_pies_tarts",
    name: "Tarte au Citron",
    slug: "whole_tarte_au_citron",
    description: "French lemon tart",
    base_price: 12.0,
    image_url: "/images/products/pies-tarts/whole_tarte_au_citron-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Cakes & Slices
  {
    id: "prod_tiffin_slice",
    category_id: "cat_cakes_slices",
    name: "Tiffin Slice",
    slug: "tiffin_cake_slice",
    description: "Rich chocolate tiffin slice",
    base_price: 2.5,
    image_url: "/images/products/cakes-slices/tiffin_cake_slice-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_cake_slice",
    category_id: "cat_cakes_slices",
    name: "Cake Slice",
    slug: "cake_slice",
    description: "Individual slice of delicious cake",
    base_price: 2.5,
    image_url: "/images/products/cakes-slices/frangipane_slice-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_lemon_drizzle_cake",
    category_id: "cat_cakes_slices",
    name: "Lemon Drizzle Cake",
    slug: "whole_lemon_drizzle_cake",
    description: "Moist lemon cake with sweet drizzle",
    base_price: 7.0,
    image_url: "/images/products/cakes-slices/whole_lemon_drizzle_cake-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_frangipane",
    category_id: "cat_cakes_slices",
    name: "Frangipane",
    slug: "frangipane_slice",
    description: "Almond cream tart",
    base_price: 2.5, // Per slice base
    image_url: "/images/products/cakes-slices/frangipane_slice-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_whole_cake",
    category_id: "cat_cakes_slices",
    name: "Whole Cake",
    slug: "whole_cake",
    description: "Whole celebration cake",
    base_price: 20.0,
    image_url: "/images/products/cakes-slices/whole_cake-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_dundee_cakes",
    category_id: "cat_cakes_slices",
    name: "Dundee Cakes",
    slug: "dundee_cakes",
    description: "Traditional Scottish fruit cake",
    base_price: 20.0,
    image_url: "/images/products/cakes-slices/dundee_cakes-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Savory Items
  {
    id: "prod_curried_beef_pasties",
    category_id: "cat_savory",
    name: "Curried Beef Mince Pasties",
    slug: "curried_beef_mince_pasties",
    description: "Spiced beef pasties",
    base_price: 3.5,
    image_url: "/images/products/savory/curried_beef_mince_pasties-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_cheese_pesto_swirls",
    category_id: "cat_savory",
    name: "Cheese, Pesto & Basil Swirls",
    slug: "pesto_swirl",
    description: "Savory swirls with cheese and pesto",
    base_price: 2.0,
    image_url: "/images/products/savory/pesto_swirl-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_kimchi",
    category_id: "cat_savory",
    name: "Kimchi",
    slug: "kimchi",
    description: "House-made fermented kimchi",
    base_price: 7.0,
    image_url: "/images/products/savory/kimchi-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Biscuits & Bars
  {
    id: "prod_eccles_cakes",
    category_id: "cat_biscuits_bars",
    name: "Eccles Cakes",
    slug: "eccles_cake",
    description: "Traditional currant-filled pastries",
    base_price: 1.5,
    image_url: "/images/products/biscuits-bars/eccles_cake-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_flapjacks",
    category_id: "cat_biscuits_bars",
    name: "Flapjacks",
    slug: "flapjack",
    description: "Oaty, buttery flapjacks",
    base_price: 2.5,
    image_url: "/images/products/biscuits-bars/flapjack-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod_millionaire_shortbread",
    category_id: "cat_biscuits_bars",
    name: "Millionaire Shortbread",
    slug: "millionaire_shortbread",
    description: "Shortbread with caramel and chocolate",
    base_price: 2.0,
    image_url: "/images/products/biscuits-bars/millionaire_shortbread-card.webp",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================================================
// PRODUCT VARIANTS
// ============================================================================

export const realProductVariants: InsertProductVariant[] = [
  // Apple Pies - Small vs Extra Large
  {
    id: "var_apple_pie_small",
    product_id: "prod_apple_pies",
    name: "Small",
    price_adjustment: 0, // Base price is already £4.50
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "var_apple_pie_xl",
    product_id: "prod_apple_pies",
    name: "Extra Large",
    price_adjustment: 10.5, // £4.50 + £10.50 = £15.00
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

  // Frangipane - Slice vs Whole
  {
    id: "var_frangipane_slice",
    product_id: "prod_frangipane",
    name: "Per Slice",
    price_adjustment: 0, // Base price is already £2.50
    sort_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "var_frangipane_whole",
    product_id: "prod_frangipane",
    name: "Whole",
    price_adjustment: 17.5, // £2.50 + £17.50 = £20.00
    sort_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get image file patterns for a product slug
 * @param productSlug - The product slug (e.g., "sourdough")
 * @returns Array of image filenames to look for
 */
export function getProductImageFiles(productSlug: string): {
  card: string;
  detail: string;
  thumbnail: string;
} {
  return {
    card: `${productSlug}-card.webp`,
    detail: `${productSlug}-detail.webp`,
    thumbnail: `${productSlug}-thumbnail.webp`,
  };
}

/**
 * Get all product slugs for image mapping
 */
export function getAllProductSlugs(): string[] {
  return realProducts.map((p) => p.slug);
}
