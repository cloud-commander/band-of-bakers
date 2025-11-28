import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getCachedImages } from "@/lib/cache";

export const runtime = "nodejs";

/**
 * List images from DB with filtering
 * GET /api/list-images?category=...&tag=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const bucket = searchParams.get("bucket") || "all"; // buckets: all | products | news | uncategorized
    const tag = searchParams.get("tag") || "all";
    const limitParam = Number(searchParams.get("limit") || 50);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 50;

    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate params
    // (Optional: add zod validation here)

    // 3. Query DB (Cached)
    console.log(
      `[API] list-images: Fetching for category=${category}, bucket=${bucket}, tag=${tag}`
    );

    // Base fetch (cached) then bucket-filter locally
    const filteredImages = await getCachedImages(
      category !== "all" ? category : undefined,
      tag !== "all" ? tag : undefined
    );

    const bucketFiltered = filteredImages.filter((img) => {
      const cat = img.category || "";
      if (bucket === "news") return cat === "news";
      if (bucket === "products") {
        const matchesCategory = category !== "all" ? cat === category : cat.trim().length > 0;
        return cat !== "news" && matchesCategory;
      }
      if (bucket === "uncategorized") return cat.trim().length === 0;
      return true; // all
    });

    const limited = bucketFiltered.slice(0, limit);

    console.log(
      `[API] list-images: Found ${bucketFiltered.length} images after bucket filter (returning ${limited.length})`
    );

    const imageUrls = limited.map((img) => img.url);

    return NextResponse.json({
      images: imageUrls,
      data: limited, // Include full data for new components
      total: bucketFiltered.length,
    });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
