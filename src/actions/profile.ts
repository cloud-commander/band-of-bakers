"use server";

import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const userId = session.user.id;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const avatarFile = formData.get("avatar");

  console.log("Avatar debug:", {
    raw: avatarFile,
    type: typeof avatarFile,
    isInstanceFile: avatarFile instanceof File,
    constructor: avatarFile?.constructor?.name,
    size: (avatarFile as any)?.size,
  });

  console.log("updateProfile called with:", {
    userId,
    name,
    phone,
    avatarFileName: (avatarFile as any)?.name,
  });

  try {
    const db = await getDb();
    let avatarUrl = undefined;

    // Handle Avatar Upload to R2
    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      console.log("Entering avatar upload block...");
      const { env } = await getCloudflareContext();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r2 = (env as any).R2;

      console.log("R2 Binding present:", !!r2);

      if (!r2) {
        console.error("R2 binding is missing in environment");
        return { error: "Storage configuration error: R2 binding missing" };
      }

      if (r2) {
        const fileBuffer = await avatarFile.arrayBuffer();
        const fileName = `images/avatars/${userId}-${Date.now()}.${avatarFile.name
          .split(".")
          .pop()}`;

        await r2.put(fileName, fileBuffer, {
          httpMetadata: {
            contentType: avatarFile.type,
          },
        });

        // Store the URL path that matches our route handler: /images/avatars/...
        // The route handler is at /images/[...path], so we want /images/avatars/filename
        // But wait, the route handler prepends "images/".
        // If URL is /images/avatars/foo.jpg
        // Route params: avatars/foo.jpg
        // Route looks for: images/avatars/foo.jpg (Correct)

        // So the URL stored in DB should be /images/avatars/... (relative to domain root)
        // But wait, if I store /images/avatars/foo.jpg, Next.js Image will fetch it.
        // But the route handler is at /images.
        // So the URL should be /images/avatars/foo.jpg.
        // But wait, the file name I constructed includes "images/".
        // So fileName = "images/avatars/..."
        // So avatarUrl = "/" + fileName;

        avatarUrl = `/${fileName}`;
        console.log("Uploaded avatar to R2:", fileName);
        console.log("Setting avatarUrl:", avatarUrl);
      }
    }

    console.log("Updating user in DB with:", { name, phone, avatarUrl });

    // Update User in DB
    await db
      .update(users)
      .set({
        name,
        phone,
        ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}
