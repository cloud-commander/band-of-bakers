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
export async function getCachedImages(category?: string, tag?: string) {
  const categoryKey = category ?? "all";
  const tagKey = tag ?? "all";

  return unstable_cache(
    async () => {
      const db = await getDb();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (db as any).select().from(images).orderBy(desc(images.created_at));

      if (category && category !== "all") {
        query = query.where(eq(images.category, category));
      }

      const allImages = (await query) as (typeof images.$inferSelect)[];

      // Filter by tag in memory if needed (since tags are JSON/array)
      if (tag && tag !== "all") {
        return allImages.filter((img) => {
          const tags = Array.isArray(img.tags) ? img.tags : [];
          return tags.includes(tag);
        });
      }

      return allImages;
    },
    ["get-images", categoryKey, tagKey],
    {
      revalidate: 3600, // 1 hour
      tags: [CACHE_TAGS.images],
    }
  )();
}
