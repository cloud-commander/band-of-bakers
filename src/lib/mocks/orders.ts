import type {
  Order,
  OrderItem,
  OrderWithItems,
  OrderStatus,
  FulfillmentMethod,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/validators/order";
import { mockUsers, mockCurrentUser } from "./users";
import { mockBakeSales } from "./bake-sales";
import { mockProducts } from "./products";

// ============================================================================
// ORDERS - MOCK DATA
// ============================================================================

export const mockOrders: Order[] = [
  {
    id: "ord-1",
    user_id: mockCurrentUser.id,
    bake_sale_id: mockBakeSales[0].id,
    status: "processing",
    fulfillment_method: "collection",
    payment_method: "payment_on_collection",
    payment_status: "pending",
    payment_intent_id: null,
    subtotal: 18.5,
    delivery_fee: 0,
    voucher_discount: 0,
    total: 18.5,
    shipping_address_line1: null,
    shipping_address_line2: null,
    shipping_city: null,
    shipping_postcode: null,
    billing_address_line1: "123 High Street",
    billing_address_line2: null,
    billing_city: "Shrewsbury",
    billing_postcode: "SY1 1AA",
    voucher_id: null,
    notes: null,
    created_at: "2024-11-20T10:00:00.000Z",
    updated_at: "2024-11-20T10:00:00.000Z",
  },
  {
    id: "ord-2",
    user_id: mockUsers[4].id, // Jane Doe
    bake_sale_id: mockBakeSales[0].id,
    status: "fulfilled",
    fulfillment_method: "delivery",
    payment_method: "stripe",
    payment_status: "completed",
    payment_intent_id: "pi_mock123",
    subtotal: 28.0,
    delivery_fee: 5.0,
    voucher_discount: 3.0,
    total: 30.0,
    shipping_address_line1: "45 Oak Avenue",
    shipping_address_line2: "Flat 2",
    shipping_city: "Telford",
    shipping_postcode: "TF1 2AB",
    billing_address_line1: "45 Oak Avenue",
    billing_address_line2: "Flat 2",
    billing_city: "Telford",
    billing_postcode: "TF1 2AB",
    voucher_id: "vouch-1",
    notes: "Please leave at door",
    created_at: "2024-11-18T14:30:00.000Z",
    updated_at: "2024-11-21T09:00:00.000Z",
  },
];

// ============================================================================
// ORDER ITEMS - MOCK DATA
// ============================================================================

export const mockOrderItems: OrderItem[] = [
  // Order 1 items
  {
    id: "oi-1",
    order_id: "ord-1",
    product_id: mockProducts[0].id, // Sourdough
    product_variant_id: "var-sourdough-small",
    quantity: 2,
    unit_price: 5.5,
    total_price: 11.0,
    is_available: true,
    unavailable_reason: null,
    created_at: "2024-11-20T10:00:00.000Z",
    updated_at: "2024-11-20T10:00:00.000Z",
  },
  {
    id: "oi-2",
    order_id: "ord-1",
    product_id: mockProducts[4].id, // Croissant
    product_variant_id: null,
    quantity: 3,
    unit_price: 2.75,
    total_price: 8.25,
    is_available: true,
    unavailable_reason: null,
    created_at: "2024-11-20T10:00:00.000Z",
    updated_at: "2024-11-20T10:00:00.000Z",
  },

  // Order 2 items
  {
    id: "oi-3",
    order_id: "ord-2",
    product_id: mockProducts[8].id, // Victoria Sponge
    product_variant_id: "var-victoria-medium",
    quantity: 1,
    unit_price: 18.0,
    total_price: 18.0,
    is_available: true,
    unavailable_reason: null,
    created_at: "2024-11-18T14:30:00.000Z",
    updated_at: "2024-11-18T14:30:00.000Z",
  },
  {
    id: "oi-4",
    order_id: "ord-2",
    product_id: mockProducts[12].id, // Chocolate Chip Cookies
    product_variant_id: null,
    quantity: 2,
    unit_price: 4.5,
    total_price: 9.0,
    is_available: true,
    unavailable_reason: null,
    created_at: "2024-11-18T14:30:00.000Z",
    updated_at: "2024-11-18T14:30:00.000Z",
  },
];

// ============================================================================
// COMBINED DATA
// ============================================================================

export const mockOrdersWithItems: OrderWithItems[] = mockOrders.map((order) => ({
  ...order,
  items: mockOrderItems.filter((item) => item.order_id === order.id),
}));

// ============================================================================
// EDGE CASES
// ============================================================================

export const mockOrdersEmpty: Order[] = [];
export const mockOrdersSingle: Order[] = [mockOrders[0]];

// Cancelled order
export const mockOrderCancelled: Order = {
  ...mockOrders[0],
  id: "ord-cancelled",
  status: "cancelled",
  notes: "Customer requested cancellation",
};

// Many orders (for pagination)
export const mockOrdersMany: Order[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ord-many-${i}`,
  user_id: mockUsers[i % mockUsers.length].id,
  bake_sale_id: mockBakeSales[i % mockBakeSales.length].id,
  status: ["pending", "processing", "ready", "fulfilled"][i % 4] as OrderStatus,
  fulfillment_method: (i % 2 === 0 ? "collection" : "delivery") as FulfillmentMethod,
  payment_method: ["stripe", "payment_on_collection"][i % 2] as PaymentMethod,
  payment_status: (i % 2 === 0 ? "completed" : "pending") as PaymentStatus,
  payment_intent_id: i % 2 === 0 ? `pi_mock${i}` : null,
  subtotal: Math.round((15 + Math.random() * 40) * 100) / 100,
  delivery_fee: i % 2 === 0 ? 0 : 5.0,
  voucher_discount: 0,
  total: Math.round((15 + Math.random() * 45) * 100) / 100,
  shipping_address_line1: i % 2 === 0 ? null : "123 Test St",
  shipping_address_line2: null,
  shipping_city: i % 2 === 0 ? null : "Testville",
  shipping_postcode: i % 2 === 0 ? null : "TE1 1ST",
  billing_address_line1: "123 Test St",
  billing_address_line2: null,
  billing_city: "Testville",
  billing_postcode: "TE1 1ST",
  voucher_id: null,
  notes: null,
  created_at: `2024-11-${String((i % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
  updated_at: `2024-11-${String((i % 28) + 1).padStart(2, "0")}T10:00:00.000Z`,
}));
