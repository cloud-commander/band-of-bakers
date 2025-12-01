import { getDb } from "@/lib/db";
import { images } from "@/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";

/**
 * Cache tags for invalidation
 */
export const CACHE_TAGS = {
  images: "images",
  products: "products",
  orders: "orders",
  news: "news",
  dashboard: "dashboard",
  menu: "menu",
  categories: "categories",
  bakeSales: "bakeSales",
  testimonials: "testimonials",
  faqs: "faqs",
} as const;

/**
 * Cached fetch for images; cache key includes category/tag so filters work.
 * Revalidates every hour or when 'images' tag is invalidated.
 */
/**
 * Cached fetch for images with pagination and filtering.
 * Revalidates every hour or when 'images' tag is invalidated.
 */
export async function getCachedImages(
  category?: string,
  tag?: string,
  limit = 50,
  offset = 0,
  bucket: "all" | "products" | "news" | "uncategorized" = "all"
) {
  const limited = Math.max(1, Math.min(limit, 500));
  const offsetVal = Math.max(0, offset);

  const start = performance.now();
  const db = await getDb();

  // Build where conditions
  const whereClauses = [];

  // Category filter
  if (category && category !== "all") {
    whereClauses.push(eq(images.category, category));
  }

  // Bucket filtering logic
  if (bucket === "news") {
    whereClauses.push(eq(images.category, "news"));
  } else if (bucket === "products") {
    // Products are anything NOT news and NOT empty/null
    whereClauses.push(
      and(
        sql`${images.category} != 'news'`,
        sql`${images.category} IS NOT NULL`,
        sql`${images.category} != ''`
      )
    );
  } else if (bucket === "uncategorized") {
    // Uncategorized are empty or null
    whereClauses.push(sql`(${images.category} IS NULL OR ${images.category} = '')`);
  }

  // Tag filtering
  if (tag && tag !== "all") {
    whereClauses.push(
      sql`EXISTS (SELECT 1 FROM json_each(${images.tags}) WHERE json_each.value = ${tag})`
    );
  }

  const whereSql = whereClauses.length ? and(...whereClauses) : undefined;

  // Get data
  const dataQuery = db
    .select()
    .from(images)
    .where(whereSql)
    .orderBy(desc(images.created_at), desc(images.id))
    .limit(limited)
    .offset(offsetVal);

  // Get total count
  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(images)
    .where(whereSql);

  const [data, countResult] = await Promise.all([dataQuery, countQuery]);

  const end = performance.now();
  console.log(`[getCachedImages] Query took ${(end - start).toFixed(2)}ms`);

  return {
    images: data as (typeof images.$inferSelect)[],
    total: Number(countResult[0]?.count || 0),
  };
}
