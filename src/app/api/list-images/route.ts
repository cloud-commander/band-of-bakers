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
    const tag = searchParams.get("tag") || "all";

    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate params
    // (Optional: add zod validation here)

    // 3. Query DB (Cached)
    console.log(`[API] list-images: Fetching for category=${category}, tag=${tag}`);

    // Use the cached function
    const filteredImages = await getCachedImages(
      category !== "all" ? category : undefined,
      tag !== "all" ? tag : undefined
    );

    console.log(`[API] list-images: Found ${filteredImages.length} images`);

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
