import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const objectKey = path.join("/");

  try {
    console.time("getCloudflareContext");
    const { env } = await getCloudflareContext({ async: true });
    console.timeEnd("getCloudflareContext");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r2 = (env as any).R2;

    if (!r2) {
      console.error("R2 binding not found");
      return new NextResponse("R2 binding not found", { status: 500 });
    }

    // Try with "images/" prefix first as that's the standard structure
    let r2Key = `images/${objectKey}`;
    console.time("r2.get");
    let object = await r2.get(r2Key);
    console.timeEnd("r2.get");

    // Fallback for legacy paths without prefix
    if (!object) {
      r2Key = objectKey;
      console.time("r2.get-fallback");
      object = await r2.get(r2Key);
      console.timeEnd("r2.get-fallback");
    }

    if (!object) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const headers = new Headers();

    // Manually set headers instead of using writeHttpMetadata to avoid serialization issues
    if (object.httpMetadata?.contentType) {
      headers.set("Content-Type", object.httpMetadata.contentType);
    }
    if (object.httpMetadata?.contentEncoding) {
      headers.set("Content-Encoding", object.httpMetadata.contentEncoding);
    }
    if (object.httpMetadata?.contentLanguage) {
      headers.set("Content-Language", object.httpMetadata.contentLanguage);
    }
    if (object.httpMetadata?.cacheControl) {
      headers.set("Cache-Control", object.httpMetadata.cacheControl);
    } else {
      // Force aggressive caching for images if not set
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    headers.set("etag", object.httpEtag);

    // In development, Miniflare/Next.js has issues serializing the R2 ReadableStream
    // So we fallback to ArrayBuffer in dev, but use streaming in production for performance
    if (process.env.NODE_ENV === "development") {
      console.time("arrayBuffer");
      const body = await object.arrayBuffer();
      console.timeEnd("arrayBuffer");
      return new NextResponse(body, { headers });
    }

    return new NextResponse(object.body, { headers });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
