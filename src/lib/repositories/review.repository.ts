import { BaseRepository } from "./base.repository";
import { reviews, users, type Review, type InsertReview } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export type ReviewWithUser = Review & {
  user_name: string;
  user_avatar: string | null;
};

export class ReviewRepository extends BaseRepository<typeof reviews> {
  constructor() {
    super(reviews);
  }

  /**
   * Find reviews by product ID
   */
  async findByProductId(productId: string): Promise<ReviewWithUser[]> {
    const db = await this.getDatabase();
    const results = await db
      .select({
        ...reviews,
        user_name: users.name,
        user_avatar: users.avatar_url,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.user_id, users.id))
      .where(and(eq(reviews.product_id, productId), eq(reviews.status, "approved")))
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
}

export const reviewRepository = new ReviewRepository();
