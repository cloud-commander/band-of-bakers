import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { images } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Update image metadata
 * PATCH /api/update-image
 */
export async function PATCH(request: Request) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get data
    const body = await request.json();
    const { url, category, tags } = body;

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // 3. Update DB
    const db = await getDb();
    const image = await db.query.images.findFirst({
      where: eq(images.url, url),
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await db
      .update(images)
      .set({
        category: category !== undefined ? category : image.category,
        tags: tags !== undefined ? tags : image.tags,
        updated_at: new Date().toISOString(), // Manual update for now as trigger might not work in D1 same way
      })
      .where(eq(images.id, image.id));

    // Invalidate cached image lists
    revalidateTag(CACHE_TAGS.images);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}
