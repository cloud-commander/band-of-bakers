"use server";

import { reviewRepository, ReviewWithUser } from "@/lib/repositories/review.repository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { reviews, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

type OrderHelpers = { desc: typeof desc };

/**
 * Check admin role
 */
async function checkAdminRole() {
  const session = await auth();
  if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
    return false;
  }
  return true;
}

/**
 * Get all reviews (admin)
 */
export async function getAllReviews() {
  if (!(await checkAdminRole())) {
    throw new Error("Unauthorized");
  }
  const db = await getDb();
  return await db.query.reviews.findMany({
    orderBy: (reviews: typeof db.query.reviews.$inferSelect, { desc }: OrderHelpers) => [
      desc(reviews.created_at),
    ],
    with: {
      user: true, // Assuming relation exists, if not we rely on user_name in review
      product: true,
    },
  });
}

export async function getPaginatedReviews(page = 1, pageSize = 20) {
  if (!(await checkAdminRole())) {
    throw new Error("Unauthorized");
  }

  const limit = Math.max(1, Math.min(pageSize, 100));
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const db = await getDb();
  const data = await db.query.reviews.findMany({
    with: {
      user: true,
      product: true,
    },
    limit,
    offset,
    orderBy: (reviews: typeof db.query.reviews.$inferSelect, { desc }: OrderHelpers) => [
      desc(reviews.created_at),
    ],
  });

  const totalResult = await db.select({ count: sql<number>`count(*)` }).from(reviews);
  return { data, total: Number(totalResult[0]?.count || 0), page: currentPage, pageSize: limit };
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string) {
  return await reviewRepository.findByProductId(productId);
}

/**
 * Delete a review
 */
export async function deleteReview(id: string) {
  if (!(await checkAdminRole())) {
    throw new Error("Unauthorized");
  }
  await reviewRepository.delete(id);
  revalidatePath("/admin/reviews");
}

/**
 * Update review status
 */
export async function updateReviewStatus(id: string, status: "pending" | "approved" | "rejected") {
  if (!(await checkAdminRole())) {
    throw new Error("Unauthorized");
  }
  await reviewRepository.update(id, { status });
  revalidatePath("/admin/reviews");
}

/**
 * Get reviews by user ID
 */
export async function getUserReviews(userId: string): Promise<ReviewWithUser[]> {
  const db = await getDb();
  const { products } = await import("@/db/schema");
  const results = await db
    .select({
      ...reviews,
      user_name: users.name,
      user_avatar: users.avatar_url,
      product_name: products.name,
      product_image_url: products.image_url,
      product_slug: products.slug,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.user_id, users.id))
    .leftJoin(products, eq(reviews.product_id, products.id))
    .where(eq(reviews.user_id, userId))
    .orderBy(desc(reviews.created_at));

  return results as ReviewWithUser[];
}

/**
 * Get product ratings (average and count)
 */
export async function getProductRatings(): Promise<
  Record<string, { average: number; count: number }>
> {
  const db = await getDb();
  const allReviews = await db
    .select({
      productId: reviews.product_id,
      rating: reviews.rating,
    })
    .from(reviews)
    .where(eq(reviews.status, "approved"));

  const ratings: Record<string, { total: number; count: number }> = {};

  allReviews.forEach((r: { productId: string; rating: number }) => {
    if (!ratings[r.productId]) {
      ratings[r.productId] = { total: 0, count: 0 };
    }
    ratings[r.productId].total += r.rating;
    ratings[r.productId].count += 1;
  });

  const result: Record<string, { average: number; count: number }> = {};
  Object.keys(ratings).forEach((productId) => {
    result[productId] = {
      average: ratings[productId].total / ratings[productId].count,
      count: ratings[productId].count,
    };
  });

  return result;
}
