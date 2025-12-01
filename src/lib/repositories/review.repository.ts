import { BaseRepository } from "./base.repository";
import { reviews, users, type Review, type InsertReview } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export type ReviewWithUser = Review & {
  user_name: string;
  user_avatar: string | null;
  product_name?: string;
  product_image_url?: string | null;
  product_slug?: string;
};

export class ReviewRepository extends BaseRepository<typeof reviews> {
  constructor() {
    super(reviews);
  }

  /**
   * Find reviews by product ID
   */
  async findByProductId(productId: string, userId?: string): Promise<ReviewWithUser[]> {
    const db = await this.getDatabase();
    const { or } = await import("drizzle-orm");

    const whereClause = userId
      ? and(
          eq(reviews.product_id, productId),
          or(eq(reviews.status, "approved"), eq(reviews.user_id, userId))
        )
      : and(eq(reviews.product_id, productId), eq(reviews.status, "approved"));

    const results = await db
      .select({
        ...reviews,
        user_name: users.name,
        user_avatar: users.avatar_url,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.user_id, users.id))
      .where(whereClause)
      .orderBy(desc(reviews.created_at));

    return results as ReviewWithUser[];
  }

  /**
   * Find reviews by user ID
   */
  async findByUserId(userId: string): Promise<Review[]> {
    const db = await this.getDatabase();
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.user_id, userId))
      .orderBy(desc(reviews.created_at));
  }

  /**
   * Get average rating for a product
   */
  async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
    const db = await this.getDatabase();
    const result = await db
      .select({
        average: sql<number>`avg(${reviews.rating})`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(and(eq(reviews.product_id, productId), eq(reviews.status, "approved")));

    return {
      average: result[0]?.average || 0,
      count: result[0]?.count || 0,
    };
  }

  /**
   * Create a review
   */
  async create(data: InsertReview): Promise<Review> {
    const db = await this.getDatabase();
    const [newReview] = await db.insert(reviews).values(data).returning();
    return newReview;
  }

  /**
   * Find a review by user/product regardless of status (prevent duplicates)
   */
  async findByUserAndProduct(userId: string, productId: string): Promise<Review | null> {
    const db = await this.getDatabase();
    const [existing] = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.user_id, userId), eq(reviews.product_id, productId)))
      .limit(1);
    return existing ?? null;
  }
}

export const reviewRepository = new ReviewRepository();
