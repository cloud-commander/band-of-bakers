import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { images } from "@/db/schema";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";

export const runtime = "edge";

/**
 * Upload image to Cloudflare R2 and save metadata to DB
 * POST /api/upload-image
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get form data
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const category = formData.get("category") as string | null;
    const tagsRaw = formData.get("tags") as string | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // 3. Validate file
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 5MB)" }, { status: 400 });
    }

    // 4. Upload to R2
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      return NextResponse.json({ error: "Storage not available" }, { status: 500 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const folder = category ? `images/products/${category}` : "images/products";
    const fileName = `${folder}/${timestamp}-${sanitizedName}`;

    // Upload to R2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.put(fileName, await imageFile.arrayBuffer(), {
      httpMetadata: {
        contentType: imageFile.type,
      },
    });

    // Return URL
    const imageUrl = `/${fileName}`;

    // 5. Insert into DB
    const db = await getDb();
    let tags: string[] = [];
    if (tagsRaw) {
      try {
        tags = JSON.parse(tagsRaw);
      } catch {
        // Fallback for comma separated
        tags = tagsRaw.split(",").map((t) => t.trim());
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db as any).insert(images).values({
      id: nanoid(),
      url: imageUrl,
      filename: sanitizedName,
      category: category || null,
      tags: tags,
      size: imageFile.size,
      uploaded_by: session.user.id,
    });

    return NextResponse.json({
      success: true,
      url: imageUrl,
      fileName: sanitizedName,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
