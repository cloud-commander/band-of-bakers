import { describe, it, expect } from "vitest";
import { insertOrderSchema, insertOrderItemSchema } from "../order";

describe("Order Validators", () => {
  describe("insertOrderSchema", () => {
    const validOrder = {
      user_id: "123e4567-e89b-12d3-a456-426614174000",
      bake_sale_id: "223e4567-e89b-12d3-a456-426614174001",
      subtotal: 25.99,
      total: 25.99,
      status: "pending" as const,
      fulfillment_method: "collection" as const,
      billing_address_line1: "123 Main Street",
      billing_city: "London",
      billing_postcode: "SW1A 1AA",
    };

    it("should validate a correct order", () => {
      const result = insertOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it("should fail if user_id is invalid UUID", () => {
      const result = insertOrderSchema.safeParse({
        ...validOrder,
        user_id: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("should fail if total is negative", () => {
      const result = insertOrderSchema.safeParse({
        ...validOrder,
        total: -10,
      });
      expect(result.success).toBe(false);
    });

    it("should fail if status is invalid", () => {
      const result = insertOrderSchema.safeParse({
        ...validOrder,
        status: "invalid-status",
      });
      expect(result.success).toBe(false);
    });

    it("should allow valid fulfillment methods", () => {
      const deliveryResult = insertOrderSchema.safeParse({
        ...validOrder,
        fulfillment_method: "delivery",
        shipping_address_line1: "456 Delivery St",
        shipping_city: "Manchester",
        shipping_postcode: "M1 1AA",
      });
      const collectionResult = insertOrderSchema.safeParse({
        ...validOrder,
        fulfillment_method: "collection",
      });

      expect(deliveryResult.success).toBe(true);
      expect(collectionResult.success).toBe(true);
    });

    it("should allow optional bake_sale_id for collection", () => {
      const result = insertOrderSchema.safeParse({
        ...validOrder,
        fulfillment_method: "collection",
        bake_sale_id: "123e4567-e89b-12d3-a456-426614174000",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("insertOrderItemSchema", () => {
    const validItem = {
      order_id: "123e4567-e89b-12d3-a456-426614174000",
      product_id: "123e4567-e89b-12d3-a456-426614174001",
      quantity: 2,
      unit_price: 4.99,
      total_price: 9.98,
    };

    it("should validate a correct order item", () => {
      const result = insertOrderItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it("should fail if quantity is zero or negative", () => {
      const zeroResult = insertOrderItemSchema.safeParse({
        ...validItem,
        quantity: 0,
      });
      const negativeResult = insertOrderItemSchema.safeParse({
        ...validItem,
        quantity: -1,
      });

      expect(zeroResult.success).toBe(false);
      expect(negativeResult.success).toBe(false);
    });

    it("should fail if unit_price is negative", () => {
      const result = insertOrderItemSchema.safeParse({
        ...validItem,
        unit_price: -5,
      });
      expect(result.success).toBe(false);
    });

    it("should allow optional product_variant_id", () => {
      const result = insertOrderItemSchema.safeParse({
        ...validItem,
        product_variant_id: "123e4567-e89b-12d3-a456-426614174002",
      });
      expect(result.success).toBe(true);
    });
  });
});
