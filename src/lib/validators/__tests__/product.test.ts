import { describe, it, expect } from "vitest";
import { insertProductSchema } from "../product";

describe("insertProductSchema", () => {
  const validProduct = {
    category_id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Sourdough Loaf",
    slug: "sourdough-loaf",
    base_price: 4.5,
    is_active: true,
  };

  it("should validate a correct product", () => {
    const result = insertProductSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should fail if name is empty", () => {
    const result = insertProductSchema.safeParse({ ...validProduct, name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Product name is required");
    }
  });

  it("should fail if slug format is invalid", () => {
    const result = insertProductSchema.safeParse({ ...validProduct, slug: "Invalid Slug" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid slug format");
    }
  });

  it("should fail if price is negative", () => {
    const result = insertProductSchema.safeParse({ ...validProduct, base_price: -10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Price must be positive");
    }
  });

  it("should fail if category_id is not a UUID", () => {
    const result = insertProductSchema.safeParse({ ...validProduct, category_id: "invalid-id" });
    expect(result.success).toBe(false);
  });

  it("should allow optional fields to be missing", () => {
    const result = insertProductSchema.safeParse({
      category_id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Simple Product",
      slug: "simple-product",
      base_price: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should validate image_url format", () => {
    const result = insertProductSchema.safeParse({
      ...validProduct,
      image_url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });
});
