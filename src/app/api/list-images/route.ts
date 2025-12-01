import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { getCachedImages } from "@/lib/cache";
import { safeLog } from "@/lib/logger/safe-log";

export const dynamic = "force-dynamic";
export const runtime = "edge";

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
    const page = Number(searchParams.get("page") || 1);
    const offset = (page - 1) * limit;

    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Query DB (Cached)
    safeLog("info", "[API] list-images", { category, bucket, tag, limit, page });

    const result = await getCachedImages(
      category !== "all" ? category : undefined,
      tag !== "all" ? tag : undefined,
      limit,
      offset,
      bucket as "all" | "products" | "news" | "uncategorized"
    );

    safeLog("info", "[API] list-images result", {
      total: result.total,
      returning: result.images.length,
    });

    const imageUrls = result.images.map((img) => img.url);

    const response = NextResponse.json({
      images: imageUrls,
      data: result.images,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    });
    // Disable cache to fix duplicate issue
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    safeLog("error", "List images error", { error: (error as Error)?.message });
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
