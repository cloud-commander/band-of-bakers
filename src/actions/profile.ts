"use server";

import { auth } from "@/auth";
import { userRepository } from "@/lib/repositories";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { requireCsrf, CsrfError } from "@/lib/csrf";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    await requireCsrf();
  } catch (e) {
    if (e instanceof CsrfError) {
      return { error: "Request blocked. Please refresh and try again." };
    }
    throw e;
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
      try {
        const { env } = await getCloudflareContext({ async: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r2 = (env as any).R2;

        console.log("R2 Binding present:", !!r2);

        if (!r2) {
          console.warn("R2 binding is missing in environment - skipping avatar upload");
          // We don't return error here, we just skip avatar upload so name/phone can still be updated
        } else {
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
      } catch (uploadError) {
        console.error("Avatar upload failed:", uploadError);
        // Continue without avatar update
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

/**
 * Save phone from checkout if user is missing one.
 */
export async function savePhoneFromCheckout(phone: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await requireCsrf();
  } catch (e) {
    if (e instanceof CsrfError) {
      return { success: false, error: "Request blocked. Please refresh and try again." };
    }
    throw e;
  }

  const userId = session.user.id;
  const currentUser = await userRepository.findById(userId);

  if (currentUser?.phone) {
    return { success: true, skipped: true };
  }

  try {
    await userRepository.updateProfile(userId, {
      phone,
    });
    revalidatePath("/profile");
    return { success: true, skipped: false };
  } catch (error) {
    console.error("Failed to save phone from checkout:", error);
    return { success: false, error: "Failed to save phone" };
  }
}
