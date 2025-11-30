import { products, productVariants } from "@/db/schema";
import { BaseRepository } from "./base.repository";
import { eq, and, sql, like, gte, isNotNull, desc } from "drizzle-orm";

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
   * Find products by IDs in a single query.
   */
  async findByIds(ids: string[]) {
    if (ids.length === 0) return [];
    const { inArray } = await import("drizzle-orm");
    const db = await this.getDatabase();
    return await db.select().from(products).where(inArray(products.id, ids));
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
   * Paginated products with optional active filter.
   */
  async findPaginated(limit: number, offset: number, onlyActive = false) {
    const db = await this.getDatabase();
    const whereClause = onlyActive ? eq(products.is_active, true) : undefined;

    const data = await db.query.products.findMany({
      limit,
      offset,
      where: whereClause,
      orderBy: desc(products.created_at),
    });

    const totalResult = whereClause
      ? await db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause)
      : await db.select({ count: sql<number>`count(*)` }).from(products);

    return { data, total: Number(totalResult[0]?.count || 0) };
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

    try {
      // Create product
      const [newProduct] = await db.insert(products).values(product).returning();

      // Create variants if provided
      if (variants.length > 0) {
        const variantsWithProductId = variants.map((v, index) => ({
          ...v,
          id: v.id || `var-${Date.now()}-${index}`,
          product_id: newProduct.id,
        }));

        await db.insert(productVariants).values(variantsWithProductId);
      }

      return newProduct;
    } catch (error) {
      console.error("Error creating product with variants:", error);
      throw error;
    }
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
   * Get active variants for many products, returned as a map keyed by product_id.
   */
  async getActiveVariantsForProducts(productIds: string[]) {
    if (productIds.length === 0) return new Map<string, ProductVariant[]>();
    const db = await this.getDatabase();
    const { inArray } = await import("drizzle-orm");
    const rows = await db
      .select()
      .from(productVariants)
      .where(and(inArray(productVariants.product_id, productIds), eq(productVariants.is_active, true)));

    const map = new Map<string, ProductVariant[]>();
    for (const row of rows) {
      const list = map.get(row.product_id) || [];
      list.push(row);
      map.set(row.product_id, list);
    }
    return map;
  }

  /**
   * Decrement product stock by a quantity if stock is tracked and sufficient.
   * Returns the updated product row or null if the update was not applied.
   */
  async decrementStock(productId: string, quantity: number): Promise<Product | null> {
    const db = await this.getDatabase();
    const [updated] = await db
      .update(products)
      .set({
        stock_quantity: sql`${products.stock_quantity} - ${quantity}`,
        updated_at: new Date().toISOString(),
      })
      .where(
        and(
          eq(products.id, productId),
          isNotNull(products.stock_quantity),
          gte(products.stock_quantity, quantity)
        )
      )
      .returning();

    return updated || null;
  }

  /**
   * Increment product stock by a quantity. Intended for rollback scenarios.
   */
  async incrementStock(productId: string, quantity: number): Promise<Product | null> {
    const db = await this.getDatabase();
    const [updated] = await db
      .update(products)
      .set({
        stock_quantity: sql`${products.stock_quantity} + ${quantity}`,
        updated_at: new Date().toISOString(),
      })
      .where(and(eq(products.id, productId), isNotNull(products.stock_quantity)))
      .returning();

    return updated || null;
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
    return await db
      .select()
      .from(products)
      .where(like(products.name, `%${searchTerm}%`));
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

    try {
      // 1. Update product
      const [updatedProduct] = await db
        .update(products)
        .set({ ...productUpdates, updated_at: new Date().toISOString() })
        .where(eq(products.id, productId))
        .returning();

      if (!updatedProduct) return null;

      // 2. Delete removed variants
      if (variants.delete.length > 0) {
        const { inArray } = await import("drizzle-orm");
        await db.delete(productVariants).where(inArray(productVariants.id, variants.delete));
      }

      // 3. Create new variants
      if (variants.create.length > 0) {
        const variantsWithProductId = variants.create.map((v) => ({
          ...v,
          product_id: productId,
        }));
        await db.insert(productVariants).values(variantsWithProductId);
      }

      // 4. Update existing variants
      for (const variant of variants.update) {
        const { id, ...updates } = variant;
        await db
          .update(productVariants)
          .set({ ...updates, updated_at: new Date().toISOString() })
          .where(eq(productVariants.id, id));
      }

      return updatedProduct;
    } catch (error) {
      console.error("Error updating product with variants:", error);
      throw error;
    }
  }
}

export const productRepository = new ProductRepository();
