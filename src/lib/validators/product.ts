import { z } from "zod";

// ============================================================================
// PRODUCT CATEGORY SCHEMAS
// ============================================================================

export const productCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Category name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertProductCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().nullable().optional(),
  sort_order: z.number().int().default(0),
});

export const updateProductCategorySchema = insertProductCategorySchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productSchema = z.object({
  id: z.string().uuid(),
  category_id: z.string().uuid(),
  name: z.string().min(1, "Product name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().nullable().optional(),
  base_price: z.number().positive("Price must be positive"),
  image_url: z.string().url().nullable().optional(),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertProductSchema = z.object({
  category_id: z.string().uuid(),
  name: z.string().min(1, "Product name is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().nullable().optional(),
  base_price: z.number().positive("Price must be positive"),
  image_url: z.string().url().nullable().optional(),
  is_active: z.boolean().default(true),
});

export const updateProductSchema = insertProductSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// PRODUCT VARIANT SCHEMAS
// ============================================================================

export const productVariantSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  name: z.string().min(1, "Variant name is required"),
  price_adjustment: z.number().default(0),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertProductVariantSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(1, "Variant name is required"),
  price_adjustment: z.number().default(0),
  sort_order: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const updateProductVariantSchema = insertProductVariantSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  });

// ============================================================================
// COMBINED PRODUCT WITH VARIANTS
// ============================================================================

export const productWithVariantsSchema = productSchema.extend({
  variants: z.array(productVariantSchema),
});

export const productWithCategorySchema = productSchema.extend({
  category: productCategorySchema,
});

// Type exports
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;
export type UpdateProductCategory = z.infer<typeof updateProductCategorySchema>;

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

export type ProductVariant = z.infer<typeof productVariantSchema>;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type UpdateProductVariant = z.infer<typeof updateProductVariantSchema>;

export type ProductWithVariants = z.infer<typeof productWithVariantsSchema>;
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>;
