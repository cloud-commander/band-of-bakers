import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/db";
import { images } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Delete image from Cloudflare R2 and DB
 * DELETE /api/delete-image
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get image key from body
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Extract key from URL (remove leading slash)
    // URL: /images/products/cat-breads/sourdough.jpg -> Key: images/products/cat-breads/sourdough.jpg
    const key = url.startsWith("/") ? url.substring(1) : url;

    // 3. Delete from R2
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      return NextResponse.json({ error: "Storage not available" }, { status: 500 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.delete(key);

    // 4. Delete from DB
    const db = await getDb();
    await db.delete(images).where(eq(images.url, url));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
