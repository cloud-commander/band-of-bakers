/**
 * Real Products Mock Data
 * Orders, Reviews, and Testimonials for Real Products
 * Used by seed script when --real-products flag is set
 */

import type { InsertOrder, InsertOrderItem } from "@/db/schema";
import type { InsertReview } from "@/db/schema";
import type { InsertTestimonial } from "@/db/schema";
import type { InsertBakeSale } from "@/db/schema";
import { mockUsers } from "@/lib/seed-data/users";
import { mockLocations } from "@/lib/seed-data/locations";
import { realProducts, realProductVariants } from "@/lib/real-products-data";

// ============================================================================
// BAKE SALES - Past and Future
// ============================================================================

// Past bake sales (last 6 months - weekly sales)
export const realPastBakeSales: InsertBakeSale[] = [
  // June 2024
  {
    id: "rbs-past-1",
    date: "2024-06-02",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-05-31T18:00:00.000Z",
    is_active: false,
    created_at: "2024-05-01T00:00:00.000Z",
    updated_at: "2024-06-02T00:00:00.000Z",
  },
  {
    id: "rbs-past-2",
    date: "2024-06-09",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-06-07T18:00:00.000Z",
    is_active: false,
    created_at: "2024-05-01T00:00:00.000Z",
    updated_at: "2024-06-09T00:00:00.000Z",
  },
  {
    id: "rbs-past-3",
    date: "2024-06-16",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-06-14T18:00:00.000Z",
    is_active: false,
    created_at: "2024-05-01T00:00:00.000Z",
    updated_at: "2024-06-16T00:00:00.000Z",
  },
  {
    id: "rbs-past-4",
    date: "2024-06-23",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-06-21T18:00:00.000Z",
    is_active: false,
    created_at: "2024-05-01T00:00:00.000Z",
    updated_at: "2024-06-23T00:00:00.000Z",
  },
  {
    id: "rbs-past-5",
    date: "2024-06-30",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-06-28T18:00:00.000Z",
    is_active: false,
    created_at: "2024-05-01T00:00:00.000Z",
    updated_at: "2024-06-30T00:00:00.000Z",
  },

  // July 2024
  {
    id: "rbs-past-6",
    date: "2024-07-07",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-07-05T18:00:00.000Z",
    is_active: false,
    created_at: "2024-06-01T00:00:00.000Z",
    updated_at: "2024-07-07T00:00:00.000Z",
  },
  {
    id: "rbs-past-7",
    date: "2024-07-14",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-07-12T18:00:00.000Z",
    is_active: false,
    created_at: "2024-06-01T00:00:00.000Z",
    updated_at: "2024-07-14T00:00:00.000Z",
  },
  {
    id: "rbs-past-8",
    date: "2024-07-21",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-07-19T18:00:00.000Z",
    is_active: false,
    created_at: "2024-06-01T00:00:00.000Z",
    updated_at: "2024-07-21T00:00:00.000Z",
  },
  {
    id: "rbs-past-9",
    date: "2024-07-28",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-07-26T18:00:00.000Z",
    is_active: false,
    created_at: "2024-06-01T00:00:00.000Z",
    updated_at: "2024-07-28T00:00:00.000Z",
  },

  // August 2024
  {
    id: "rbs-past-10",
    date: "2024-08-04",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-08-02T18:00:00.000Z",
    is_active: false,
    created_at: "2024-07-01T00:00:00.000Z",
    updated_at: "2024-08-04T00:00:00.000Z",
  },
  {
    id: "rbs-past-11",
    date: "2024-08-11",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-08-09T18:00:00.000Z",
    is_active: false,
    created_at: "2024-07-01T00:00:00.000Z",
    updated_at: "2024-08-11T00:00:00.000Z",
  },
  {
    id: "rbs-past-12",
    date: "2024-08-18",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-08-16T18:00:00.000Z",
    is_active: false,
    created_at: "2024-07-01T00:00:00.000Z",
    updated_at: "2024-08-18T00:00:00.000Z",
  },
  {
    id: "rbs-past-13",
    date: "2024-08-25",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-08-23T18:00:00.000Z",
    is_active: false,
    created_at: "2024-07-01T00:00:00.000Z",
    updated_at: "2024-08-25T00:00:00.000Z",
  },

  // September 2024
  {
    id: "rbs-past-14",
    date: "2024-09-01",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-08-30T18:00:00.000Z",
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    updated_at: "2024-09-01T00:00:00.000Z",
  },
  {
    id: "rbs-past-15",
    date: "2024-09-08",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-09-06T18:00:00.000Z",
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    updated_at: "2024-09-08T00:00:00.000Z",
  },
  {
    id: "rbs-past-16",
    date: "2024-09-15",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-09-13T18:00:00.000Z",
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    updated_at: "2024-09-15T00:00:00.000Z",
  },
  {
    id: "rbs-past-17",
    date: "2024-09-22",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-09-20T18:00:00.000Z",
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    updated_at: "2024-09-22T00:00:00.000Z",
  },
  {
    id: "rbs-past-18",
    date: "2024-09-29",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-09-27T18:00:00.000Z",
    is_active: false,
    created_at: "2024-08-01T00:00:00.000Z",
    updated_at: "2024-09-29T00:00:00.000Z",
  },

  // October 2024
  {
    id: "rbs-past-19",
    date: "2024-10-06",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-10-04T18:00:00.000Z",
    is_active: false,
    created_at: "2024-09-01T00:00:00.000Z",
    updated_at: "2024-10-06T00:00:00.000Z",
  },
  {
    id: "rbs-past-20",
    date: "2024-10-13",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-10-11T18:00:00.000Z",
    is_active: false,
    created_at: "2024-09-01T00:00:00.000Z",
    updated_at: "2024-10-13T00:00:00.000Z",
  },
  {
    id: "rbs-past-21",
    date: "2024-10-20",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-10-18T18:00:00.000Z",
    is_active: false,
    created_at: "2024-09-01T00:00:00.000Z",
    updated_at: "2024-10-20T00:00:00.000Z",
  },
  {
    id: "rbs-past-22",
    date: "2024-10-27",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-10-25T18:00:00.000Z",
    is_active: false,
    created_at: "2024-09-01T00:00:00.000Z",
    updated_at: "2024-10-27T00:00:00.000Z",
  },

  // November 2024
  {
    id: "rbs-past-23",
    date: "2024-11-03",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-11-01T18:00:00.000Z",
    is_active: false,
    created_at: "2024-10-01T00:00:00.000Z",
    updated_at: "2024-11-03T00:00:00.000Z",
  },
  {
    id: "rbs-past-24",
    date: "2024-11-10",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-11-08T18:00:00.000Z",
    is_active: false,
    created_at: "2024-10-01T00:00:00.000Z",
    updated_at: "2024-11-10T00:00:00.000Z",
  },
  {
    id: "rbs-past-25",
    date: "2024-11-17",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-11-15T18:00:00.000Z",
    is_active: false,
    created_at: "2024-10-01T00:00:00.000Z",
    updated_at: "2024-11-17T00:00:00.000Z",
  },
  {
    id: "rbs-past-26",
    date: "2024-11-24",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-11-22T18:00:00.000Z",
    is_active: false,
    created_at: "2024-10-01T00:00:00.000Z",
    updated_at: "2024-11-24T00:00:00.000Z",
  },
];

// Future bake sales (next 2 months)
export const realFutureBakeSales: InsertBakeSale[] = [
  {
    id: "rbs-future-1",
    date: "2025-12-13", // Saturday
    location_id: mockLocations[0].id,
    cutoff_datetime: "2025-12-11T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-2",
    date: "2025-12-21", // Sunday (Holiday Exception)
    location_id: mockLocations[1].id,
    cutoff_datetime: "2025-12-19T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-3",
    date: "2026-01-10", // Saturday
    location_id: mockLocations[2].id,
    cutoff_datetime: "2026-01-08T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-4",
    date: "2026-02-07", // Saturday
    location_id: mockLocations[0].id,
    cutoff_datetime: "2026-02-05T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-5",
    date: "2026-03-07", // Saturday
    location_id: mockLocations[1].id,
    cutoff_datetime: "2026-03-05T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-6",
    date: "2026-04-04", // Saturday
    location_id: mockLocations[2].id,
    cutoff_datetime: "2026-04-02T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
  {
    id: "rbs-future-7",
    date: "2026-05-02", // Saturday
    location_id: mockLocations[0].id,
    cutoff_datetime: "2026-04-30T18:00:00.000Z",
    is_active: true,
    created_at: "2025-11-01T00:00:00.000Z",
    updated_at: "2025-11-01T00:00:00.000Z",
  },
];

// ============================================================================
// HELPERS TO GENERATE ORDERS
// ============================================================================

// Helper to  calculate dates relative to bake sale
function getOrderDate(bakeSaleDate: string, daysBefore: number): string {
  const date = new Date(bakeSaleDate);
  date.setDate(date.getDate() - daysBefore);

  const now = new Date();
  if (date > now) {
    // If calculated date is in the future, set it to a random time in the last 7 days
    const randomDaysAgo = Math.floor(Math.random() * 7);
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - randomDaysAgo);
    return pastDate.toISOString();
  }

  return date.toISOString();
}

// Get customer user IDs (excluding staff)
const customerIds = mockUsers.filter((u) => u.role === "customer").map((u) => u.id);

// ============================================================================
// ORDERS & ORDER ITEMS
// ============================================================================

// Generate orders for past bake sales (2-5 orders per bake sale)
export const realOrders: InsertOrder[] = [];
export const realOrderItems: InsertOrderItem[] = [];

let orderCounter = 1;
let orderItemCounter = 1;

// Helper function to create an order with items
function createOrder(
  bakeSaleId: string,
  bakeSaleDate: string,
  userId: string,
  daysBeforeOrder: number,
  status: "pending" | "processing" | "ready" | "fulfilled" | "cancelled"
) {
  const orderId = `rorder-${orderCounter++}`;
  const orderNumber = orderCounter - 1;
  const orderDate = getOrderDate(bakeSaleDate, daysBeforeOrder);

  // Calculate totals (will be calculated from items)
  let subtotal = 0;
  const items: InsertOrderItem[] = [];

  // Randomly select 2-6 products for this order
  const numItems = Math.floor(Math.random() * 5) + 2;
  const shuffledProducts = [...realProducts].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(numItems, shuffledProducts.length); i++) {
    const product = shuffledProducts[i];
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items

    // Check if product has variants
    const variants = realProductVariants.filter((v) => v.product_id === product.id);
    let unitPrice = product.base_price;
    let variantId: string | null = null;

    if (variants.length > 0) {
      // Randomly select a variant
      const variant = variants[Math.floor(Math.random() * variants.length)];
      unitPrice = product.base_price + (variant.price_adjustment || 0);
      variantId = variant.id;
    }

    const totalPrice = unitPrice * quantity;
    subtotal += totalPrice;

    items.push({
      id: `rorder-item-${orderItemCounter++}`,
      order_id: orderId,
      product_id: product.id,
      product_variant_id: variantId,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
      is_available: true,
      unavailable_reason: null,
      created_at: orderDate,
      updated_at: orderDate,
    });
  }

  const total = subtotal; // No delivery fee for collection orders

  // Determine payment status based on order status
  // payment_on_collection: pending until fulfilled, then completed
  let paymentStatus: "pending" | "completed" = "pending";
  if (status === "fulfilled") {
    paymentStatus = "completed";
  }

  realOrders.push({
    id: orderId,
    order_number: orderNumber,
    user_id: userId,
    bake_sale_id: bakeSaleId,
    status,
    fulfillment_method: "collection",
    payment_method: "payment_on_collection",
    payment_status: paymentStatus,
    payment_intent_id: null,
    subtotal,
    delivery_fee: 0,
    voucher_discount: 0,
    total,
    shipping_address_line1: null,
    shipping_address_line2: null,
    shipping_city: null,
    shipping_postcode: null,
    billing_address_line1: "123 Mock Street",
    billing_address_line2: null,
    billing_city: "Shrewsbury",
    billing_postcode: "SY1 1AA",
    voucher_id: null,
    notes: null,
    created_at: orderDate,
    updated_at: orderDate,
  });

  realOrderItems.push(...items);
}

// Generate orders for each past bake sale
realPastBakeSales.forEach((bakeSale) => {
  const ordersForThisSale = Math.floor(Math.random() * 4) + 2; // 2-5 orders per sale

  for (let i = 0; i < ordersForThisSale; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const daysBeforeOrder = Math.floor(Math.random() * 5) + 2; // 2-6 days before sale
    createOrder(bakeSale.id, bakeSale.date, userId, daysBeforeOrder, "fulfilled");
  }
});

// Generate orders for upcoming bake sales with various statuses
// First upcoming sale (Dec 13) - mix of pending and processing orders
if (realFutureBakeSales[0]) {
  const bakeSale1 = realFutureBakeSales[0];
  // 5-8 orders for this sale in various states
  for (let i = 0; i < 7; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const status = i < 3 ? "pending" : i < 5 ? "processing" : "pending";
    createOrder(bakeSale1.id, bakeSale1.date, userId, 5 - i, status as "pending" | "processing");
  }
}

// Second upcoming sale (Dec 21) - mostly pending with some processing
if (realFutureBakeSales[1]) {
  const bakeSale2 = realFutureBakeSales[1];
  // 4-6 orders for this sale
  for (let i = 0; i < 5; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const status = i < 2 ? "processing" : "pending";
    createOrder(bakeSale2.id, bakeSale2.date, userId, 8 - i, status as "pending" | "processing");
  }
}

// Third upcoming sale (Jan 10) - mix including ready orders
if (realFutureBakeSales[2]) {
  const bakeSale3 = realFutureBakeSales[2];
  // 3-5 orders for this sale
  for (let i = 0; i < 4; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const status = i === 0 ? "ready" : i < 2 ? "processing" : "pending";
    createOrder(
      bakeSale3.id,
      bakeSale3.date,
      userId,
      10 - i,
      status as "pending" | "processing" | "ready"
    );
  }
}

// Fourth upcoming sale (Feb 7) - just a few pending orders
if (realFutureBakeSales[3]) {
  const bakeSale4 = realFutureBakeSales[3];
  for (let i = 0; i < 2; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    createOrder(bakeSale4.id, bakeSale4.date, userId, 15, "pending");
  }
}

// ============================================================================
// PRODUCT REVIEWS
// ============================================================================

// Popular products to review (breads, pastries, pies)
const popularProductIds = [
  "prod_foccacia",
  "prod_sourdough",
  "prod_croissants",
  "prod_apple_pies",
  "prod_portuguese_custard_tarts",
  "prod_large_apple_pie",
  "prod_lemon_drizzle_cake",
  "prod_cinnamon_knots",
  "prod_eccles_cakes",
  "prod_flapjacks",
  "prod_curried_beef_pasties",
  "prod_millionaire_shortbread",
];

const reviewTexts = [
  {
    title: "Absolutely Divine!",
    comment:
      "The best I've ever tasted. Fresh, flavorful, and perfectly baked. Will definitely order again!",
    rating: 5,
  },
  {
    title: "Delicious!",
    comment: "Really enjoyed this. Great texture and taste. Highly recommend!",
    rating: 5,
  },
  {
    title: "Fantastic Quality",
    comment: "You can taste the quality ingredients. Freshly baked and delicious.",
    rating: 5,
  },
  {
    title: "Very Good",
    comment: "Really nice, would buy again. Maybe a bit pricey but worth it for the quality.",
    rating: 4,
  },
  {
    title: "Excellent",
    comment: "My family loved these! They disappeared within minutes.",
    rating: 5,
  },
  { title: "Tasty!", comment: "Good flavor and texture. Fresh and well-made.", rating: 4 },
  {
    title: "Pretty Good",
    comment:
      "Nice product, enjoyed it. Would have liked it slightly less sweet but that's personal preference.",
    rating: 4,
  },
  {
    title: "Amazing!",
    comment: "Best bakery items in Shropshire! Always fresh and always delicious.",
    rating: 5,
  },
  { title: "Lovely", comment: "Really enjoyed this. Perfect with a cup of tea!", rating: 5 },
  {
    title: "Great Product",
    comment: "Excellent quality, will order again. Kids absolutely loved them!",
    rating: 5,
  },
  {
    title: "Superb",
    comment: "Outstanding quality. You can tell these are made with care and good ingredients.",
    rating: 5,
  },
  {
    title: "Delightful",
    comment: "Perfectly baked, great texture, wonderful flavor. Can't fault it!",
    rating: 5,
  },
  {
    title: "Really Nice",
    comment: "Good product, tastes homemade. Much better than supermarket versions.",
    rating: 4,
  },
  {
    title: "Highly Recommend",
    comment: "These are brilliant! Fresh, tasty, and great value for money.",
    rating: 5,
  },
  {
    title: "Wonderful",
    comment: "Absolutely love these. Order them every time they're available!",
    rating: 5,
  },
];

export const realReviews: InsertReview[] = [];
let reviewCounter = 1;

popularProductIds.forEach((productId) => {
  // 2-4 reviews per popular product
  const numReviews = Math.floor(Math.random() * 3) + 2;

  for (let i = 0; i < numReviews; i++) {
    const userId = customerIds[Math.floor(Math.random() * customerIds.length)];
    const review = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
    const daysAgo = Math.floor(Math.random() * 120) + 1; // 1-120 days ago
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    realReviews.push({
      id: `rreview-${reviewCounter++}`,
      product_id: productId,
      user_id: userId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verified_purchase: Math.random() > 0.3, // 70% verified purchases
      helpful_count: Math.floor(Math.random() * 15),
      status: "approved",
      created_at: date.toISOString(),
      updated_at: date.toISOString(),
    });
  }
});

// ============================================================================
// TESTIMONIALS
// ============================================================================

export const realTestimonials: InsertTestimonial[] = [
  {
    id: "rtest-1",
    name: "Sarah Mitchell",
    role: "Regular Customer",
    content:
      "Band of Bakers has become a weekly treat for our family! The sourdough is absolutely incredible - crusty on the outside, perfectly soft inside. We've tried everything from their foccacia to the Portuguese custard tarts, and every single item has been outstanding.",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[0],
    status: "approved",
    created_at: "2024-09-15T00:00:00.000Z",
    updated_at: "2024-09-15T00:00:00.000Z",
  },
  {
    id: "rtest-2",
    name: "James Thompson",
    role: "Local Business Owner",
    content:
      "We order from Band of Bakers for all our office meetings. The croissants and pastries are always fresh, and the service is excellent. The lemon drizzle cake is particularly popular with our team!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[1],
    status: "approved",
    created_at: "2024-10-02T00:00:00.000Z",
    updated_at: "2024-10-02T00:00:00.000Z",
  },
  {
    id: "rtest-3",
    name: "Emma Davies",
    role: "Food Blogger",
    content:
      "As someone who reviews food regularly, I can honestly say Band of Bakers produces some of the finest baked goods I've encountered. Their flapjacks are legendary, and the apple pies - both small and large - are perfection!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[2],
    status: "approved",
    created_at: "2024-08-20T00:00:00.000Z",
    updated_at: "2024-08-20T00:00:00.000Z",
  },
  {
    id: "rtest-4",
    name: "Michael O'Connor",
    role: "Weekly Subscriber",
    content:
      "I've been ordering weekly for over six months now. The quality never wavers - everything is consistently delicious. Special mention to the curried beef pasties and the eccles cakes. Absolute gems!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[3],
    status: "approved",
    created_at: "2024-07-10T00:00:00.000Z",
    updated_at: "2024-07-10T00:00:00.000Z",
  },
  {
    id: "rtest-5",
    name: "Lisa Patel",
    role: "Loyal Customer",
    content:
      "The cinnamon knots are to die for! And don't even get me started on the millionaire shortbread - it's dangerously addictive. Love supporting a local business that clearly takes pride in their craft.",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[4],
    status: "approved",
    created_at: "2024-11-05T00:00:00.000Z",
    updated_at: "2024-11-05T00:00:00.000Z",
  },
  {
    id: "rtest-6",
    name: "Robert Hughes",
    role: "Customer Since 2024",
    content:
      "Discovered Band of Bakers at a local market and now we're hooked! The wholemeal loaf makes the best toast, and the kids love the Portuguese custard tarts. Can't recommend enough!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[5],
    status: "approved",
    created_at: "2024-06-18T00:00:00.000Z",
    updated_at: "2024-06-18T00:00:00.000Z",
  },
  {
    id: "rtest-7",
    name: "Catherine Williams",
    role: "Happy Customer",
    content:
      "Every single product I've tried has been exceptional. The attention to detail and quality ingredients really show. The lemon meringue pie was the star of our dinner party!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[6],
    status: "approved",
    created_at: "2024-10-22T00:00:00.000Z",
    updated_at: "2024-10-22T00:00:00.000Z",
  },
  {
    id: "rtest-8",
    name: "David Chen",
    role: "Regular Buyer",
    content:
      "Fantastic bakery! The foccacia is restaurant-quality, and I'm obsessed with the peach pastries. Perfect for weekend brunches. Always arrives fresh and beautifully presented.",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[7],
    status: "approved",
    created_at: "2024-09-30T00:00:00.000Z",
    updated_at: "2024-09-30T00:00:00.000Z",
  },
  {
    id: "rtest-9",
    name: "Rachel Green",
    role: "Monthly Subscriber",
    content:
      "The whole tarte au citron was the highlight of my birthday celebration. Absolutely stunning and tasted incredible. Band of Bakers never disappoints!",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[8],
    status: "approved",
    created_at: "2024-08-12T00:00:00.000Z",
    updated_at: "2024-08-12T00:00:00.000Z",
  },
  {
    id: "rtest-10",
    name: "Thomas Anderson",
    role: "Satisfied Customer",
    content:
      "Best sourdough in Shropshire, hands down. Also highly recommend the savoury croissants - perfect for breakfast! Great value for exceptional quality.",
    rating: 5,
    avatar_url: null,
    user_id: customerIds[9],
    status: "approved",
    created_at: "2024-11-18T00:00:00.000Z",
    updated_at: "2024-11-18T00:00:00.000Z",
  },
];
