"use server";

import { auth } from "@/auth";
import { userRepository } from "@/lib/repositories";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    size: (avatarFile as any)?.size,
  });

  console.log("updateProfile called with:", {
    userId,
    name,
    phone,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    avatarFileName: (avatarFile as any)?.name,
  });

  try {
    let avatarUrl: string | undefined = undefined;

    // Handle Avatar Upload to R2
    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      console.log("Entering avatar upload block...");
      const { env } = await getCloudflareContext({ async: true });
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

        avatarUrl = `/${fileName}`;
        console.log("Uploaded avatar to R2:", fileName);
        console.log("Setting avatarUrl:", avatarUrl);
      }
    }

    console.log("Updating user in DB with:", { name, phone, avatarUrl });

    // Update User in DB using repository pattern
    await userRepository.updateProfile(userId, {
      name,
      phone,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile" };
  }
}
