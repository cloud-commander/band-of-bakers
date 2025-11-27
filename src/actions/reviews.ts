"use server";

import { reviewRepository, ReviewWithUser } from "@/lib/repositories/review.repository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { reviews, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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
    orderBy: (reviews, { desc }) => [desc(reviews.created_at)],
    with: {
      user: true, // Assuming relation exists, if not we rely on user_name in review
      product: true,
    },
  });
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
  const results = await db
    .select({
      ...reviews,
      user_name: users.name,
      user_avatar: users.avatar_url,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.user_id, users.id))
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

  allReviews.forEach((r) => {
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
