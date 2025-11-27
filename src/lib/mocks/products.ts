import type {
  ProductCategory,
  Product,
  ProductVariant,
  ProductWithVariants,
} from "@/lib/validators/product";

// ============================================================================
// PRODUCT CATEGORIES - MOCK DATA
// ============================================================================

export const mockProductCategories: (ProductCategory & { image: string })[] = [
  {
    id: "cat-breads",
    name: "Breads",
    slug: "breads",
    description: "Freshly baked artisan breads",
    sort_order: 1,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "cat-pastries-bakes",
    name: "Pastries & Bakes",
    slug: "pastries-bakes",
    description: "Focaccia, pastries, swirls, brownies, flapjacks and croissants",
    sort_order: 2,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "cat-cakes-loaves",
    name: "Cakes & Loaves",
    slug: "cakes-loaves",
    description: "Homemade cakes and loaf cakes",
    sort_order: 3,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "cat-tarts-pies",
    name: "Tarts & Pies",
    slug: "tarts-pies",
    description: "Delicious tarts and pies",
    sort_order: 4,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: "cat-savoury-specialities",
    name: "Savoury & Specialities",
    slug: "savoury-specialities",
    description: "Savoury pies, quiches, puddings and special treats",
    sort_order: 5,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
  },
];

// ============================================================================
// PRODUCTS - MOCK DATA
// ============================================================================

export const mockProducts: Product[] = [
  // BREADS
  {
    id: "prod-focaccia",
    category_id: "cat-breads",
    name: "Focaccia",
    slug: "focaccia",
    description: "Delicious focaccia bread.",
    base_price: 4.0,
    image_url:
      "https://images.pexels.com/photos/212813/pexels-photo-212813.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-sourdough",
    category_id: "cat-breads",
    name: "Sourdough",
    slug: "sourdough",
    description: "Artisan sourdough bread.",
    base_price: 4.0,
    image_url:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-wholemeal-loaf",
    category_id: "cat-breads",
    name: "Wholemeal Loaf",
    slug: "wholemeal-loaf",
    description: "100% wholemeal flour loaf, perfect for toast and sandwiches.",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // PASTRIES & BAKES
  {
    id: "prod-peach-pistachio-pastries",
    category_id: "cat-pastries-bakes",
    name: "Peach / Pistachio Pastries",
    slug: "peach-pistachio-pastries",
    description: "Delicious peach and pistachio pastries.",
    base_price: 1.5,
    image_url:
      "https://images.pexels.com/photos/56007/pexels-photo-56007.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-savoury-croissants",
    category_id: "cat-pastries-bakes",
    name: "Savoury Croissants",
    slug: "savoury-croissants",
    description: "Flaky savoury croissants.",
    base_price: 3.5,
    image_url:
      "https://images.pexels.com/photos/160802/pexels-photo-160802.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-croissants",
    category_id: "cat-pastries-bakes",
    name: "Croissants",
    slug: "croissants",
    description: "Classic buttery croissants.",
    base_price: 2.0,
    image_url:
      "https://images.pexels.com/photos/160802/pexels-photo-160802.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-eccles-cake",
    category_id: "cat-pastries-bakes",
    name: "Eccles Cakes",
    slug: "eccles-cakes",
    description: "Traditional Eccles cakes with currants.",
    base_price: 1.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-cinnamon-knots",
    category_id: "cat-pastries-bakes",
    name: "Cinnamon Knots",
    slug: "cinnamon-knots",
    description: "Sweet cinnamon-spiced pastry knots.",
    base_price: 2.5,
    image_url:
      "https://images.pexels.com/photos/56007/pexels-photo-56007.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-cheese-pesto-basil-swirls",
    category_id: "cat-pastries-bakes",
    name: "Cheese, Pesto & Basil Swirls",
    slug: "cheese-pesto-basil-swirls",
    description: "Savoury swirls with cheese, pesto and basil.",
    base_price: 2.0,
    image_url:
      "https://images.pexels.com/photos/1028681/pexels-photo-1028681.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-flapjacks-brownies",
    category_id: "cat-pastries-bakes",
    name: "Flapjacks / Brownies",
    slug: "flapjacks-brownies",
    description: "Delicious flapjacks and brownies.",
    base_price: 2.5,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-millionaire-shortbread",
    category_id: "cat-pastries-bakes",
    name: "Millionaire Shortbread",
    slug: "millionaire-shortbread",
    description: "Rich millionaire shortbread with chocolate, toffee and caramel.",
    base_price: 2.0,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-portuguese-custard-tarts",
    category_id: "cat-pastries-bakes",
    name: "Portuguese Custard Tarts",
    slug: "portuguese-custard-tarts",
    description: "Delicious Portuguese custard tarts.",
    base_price: 1.0,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // CAKES & LOAVES
  {
    id: "prod-small-apple-pies",
    category_id: "cat-cakes-loaves",
    name: "Small Apple Pies",
    slug: "small-apple-pies",
    description: "Individual-sized small apple pies.",
    base_price: 4.5,
    image_url:
      "https://images.pexels.com/photos/1028702/pexels-photo-1028702.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-small-apple-blackberry-pies",
    category_id: "cat-cakes-loaves",
    name: "Small Apple & Blackberry Pies",
    slug: "small-apple-blackberry-pies",
    description: "Individual-sized apple and blackberry pies.",
    base_price: 4.5,
    image_url:
      "https://images.pexels.com/photos/1028702/pexels-photo-1028702.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-cakes-tiffin-per-slice",
    category_id: "cat-cakes-loaves",
    name: "Cakes / Tiffin Per Slice",
    slug: "cakes-tiffin-per-slice",
    description: "Cakes and tiffin sold by the slice.",
    base_price: 2.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-lemon-drizzle-whole-cake",
    category_id: "cat-cakes-loaves",
    name: "Lemon Drizzle Whole Cake",
    slug: "lemon-drizzle-whole-cake",
    description: "Zesty lemon drizzle whole cake.",
    base_price: 7.0,
    image_url:
      "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-apple-cinnamon-malt-loaf",
    category_id: "cat-cakes-loaves",
    name: "Apple Cinnamon / Malt Loaf",
    slug: "apple-cinnamon-malt-loaf",
    description: "Apple cinnamon or malt loaf cake.",
    base_price: 7.0,
    image_url:
      "https://images.pexels.com/photos/1029660/pexels-photo-1029660.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-frangipane-per-slice",
    category_id: "cat-cakes-loaves",
    name: "Frangipane Per Slice",
    slug: "frangipane-per-slice",
    description: "Frangipane tart sold by the slice.",
    base_price: 2.5,
    image_url:
      "https://images.pexels.com/photos/1029660/pexels-photo-1029660.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-dundee-cakes",
    category_id: "cat-cakes-loaves",
    name: "Dundee Cakes",
    slug: "dundee-cakes",
    description: "Traditional Dundee cakes.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029648/pexels-photo-1029648.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // TARTS & PIES
  {
    id: "prod-lemon-meringue-pie",
    category_id: "cat-tarts-pies",
    name: "Lemon Meringue Pie",
    slug: "lemon-meringue-pie",
    description: "Whole lemon meringue pie, made to order.",
    base_price: 10.0,
    image_url:
      "https://images.pexels.com/photos/1029658/pexels-photo-1029658.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-tarte-au-citron",
    category_id: "cat-tarts-pies",
    name: "Tarte au Citron Whole",
    slug: "tarte-au-citron",
    description: "Classic French lemon tart, made to order.",
    base_price: 12.0,
    image_url:
      "https://images.pexels.com/photos/1029658/pexels-photo-1029658.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-large-apple-pies",
    category_id: "cat-tarts-pies",
    name: "Large Apple Pies",
    slug: "large-apple-pies",
    description: "Large apple pies.",
    base_price: 9.0,
    image_url:
      "https://images.pexels.com/photos/1028699/pexels-photo-1028699.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-extra-large-apple-pie",
    category_id: "cat-tarts-pies",
    name: "Extra Large Apple Pie",
    slug: "extra-large-apple-pie",
    description: "Extra large apple pie, ideal for families.",
    base_price: 15.0,
    image_url:
      "https://images.pexels.com/photos/1028699/pexels-photo-1028699.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-whole-cakes-frangipanes",
    category_id: "cat-tarts-pies",
    name: "Whole Cakes/Frangipanes",
    slug: "whole-cakes-frangipanes",
    description: "Whole cakes and frangipanes.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // SAVOURY & SPECIALITIES
  {
    id: "prod-curried-beef-mince-pasties",
    category_id: "cat-savoury-specialities",
    name: "Curried Beef Mince Pasties",
    slug: "curried-beef-mince-pasties",
    description: "Individual curried beef mince pasties.",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1584467735871-3f2b4b4d72d9?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-kimchi",
    category_id: "cat-savoury-specialities",
    name: "Kimchi",
    slug: "kimchi",
    description: "Spicy Korean kimchi.",
    base_price: 7.0,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-plum-frangipane",
    category_id: "cat-tarts-pies",
    name: "Plum Frangipane",
    slug: "plum-frangipane",
    description: "Delicious plum frangipane tart.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-bakewell-tart",
    category_id: "cat-tarts-pies",
    name: "Bakewell Tart",
    slug: "bakewell-tart",
    description: "Classic Bakewell tart.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-mincemeat-frangipane",
    category_id: "cat-tarts-pies",
    name: "Mincemeat Frangipane",
    slug: "mincemeat-frangipane",
    description: "Festive mincemeat frangipane.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-tarte-aux-pomme",
    category_id: "cat-tarts-pies",
    name: "Tarte aux Pomme",
    slug: "tarte-aux-pomme",
    description: "French apple tart.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-carrot-cake",
    category_id: "cat-cakes-loaves",
    name: "Carrot Cake",
    slug: "carrot-cake",
    description: "Moist carrot cake with cream cheese frosting.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-orange-cake",
    category_id: "cat-cakes-loaves",
    name: "Orange Cake",
    slug: "orange-cake",
    description: "Zesty orange cake.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-blueberry-cake",
    category_id: "cat-cakes-loaves",
    name: "Blueberry Cake",
    slug: "blueberry-cake",
    description: "Cake bursting with blueberries.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-coffee-walnut-cake",
    category_id: "cat-cakes-loaves",
    name: "Coffee & Walnut Cake",
    slug: "coffee-walnut-cake",
    description: "Classic coffee and walnut cake.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-orange-cake",
    category_id: "cat-cakes-loaves",
    name: "Chocolate & Orange Cake",
    slug: "chocolate-orange-cake",
    description: "Chocolate cake with a hint of orange.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-dundee-cake",
    category_id: "cat-cakes-loaves",
    name: "Dundee Cake",
    slug: "dundee-cake",
    description: "Traditional fruit cake.",
    base_price: 20.0,
    image_url:
      "https://images.pexels.com/photos/1029665/pexels-photo-1029665.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// Export by category
export const mockBreadProducts = mockProducts.filter((p) => p.category_id === "cat-breads");
export const mockPastriesBakesProducts = mockProducts.filter(
  (p) => p.category_id === "cat-pastries-bakes"
);
export const mockCakesLoavesProducts = mockProducts.filter(
  (p) => p.category_id === "cat-cakes-loaves"
);
export const mockTartsPiesProducts = mockProducts.filter((p) => p.category_id === "cat-tarts-pies");
export const mockSavourySpecialitiesProducts = mockProducts.filter(
  (p) => p.category_id === "cat-savoury-specialities"
);

// ============================================================================
// PRODUCT VARIANTS - MOCK DATA
// ============================================================================

export const mockProductVariants: ProductVariant[] = [
  // Plum Frangipane - whole or sliced
  {
    id: "var-plum-frangipane-whole",
    product_id: "prod-plum-frangipane",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-plum-frangipane-sliced",
    product_id: "prod-plum-frangipane",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Bakewell Tart - whole or sliced
  {
    id: "var-bakewell-whole",
    product_id: "prod-bakewell-tart",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-bakewell-sliced",
    product_id: "prod-bakewell-tart",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Mincemeat Frangipane - whole or sliced
  {
    id: "var-mincemeat-frangipane-whole",
    product_id: "prod-mincemeat-frangipane",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-mincemeat-frangipane-sliced",
    product_id: "prod-mincemeat-frangipane",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Tarte aux Pomme - whole (12 inch) or sliced
  {
    id: "var-tarte-aux-pomme-whole",
    product_id: "prod-tarte-aux-pomme",
    name: "Whole (12 inch diameter)",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-tarte-aux-pomme-sliced",
    product_id: "prod-tarte-aux-pomme",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Carrot Cake - whole or sliced
  {
    id: "var-carrot-cake-whole",
    product_id: "prod-carrot-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-carrot-cake-sliced",
    product_id: "prod-carrot-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Orange Cake - whole or sliced
  {
    id: "var-orange-cake-whole",
    product_id: "prod-orange-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-orange-cake-sliced",
    product_id: "prod-orange-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Blueberry Cake - whole or sliced
  {
    id: "var-blueberry-cake-whole",
    product_id: "prod-blueberry-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-blueberry-cake-sliced",
    product_id: "prod-blueberry-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Coffee and Walnut Cake - whole or sliced
  {
    id: "var-coffee-walnut-whole",
    product_id: "prod-coffee-walnut-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-coffee-walnut-sliced",
    product_id: "prod-coffee-walnut-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Chocolate and Orange Cake - whole or sliced
  {
    id: "var-chocolate-orange-whole",
    product_id: "prod-chocolate-orange-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-chocolate-orange-sliced",
    product_id: "prod-chocolate-orange-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // Dundee Cake - whole or sliced
  {
    id: "var-dundee-whole",
    product_id: "prod-dundee-cake",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-dundee-sliced",
    product_id: "prod-dundee-cake",
    name: "Sliced",
    price_adjustment: 0,
    sort_order: 2,
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
  category_id: mockProductCategories[i % 5].id,
  name: `Product ${i + 1}`,
  slug: `product-${i + 1}`,
  description: `Description for product ${i + 1}`,
  base_price: Math.round((3 + Math.random() * 15) * 100) / 100, // £3-18
  image_url:
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop&auto=format",
  is_active: i % 7 !== 0, // Every 7th is inactive
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
}));
