"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getDb } from "@/lib/db";
import { userRepository } from "@/lib/repositories/user.repository";
import { auth } from "@/auth";

/**
 * Upload avatar to R2
 */
async function uploadAvatarToR2(file: File): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      console.error("R2 binding not available");
      return null;
    }

    const fileName = `images/avatars/${Date.now()}-${file.name}`;
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
 * Delete avatar from R2
 */
async function deleteAvatarFromR2(imageUrl: string): Promise<void> {
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

export async function updateUser(
  userId: string,
  data: {
    name: string;
    phone?: string;
    role: "customer" | "staff" | "manager" | "owner";
    avatar?: File | string | null; // File for new upload, string for existing URL, null for removal
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    let avatarUrl = existingUser.avatar_url;

    // Handle avatar update
    if (data.avatar instanceof File) {
      // Upload new avatar
      const newAvatarUrl = await uploadAvatarToR2(data.avatar);
      if (newAvatarUrl) {
        // Delete old avatar if it exists and is an R2 image
        if (existingUser.avatar_url && existingUser.avatar_url.startsWith("/images/avatars/")) {
          await deleteAvatarFromR2(existingUser.avatar_url);
        }
        avatarUrl = newAvatarUrl;
      }
    } else if (data.avatar === null) {
      // Remove avatar
      if (existingUser.avatar_url && existingUser.avatar_url.startsWith("/images/avatars/")) {
        await deleteAvatarFromR2(existingUser.avatar_url);
      }
      avatarUrl = null;
    }
    // If data.avatar is a string, it means keep existing (or it's an external URL we don't manage)

    await db
      .update(users)
      .set({
        name: data.name,
        phone: data.phone || null,
        role: data.role,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function getUsers() {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await userRepository.findAll();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getUserById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await userRepository.findById(id);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return null;
  }
}

export async function getPaginatedUsers(
  page = 1,
  pageSize = 20,
  filters?: {
    search?: string;
    role?: string;
    is_banned?: boolean;
  }
) {
  const limit = Math.max(1, Math.min(pageSize, 100));
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const result = await userRepository.findPaginated(limit, offset, filters);
  return {
    users: result.data,
    total: result.total,
    page: currentPage,
    pageSize: limit,
  };
}
