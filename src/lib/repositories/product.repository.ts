import { products, productVariants } from "@/db/schema";
import { BaseRepository } from "./base.repository";
import { eq, and, sql } from "drizzle-orm";

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

/**
 * Product Repository
 * Handles all product-related database operations
 */
export class ProductRepository extends BaseRepository<typeof products> {
  constructor() {
    super(products);
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string): Promise<Product | null> {
    const db = await this.getDatabase();
    const results = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return results[0] || null;
  }

  /**
   * Find products by category ID
   */
  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const db = await this.getDatabase();
    return await db.select().from(products).where(eq(products.category_id, categoryId));
  }

  /**
   * Find active products only
   */
  async findActiveProducts(): Promise<Product[]> {
    const db = await this.getDatabase();
    return await db.select().from(products).where(eq(products.is_active, true));
  }

  /**
   * Find active products by category
   */
  async findActiveByCategoryId(categoryId: string): Promise<Product[]> {
    const db = await this.getDatabase();
    return await db
      .select()
      .from(products)
      .where(and(eq(products.category_id, categoryId), eq(products.is_active, true)));
  }

  /**
   * Create product with variants
   */
  async createWithVariants(
    product: InsertProduct,
    variants: InsertProductVariant[]
  ): Promise<Product> {
    const db = await this.getDatabase();

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx: typeof db) => {
      // Create product
      const [newProduct] = await tx.insert(products).values(product).returning();

      // Create variants if provided
      if (variants.length > 0) {
        const variantsWithProductId = variants.map((v) => ({
          ...v,
          product_id: newProduct.id,
        }));

        await tx.insert(productVariants).values(variantsWithProductId);
      }

      return newProduct;
    });

    return result;
  }

  /**
   * Get product variants
   */
  async getVariants(productId: string): Promise<ProductVariant[]> {
    const db = await this.getDatabase();
    return await db.select().from(productVariants).where(eq(productVariants.product_id, productId));
  }

  /**
   * Get active product variants
   */
  async getActiveVariants(productId: string): Promise<ProductVariant[]> {
    const db = await this.getDatabase();
    return await db
      .select()
      .from(productVariants)
      .where(and(eq(productVariants.product_id, productId), eq(productVariants.is_active, true)));
  }

  /**
   * Toggle product active status
   */
  async toggleActive(productId: string): Promise<Product | null> {
    const db = await this.getDatabase();

    // Get current product
    const product = await this.findById(productId);
    if (!product) return null;

    // Toggle is_active
    const results = await db
      .update(products)
      .set({
        is_active: !product.is_active,
        updated_at: new Date().toISOString(),
      })
      .where(eq(products.id, productId))
      .returning();

    return results[0] || null;
  }

  /**
   * Search products by name
   */
  async searchByName(searchTerm: string): Promise<Product[]> {
    const db = await this.getDatabase();
    const allProducts = await db.select().from(products);

    // Simple case-insensitive search
    return allProducts.filter((p: Product) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Count active products
   */
  async countActive() {
    const db = await this.getDatabase();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(eq(products.is_active, true));
    return Number(result[0]?.count || 0);
  }
  /**
   * Update product with variants
   */
  async updateWithVariants(
    productId: string,
    productUpdates: Partial<InsertProduct>,
    variants: {
      create: InsertProductVariant[];
      update: (Partial<InsertProductVariant> & { id: string })[];
      delete: string[];
    }
  ): Promise<Product | null> {
    const db = await this.getDatabase();

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx: typeof db) => {
      // 1. Update product
      const [updatedProduct] = await tx
        .update(products)
        .set({ ...productUpdates, updated_at: new Date().toISOString() })
        .where(eq(products.id, productId))
        .returning();

      if (!updatedProduct) return null;

      // 2. Delete removed variants
      if (variants.delete.length > 0) {
        // SQLite doesn't support WHERE IN with multiple values nicely in all drivers,
        // but Drizzle handles it.
        // However, for safety and simplicity with D1, we'll iterate or use a specialized query if needed.
        // Drizzle's `inArray` is the standard way.
        const { inArray } = await import("drizzle-orm");
        await tx.delete(productVariants).where(inArray(productVariants.id, variants.delete));
      }

      // 3. Create new variants
      if (variants.create.length > 0) {
        const variantsWithProductId = variants.create.map((v) => ({
          ...v,
          product_id: productId,
        }));
        await tx.insert(productVariants).values(variantsWithProductId);
      }

      // 4. Update existing variants
      for (const variant of variants.update) {
        const { id, ...updates } = variant;
        await tx
          .update(productVariants)
          .set({ ...updates, updated_at: new Date().toISOString() })
          .where(eq(productVariants.id, id));
      }

      return updatedProduct;
    });

    return result;
  }
}

export const productRepository = new ProductRepository();
