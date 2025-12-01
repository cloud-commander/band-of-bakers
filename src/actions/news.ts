"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";
import { requireCsrf, CsrfError } from "@/lib/csrf";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

// Validation schema
const newsPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  summary: z.string().min(1, "Summary is required").max(300),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().min(1, "Publish date is required"),
  imageUrl: z.string().optional(),
});

/**
 * Check admin role
 */
async function checkAdminRole() {
  const session = await auth();
  if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
    return false;
  }
  return session.user.id;
}

/**
 * Upload image to R2
 */
async function uploadImageToR2(file: File): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      console.error("R2 binding not available");
      return null;
    }

    const fileName = `images/news/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return `/${fileName}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    return null;
  }
}

/**
 * Delete image from R2
 */
async function deleteImageFromR2(imageUrl: string): Promise<void> {
  try {
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      console.error("R2 binding not available");
      return;
    }

    // Extract R2 key from URL (remove leading slash)
    const r2Key = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.delete(r2Key);
  } catch (error) {
    console.error("R2 delete error:", error);
  }
}

/**
 * Get all news posts (admin only)
 */
export async function getNewsPosts() {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const { newsRepository } = await import("@/lib/repositories/news.repository");
    return await newsRepository.findAll();
  } catch (error) {
    console.error("Failed to fetch news posts:", error);
    return [];
  }
}

/**
 * Get published news posts (public)
 */
export async function getPublishedNewsPosts() {
  try {
    const { newsRepository } = await import("@/lib/repositories/news.repository");
    return await newsRepository.findPublished();
  } catch (error) {
    console.error("Failed to fetch published news posts:", error);
    return [];
  }
}

/**
 * Get recent published news posts (public)
 */
export async function getRecentNewsPosts(limit: number = 3) {
  try {
    const { newsRepository } = await import("@/lib/repositories/news.repository");
    const posts = await newsRepository.findPublished();
    return posts.slice(0, limit);
  } catch (error) {
    console.error("Failed to fetch recent news posts:", error);
    return [];
  }
}

/**
 * Create a new news post
 */
export async function createNewsPost(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      await requireCsrf();
    } catch (e) {
      if (e instanceof CsrfError) {
        return { success: false, error: "Request blocked. Please refresh and try again." };
      }
      throw e;
    }

    const rawData = {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      status: formData.get("status") as string,
      publishedAt: formData.get("publishedAt") as string,
      imageUrl: (formData.get("image_url") as string) || undefined,
    };

    const validated = newsPostSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    let imageUrl = validated.data.imageUrl;

    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImageToR2(imageFile);
      if (!uploadedUrl) {
        return { success: false, error: "Failed to upload image" };
      }
      imageUrl = uploadedUrl;
    }

    // Generate slug from title
    const slug =
      validated.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      nanoid(6);

    const { newsRepository } = await import("@/lib/repositories/news.repository");
    const post = await newsRepository.create({
      id: nanoid(),
      title: validated.data.title,
      slug,
      content: validated.data.content,
      excerpt: validated.data.summary,
      author_id: userId,
      is_published: validated.data.status === "published",
      published_at: validated.data.publishedAt,
      image_url: imageUrl,
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true, data: { id: post.id } };
  } catch (error) {
    console.error("Create news post error:", error);
    return { success: false, error: "Failed to create news post" };
  }
}

/**
 * Toggle news post publish status
 */
export async function toggleNewsPostStatus(
  id: string,
  isPublished: boolean
): Promise<ActionResult<void>> {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      await requireCsrf();
    } catch (e) {
      if (e instanceof CsrfError) {
        return { success: false, error: "Request blocked. Please refresh and try again." };
      }
      throw e;
    }

    const { newsRepository } = await import("@/lib/repositories/news.repository");
    await newsRepository.update(id, {
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Toggle news post status error:", error);
    return { success: false, error: "Failed to update news post status" };
  }
}

/**
 * Delete a news post
 */
export async function deleteNewsPost(id: string): Promise<ActionResult<void>> {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      await requireCsrf();
    } catch (e) {
      if (e instanceof CsrfError) {
        return { success: false, error: "Request blocked. Please refresh and try again." };
      }
      throw e;
    }

    const { newsRepository } = await import("@/lib/repositories/news.repository");
    const post = await newsRepository.findById(id);

    if (post?.image_url) {
      await deleteImageFromR2(post.image_url);
    }

    await newsRepository.delete(id);

    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete news post error:", error);
    return { success: false, error: "Failed to delete news post" };
  }
}

/**
 * Get a single news post by ID
 */
export async function getNewsPostById(id: string) {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const { newsRepository } = await import("@/lib/repositories/news.repository");
    return await newsRepository.findById(id);
  } catch (error) {
    console.error("Failed to fetch news post:", error);
    return null;
  }
}

/**
 * Update a news post
 */
export async function updateNewsPost(
  id: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await checkAdminRole();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    try {
      await requireCsrf();
    } catch (e) {
      if (e instanceof CsrfError) {
        return { success: false, error: "Request blocked. Please refresh and try again." };
      }
      throw e;
    }

    const rawData = {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      status: formData.get("status") as string,
      publishedAt: formData.get("publishedAt") as string,
      imageUrl: (formData.get("image_url") as string) || undefined,
    };

    const validated = newsPostSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const { newsRepository } = await import("@/lib/repositories/news.repository");
    const existingPost = await newsRepository.findById(id);

    if (!existingPost) {
      return { success: false, error: "News post not found" };
    }

    // Handle image upload
    const imageFile = formData.get("image") as File | null;
    let imageUrl = existingPost.image_url;

    // If a new file is uploaded
    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingPost.image_url) {
        await deleteImageFromR2(existingPost.image_url);
      }
      const uploadedUrl = await uploadImageToR2(imageFile);
      if (!uploadedUrl) {
        return { success: false, error: "Failed to upload image" };
      }
      imageUrl = uploadedUrl;
    } else if (validated.data.imageUrl !== undefined) {
      // If image_url is explicitly provided (e.g. from gallery selection)
      // If it's different from existing, update it
      // Note: if validated.data.imageUrl is empty string, it means remove image?
      // Or just changed to another image.
      imageUrl = validated.data.imageUrl;
    }

    // Generate slug from title
    const slug =
      validated.data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      nanoid(6);

    await newsRepository.update(id, {
      title: validated.data.title,
      slug,
      content: validated.data.content,
      excerpt: validated.data.summary,
      is_published: validated.data.status === "published",
      published_at: validated.data.publishedAt,
      image_url: imageUrl,
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");

    return { success: true, data: { id } };
  } catch (error) {
    console.error("Update news post error:", error);
    return { success: false, error: "Failed to update news post" };
  }
}
