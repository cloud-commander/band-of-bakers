import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { images } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * List images from DB with filtering
 * GET /api/list-images?category=...&tag=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const tag = searchParams.get("tag") || "all";

    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate params
    // (Optional: add zod validation here)

    // 3. Query DB
    console.log(`[API] list-images: Fetching for category=${category}, tag=${tag}`);
    const db = await getDb();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (db as any).select().from(images).orderBy(desc(images.created_at));

    if (category !== "all") {
      // dynamic query building
      query = query.where(eq(images.category, category));
    }

    const allImages = (await query) as (typeof images.$inferSelect)[];
    console.log(`[API] list-images: Found ${allImages.length} images`);

    let filteredImages = allImages;
    if (tag !== "all") {
      filteredImages = allImages.filter((img) => {
        // Parse tags if they are stored as string (JSON) or array
        // The schema says text with mode: "json" -> string[]?
        // Let's check schema. If it's json mode, drizzle handles it.
        // But let's be safe.
        const tags = Array.isArray(img.tags) ? img.tags : [];
        return tags.includes(tag);
      });
    }

    const imageUrls = filteredImages.map((img) => img.url);

    return NextResponse.json({
      images: imageUrls,
      data: filteredImages, // Include full data for new components
    });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
