import { productCategories } from "@/db/schema";
import { BaseRepository } from "./base.repository";
import { eq } from "drizzle-orm";

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

/**
 * Category Repository
 * Handles all category-related database operations
 */
export class CategoryRepository extends BaseRepository<typeof productCategories> {
  constructor() {
    super(productCategories);
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<ProductCategory | null> {
    const db = await this.getDatabase();
    const results = await db
      .select()
      .from(productCategories)
      .where(eq(productCategories.slug, slug))
      .limit(1);
    return results[0] || null;
  }

  /**
   * Get all categories sorted by sort_order
   */
  async findAllSorted(): Promise<ProductCategory[]> {
    const db = await this.getDatabase();
    // Assuming sort_order is available and we want to sort by it.
    // Drizzle sort syntax: .orderBy(productCategories.sort_order)
    return await db.select().from(productCategories).orderBy(productCategories.sort_order);
  }
}

export const categoryRepository = new CategoryRepository();
