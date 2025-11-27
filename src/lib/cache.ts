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
 * Cached function to fetch images
 * Revalidates every hour or when 'images' tag is invalidated
 */
export const getCachedImages = unstable_cache(
  async (category?: string, tag?: string) => {
    const db = await getDb();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (db as any).select().from(images).orderBy(desc(images.created_at));

    if (category && category !== "all") {
      query = query.where(eq(images.category, category));
    }

    const allImages = (await query) as (typeof images.$inferSelect)[];

    // Filter by tag in memory if needed (since tags are JSON/array)
    // Note: If we had a proper many-to-many relation, we could filter in SQL.
    // For now, this matches the API logic.
    if (tag && tag !== "all") {
      return allImages.filter((img) => {
        const tags = Array.isArray(img.tags) ? img.tags : [];
        return tags.includes(tag);
      });
    }

    return allImages;
  },
  ["get-images"], // Key parts
  {
    revalidate: 3600, // 1 hour
    tags: [CACHE_TAGS.images],
  }
);
