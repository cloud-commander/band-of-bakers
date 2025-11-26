import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

/**
 * List images from R2
 * GET /api/list-images?category=breads
 */
export async function GET(request: Request) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

    // 3. Get R2 binding
    const { env } = await getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      return NextResponse.json({ error: "Storage not available" }, { status: 500 });
    }

    // 4. List images from R2
    const prefix = category === "all" ? "images/products/" : `images/products/${category}/`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listed = await (env as any).R2.list({ prefix, limit: 100 });

    // 5. Extract image URLs
    const images = listed.objects.map((obj: { key: string }) => `/${obj.key}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("List images error:", error);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}
