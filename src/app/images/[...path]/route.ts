import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const objectKey = path.join("/"); // e.g., "avatars/user-123.jpg" or "categories/bread.jpg"

  try {
    const { env } = await getCloudflareContext();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r2 = (env as any).R2;

    if (!r2) {
      console.error("R2 binding not found");
      return new NextResponse("R2 binding not found", { status: 500 });
    }

    // Prefix with 'images/' if the key doesn't start with it,
    // BUT the route is /images/..., so the path param will NOT include 'images' if it's a dynamic segment under /images?
    // Wait, if file is src/app/images/[...path]/route.ts
    // URL: /images/avatars/user.jpg
    // params.path: ['avatars', 'user.jpg']
    // objectKey: "avatars/user.jpg"

    // Seed script uploads to "images/categories/..."
    // So in R2, the key is "images/categories/...".
    // So if I request /images/images/categories/..., that's weird.

    // Let's adjust.
    // If seed script uses "images/..." as root in R2.
    // And my route is /images/..., I should probably map /images/foo -> R2: images/foo.
    // So I need to prepend "images/" to the objectKey derived from params.

    const r2Key = `images/${objectKey}`;

    const object = await r2.get(r2Key);

    if (!object) {
      // Try without "images/" prefix just in case
      const objectFallback = await r2.get(objectKey);
      if (objectFallback) {
        const headers = new Headers();
        if (objectFallback.httpMetadata?.contentType) {
          headers.set("Content-Type", objectFallback.httpMetadata.contentType);
        }
        if (objectFallback.httpMetadata?.cacheControl) {
          headers.set("Cache-Control", objectFallback.httpMetadata.cacheControl);
        }
        headers.set("etag", objectFallback.httpEtag);

        // Convert stream to ArrayBuffer to avoid serialization issues in dev
        const body = await objectFallback.arrayBuffer();
        return new NextResponse(body, { headers });
      }

      return new NextResponse("Image not found", { status: 404 });
    }

    const headers = new Headers();
    if (object.httpMetadata?.contentType) {
      headers.set("Content-Type", object.httpMetadata.contentType);
    }
    if (object.httpMetadata?.cacheControl) {
      headers.set("Cache-Control", object.httpMetadata.cacheControl);
    }
    headers.set("etag", object.httpEtag);

    // Convert stream to ArrayBuffer to avoid serialization issues in dev
    const body = await object.arrayBuffer();
    return new NextResponse(body, { headers });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
