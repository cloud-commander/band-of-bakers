import { z } from "zod";

// ============================================================================
// ORDER ENUMS
// ============================================================================

export const orderStatuses = [
  "pending",
  "processing",
  "ready",
  "fulfilled",
  "cancelled",
  "refunded",
] as const;

export const paymentStatuses = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

export const fulfillmentMethods = ["collection", "delivery"] as const;

export const paymentMethods = [
  "stripe",
  "paypal",
  "bank_transfer",
  "payment_on_collection",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type FulfillmentMethod = (typeof fulfillmentMethods)[number];
export type PaymentMethod = (typeof paymentMethods)[number];

// ============================================================================
// ORDER SCHEMAS
// ============================================================================

// UK postcode regex
const ukPostcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;

export const orderSchema = z
  .object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    bake_sale_id: z.string().uuid(),
    status: z.enum(orderStatuses),
    fulfillment_method: z.enum(fulfillmentMethods),
    payment_method: z.enum(paymentMethods),
    payment_status: z.enum(paymentStatuses),
    payment_intent_id: z.string().nullable().optional(),
    subtotal: z.number().nonnegative(),
    delivery_fee: z.number().nonnegative(),
    voucher_discount: z.number().nonnegative(),
    total: z.number().nonnegative(),
    // Shipping address (required if delivery)
    shipping_address_line1: z.string().nullable().optional(),
    shipping_address_line2: z.string().nullable().optional(),
    shipping_city: z.string().nullable().optional(),
    shipping_postcode: z.string().regex(ukPostcodeRegex).nullable().optional(),
    // Billing address (always required)
    billing_address_line1: z.string().min(1, "Billing address is required"),
    billing_address_line2: z.string().nullable().optional(),
    billing_city: z.string().min(1, "Billing city is required"),
    billing_postcode: z.string().regex(ukPostcodeRegex, "Invalid UK postcode"),
    voucher_id: z.string().uuid().nullable().optional(),
    notes: z.string().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
  })
  .refine(
    (data) => {
      // If delivery, shipping address must be provided
      if (data.fulfillment_method === "delivery") {
        return (
          !!data.shipping_address_line1 &&
          !!data.shipping_city &&
          !!data.shipping_postcode
        );
      }
      return true;
    },
    {
      message: "Shipping address is required for delivery orders",
      path: ["shipping_address_line1"],
    }
  );

export const insertOrderSchema = z
  .object({
    user_id: z.string().uuid(),
    bake_sale_id: z.string().uuid(),
    status: z.enum(orderStatuses).default("pending"),
    fulfillment_method: z.enum(fulfillmentMethods).default("collection"),
    payment_method: z.enum(paymentMethods).default("payment_on_collection"),
    payment_status: z.enum(paymentStatuses).default("pending"),
    payment_intent_id: z.string().nullable().optional(),
    subtotal: z.number().nonnegative(),
    delivery_fee: z.number().nonnegative().default(0),
    voucher_discount: z.number().nonnegative().default(0),
    total: z.number().nonnegative(),
    shipping_address_line1: z.string().nullable().optional(),
    shipping_address_line2: z.string().nullable().optional(),
    shipping_city: z.string().nullable().optional(),
    shipping_postcode: z.string().regex(ukPostcodeRegex).nullable().optional(),
    billing_address_line1: z.string().min(1, "Billing address is required"),
    billing_address_line2: z.string().nullable().optional(),
    billing_city: z.string().min(1, "Billing city is required"),
    billing_postcode: z.string().regex(ukPostcodeRegex, "Invalid UK postcode"),
    voucher_id: z.string().uuid().nullable().optional(),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.fulfillment_method === "delivery") {
        return (
          !!data.shipping_address_line1 &&
          !!data.shipping_city &&
          !!data.shipping_postcode
        );
      }
      return true;
    },
    {
      message: "Shipping address is required for delivery orders",
      path: ["shipping_address_line1"],
    }
  );

export const updateOrderSchema = insertOrderSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// ORDER ITEM SCHEMAS
// ============================================================================

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  product_variant_id: z.string().uuid().nullable().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  unit_price: z.number().positive(),
  total_price: z.number().positive(),
  is_available: z.boolean().default(true),
  unavailable_reason: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertOrderItemSchema = z.object({
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  product_variant_id: z.string().uuid().nullable().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  unit_price: z.number().positive(),
  total_price: z.number().positive(),
  is_available: z.boolean().default(true),
  unavailable_reason: z.string().nullable().optional(),
});

export const updateOrderItemSchema = insertOrderItemSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// COMBINED SCHEMAS
// ============================================================================

export const orderWithItemsSchema = orderSchema.merge(
  z.object({
    items: z.array(orderItemSchema),
  })
);

// Type exports
export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type OrderItem = z.infer<typeof orderItemSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof updateOrderItemSchema>;

export type OrderWithItems = z.infer<typeof orderWithItemsSchema>;
