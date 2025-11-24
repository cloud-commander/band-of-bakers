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
    id: "cat-pastries-bakes",
    name: "Pastries & Bakes",
    slug: "pastries-bakes",
    description: "Focaccia, pastries, swirls, brownies, flapjacks and croissants",
    sort_order: 2,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-cakes-loaves",
    name: "Cakes & Loaves",
    slug: "cakes-loaves",
    description: "Homemade cakes and loaf cakes",
    sort_order: 3,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-tarts-pies",
    name: "Tarts & Pies",
    slug: "tarts-pies",
    description: "Delicious tarts and pies",
    sort_order: 4,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "cat-savoury-specialities",
    name: "Savoury & Specialities",
    slug: "savoury-specialities",
    description: "Savoury pies, quiches, puddings and special treats",
    sort_order: 5,
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
    id: "prod-granary-sourdough",
    category_id: "cat-breads",
    name: "Granary Sourdough",
    slug: "granary-sourdough",
    description: "Traditional granary sourdough with a crusty exterior and soft, tangy interior.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-wheat-white-sourdough",
    category_id: "cat-breads",
    name: "Whole Wheat and White Sourdough",
    slug: "whole-wheat-white-sourdough",
    description: "A perfect blend of whole wheat and white flour sourdough for a balanced flavour.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop&auto=format",
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
    base_price: 4.0,
    image_url:
      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-rye-loaves",
    category_id: "cat-breads",
    name: "Rye Loaves",
    slug: "rye-loaves",
    description: "Dense and flavourful rye loaves. Limited numbers available.",
    base_price: 4.75,
    image_url:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // PASTRIES & BAKES
  {
    id: "prod-focaccia-green-olive",
    category_id: "cat-pastries-bakes",
    name: "Focaccia - Green Olive",
    slug: "focaccia-green-olive",
    description: "Delicious focaccia topped with green olives.",
    base_price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-focaccia-red-onion",
    category_id: "cat-pastries-bakes",
    name: "Focaccia - Red Onion",
    slug: "focaccia-red-onion",
    description: "Focaccia topped with caramelised red onions.",
    base_price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-focaccia-sun-dried-tomato",
    category_id: "cat-pastries-bakes",
    name: "Focaccia - Sun Dried Tomato",
    slug: "focaccia-sun-dried-tomato",
    description: "Focaccia topped with sun-dried tomatoes.",
    base_price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-focaccia-plain-rosemary",
    category_id: "cat-pastries-bakes",
    name: "Focaccia - Plain Rosemary",
    slug: "focaccia-plain-rosemary",
    description: "Classic focaccia with fresh rosemary.",
    base_price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-focaccia-manchego-pesto",
    category_id: "cat-pastries-bakes",
    name: "Focaccia - Manchego and Pesto",
    slug: "focaccia-manchego-pesto",
    description: "Focaccia topped with manchego cheese and pesto.",
    base_price: 5.0,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
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
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-sundried-tomato-swirl",
    category_id: "cat-pastries-bakes",
    name: "Sundried Tomato Swirl",
    slug: "sundried-tomato-swirl",
    description: "Savoury swirl with sundried tomatoes, pesto, basil and cheese.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-pesto-swirl",
    category_id: "cat-pastries-bakes",
    name: "Pesto Swirl",
    slug: "pesto-swirl",
    description: "Savoury swirl with pesto, basil and cheese.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-basil-cheese-swirl",
    category_id: "cat-pastries-bakes",
    name: "Basil and Cheese Swirl",
    slug: "basil-cheese-swirl",
    description: "Savoury swirl with fresh basil and cheese.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-raspberry-chocolate-hazelnut-flapjack",
    category_id: "cat-pastries-bakes",
    name: "Raspberry, Chocolate and Hazelnut Flapjacks",
    slug: "raspberry-chocolate-hazelnut-flapjacks",
    description: "Delicious flapjacks with raspberry, chocolate and hazelnut.",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-raspberry-chocolate-brownie",
    category_id: "cat-pastries-bakes",
    name: "Raspberry and Chocolate Brownies",
    slug: "raspberry-chocolate-brownies",
    description: "Rich brownies with raspberry and chocolate.",
    base_price: 3.25,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-brownie",
    category_id: "cat-pastries-bakes",
    name: "Chocolate Brownies",
    slug: "chocolate-brownies",
    description: "Classic rich chocolate brownies.",
    base_price: 3.0,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-almond-croissant",
    category_id: "cat-pastries-bakes",
    name: "Almond Croissants",
    slug: "almond-croissants",
    description: "Buttery croissants topped with almonds.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-hazelnut-croissant",
    category_id: "cat-pastries-bakes",
    name: "Chocolate and Hazelnut Croissants",
    slug: "chocolate-hazelnut-croissants",
    description: "Flaky croissants with chocolate and hazelnut filling.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-mozzarella-tomato-croissant",
    category_id: "cat-pastries-bakes",
    name: "Mozzarella and Tomato Savoury Croissants",
    slug: "mozzarella-tomato-croissants",
    description: "Savoury croissants with mozzarella and tomato.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-brie-grape-croissant",
    category_id: "cat-pastries-bakes",
    name: "Brie and Red Grape Savoury Croissant",
    slug: "brie-red-grape-croissants",
    description: "Savoury croissants with brie and red grapes.",
    base_price: 3.75,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // CAKES & LOAVES
  {
    id: "prod-malt-loaf",
    category_id: "cat-cakes-loaves",
    name: "Malt Loaf",
    slug: "malt-loaf",
    description: "Traditional malt loaf, perfect for slicing.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-lemon-drizzle-loaf",
    category_id: "cat-cakes-loaves",
    name: "Lemon Drizzle Loaf",
    slug: "lemon-drizzle-loaf",
    description: "Zesty lemon loaf with sweet glaze.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-apple-cinnamon-loaf",
    category_id: "cat-cakes-loaves",
    name: "Apple and Cinnamon Cake Loaf",
    slug: "apple-cinnamon-loaf",
    description: "Moist apple and cinnamon loaf cake.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-carrot-orange-blueberry",
    category_id: "cat-cakes-loaves",
    name: "Carrot, Orange and Blueberry Cake",
    slug: "carrot-orange-blueberry-cake",
    description: "Moist carrot cake with orange and blueberry.",
    base_price: 11.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-coffee-walnut-cake",
    category_id: "cat-cakes-loaves",
    name: "Coffee and Walnut Cake",
    slug: "coffee-walnut-cake",
    description: "Rich coffee cake with walnuts.",
    base_price: 11.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-orange-cake",
    category_id: "cat-cakes-loaves",
    name: "Chocolate and Orange Cake",
    slug: "chocolate-orange-cake",
    description: "Decadent chocolate cake with orange zest.",
    base_price: 11.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-dundee-cake",
    category_id: "cat-cakes-loaves",
    name: "Dundee Cake",
    slug: "dundee-cake",
    description: "Traditional Dundee cake. We have several whole and one for slicing.",
    base_price: 9.5,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // TARTS & PIES
  {
    id: "prod-plum-frangipane",
    category_id: "cat-tarts-pies",
    name: "Plum Frangipane",
    slug: "plum-frangipane",
    description: "Delicious plum frangipane tart.",
    base_price: 8.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-bakewell-tart",
    category_id: "cat-tarts-pies",
    name: "Bakewell Tart",
    slug: "bakewell-tart",
    description: "Classic Bakewell tart with almond filling.",
    base_price: 8.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-mincemeat-frangipane",
    category_id: "cat-tarts-pies",
    name: "Mincemeat Frangipane",
    slug: "mincemeat-frangipane",
    description: "Festive mincemeat frangipane tart.",
    base_price: 8.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-tarte-aux-pomme",
    category_id: "cat-tarts-pies",
    name: "Tarte aux Pomme (Apple Tart)",
    slug: "tarte-aux-pomme",
    description: "Classic French apple tart.",
    base_price: 9.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-apple-blackberry-crumble",
    category_id: "cat-tarts-pies",
    name: "Apple and Blackberry Crumble Cake",
    slug: "apple-blackberry-crumble",
    description: "Whole apple and blackberry crumble cake.",
    base_price: 10.0,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-small-apple-blackberry-pie",
    category_id: "cat-tarts-pies",
    name: "Small Apple and Blackberry Pies",
    slug: "small-apple-blackberry-pies",
    description: "Individual-sized apple and blackberry pies.",
    base_price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-large-apple-pie-frozen",
    category_id: "cat-tarts-pies",
    name: "Large Apple Pies",
    slug: "large-apple-pies",
    description: "Large apple pies sold frozen.",
    base_price: 12.0,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-very-large-apple-pie-frozen",
    category_id: "cat-tarts-pies",
    name: "Very Large Apple Pies",
    slug: "very-large-apple-pies",
    description: "Very large apple pies sold frozen, ideal for Christmas.",
    base_price: 18.0,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-banoffee-pie",
    category_id: "cat-tarts-pies",
    name: "Banoffee Pie",
    slug: "banoffee-pie",
    description: "Whole banoffee pie with toffee and banana.",
    base_price: 11.0,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-tarte-au-citron",
    category_id: "cat-tarts-pies",
    name: "Tarte au Citron",
    slug: "tarte-au-citron",
    description: "Classic French lemon tart, made to order.",
    base_price: 10.0,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-lemon-meringue-pie",
    category_id: "cat-tarts-pies",
    name: "Lemon Meringue Pie",
    slug: "lemon-meringue-pie",
    description: "Whole lemon meringue pie, made to order.",
    base_price: 10.5,
    image_url:
      "https://images.unsplash.com/photo-1563379091339-03246963d7d3?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },

  // SAVOURY & SPECIALITIES
  {
    id: "prod-curried-beef-pasty",
    category_id: "cat-savoury-specialities",
    name: "Individual Curried Beef Pasties",
    slug: "curried-beef-pasties",
    description: "Individual-sized curried beef pasties.",
    base_price: 4.75,
    image_url:
      "https://images.unsplash.com/photo-1584467735871-3f2b4b4d72d9?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chicken-vegetable-pie",
    category_id: "cat-savoury-specialities",
    name: "Large Chicken and Vegetable Pies",
    slug: "chicken-vegetable-pies",
    description: "Whole large chicken and vegetable pies.",
    base_price: 10.5,
    image_url:
      "https://images.unsplash.com/photo-1584467735871-3f2b4b4d72d9?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-small-salmon-dill-tart",
    category_id: "cat-savoury-specialities",
    name: "Small Salmon and Dill Tarts",
    slug: "small-salmon-dill-tarts",
    description: "Small salmon and dill tarts.",
    base_price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-large-salmon-dill-tart",
    category_id: "cat-savoury-specialities",
    name: "Large Salmon and Dill Tarts",
    slug: "large-salmon-dill-tarts",
    description: "Large salmon and dill tarts.",
    base_price: 9.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-mushroom-cheese-quiche",
    category_id: "cat-savoury-specialities",
    name: "Mushroom and Cheese Quiche",
    slug: "mushroom-cheese-quiche",
    description: "Whole mushroom and cheese quiche.",
    base_price: 8.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-tomato-cheese-quiche",
    category_id: "cat-savoury-specialities",
    name: "Tomato and Cheese Quiche",
    slug: "tomato-cheese-quiche",
    description: "Whole tomato and cheese quiche.",
    base_price: 8.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-bread-butter-pudding",
    category_id: "cat-savoury-specialities",
    name: "Bread and Butter Pudding",
    slug: "bread-butter-pudding",
    description: "Classic bread and butter pudding sold in individual foil containers.",
    base_price: 4.0,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-small-portuguese-custard-tart",
    category_id: "cat-savoury-specialities",
    name: "Small Portuguese Custard Tarts",
    slug: "small-portuguese-custard-tarts",
    description: "Small Portuguese custard tarts.",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-individual-mince-pie",
    category_id: "cat-savoury-specialities",
    name: "Individual Mince Pies",
    slug: "individual-mince-pies",
    description: "Individual festive mince pies.",
    base_price: 2.5,
    image_url:
      "https://images.unsplash.com/photo-1584467735871-3f2b4b4d72d9?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-individual-chocolate-hob-nob",
    category_id: "cat-savoury-specialities",
    name: "Individual Chocolate Hob Nobs",
    slug: "individual-chocolate-hob-nobs",
    description: "Individual chocolate-covered hob nobs.",
    base_price: 2.75,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-chocolate-cranberry-pecan-tiffin",
    category_id: "cat-savoury-specialities",
    name: "Chocolate, Cranberry and Pecan Tiffin",
    slug: "chocolate-cranberry-pecan-tiffin",
    description: "Delicious tiffin with chocolate, cranberry and pecan.",
    base_price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop&auto=format",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "prod-eccles-cake",
    category_id: "cat-savoury-specialities",
    name: "Eccles Cakes",
    slug: "eccles-cakes",
    description: "Traditional Eccles cakes with currants.",
    base_price: 3.0,
    image_url:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=600&fit=crop&auto=format",
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

  // Carrot, Orange and Blueberry Cake - whole or sliced
  {
    id: "var-carrot-orange-blueberry-whole",
    product_id: "prod-carrot-orange-blueberry",
    name: "Whole",
    price_adjustment: 0,
    sort_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "var-carrot-orange-blueberry-sliced",
    product_id: "prod-carrot-orange-blueberry",
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
