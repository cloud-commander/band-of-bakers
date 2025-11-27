import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { images } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

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

    // Find image by URL
    const image = await db.select().from(images).where(eq(images.url, url)).get();

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update image error:", error);
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 });
  }
}
