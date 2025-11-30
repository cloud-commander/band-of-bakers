import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import { images } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Cache tags for invalidation
 */
export const CACHE_TAGS = {
  images: "images",
  products: "products",
  orders: "orders",
  news: "news",
};

/**
 * Cached fetch for images; cache key includes category/tag so filters work.
 * Revalidates every hour or when 'images' tag is invalidated.
 */
export async function getCachedImages(category?: string, tag?: string, limit = 50) {
  const categoryKey = category ?? "all";
  const tagKey = tag ?? "all";
  const limited = Math.max(1, Math.min(limit, 500));

  return unstable_cache(
    async () => {
      const db = await getDb();

      // Build where conditions
      const whereClauses = [];
      if (category && category !== "all") {
        whereClauses.push(eq(images.category, category));
      }

      // Apply tag filtering in SQL for JSON/array tags using json_each
      const tagFiltered =
        tag && tag !== "all"
          ? db
              .select()
              .from(images)
              .where(
                whereClauses.length
                  ? and(
                      ...whereClauses,
                      sql`EXISTS (SELECT 1 FROM json_each(${images.tags}) WHERE json_each.value = ${tag})`
                    )
                  : sql`EXISTS (SELECT 1 FROM json_each(${images.tags}) WHERE json_each.value = ${tag})`
              )
              .orderBy(desc(images.created_at))
              .limit(limited)
          : db
              .select()
              .from(images)
              .where(whereClauses.length ? and(...whereClauses) : undefined)
              .orderBy(desc(images.created_at))
              .limit(limited);

      const allImages = (await tagFiltered) as (typeof images.$inferSelect)[];

      return allImages;
    },
    ["get-images", categoryKey, tagKey, String(limited)],
    {
      revalidate: 3600, // 1 hour
      tags: [CACHE_TAGS.images],
    }
  )();
}
