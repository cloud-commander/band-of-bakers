"use server";

import { auth } from "@/auth";
import { kvService } from "@/lib/kv";
import { revalidatePath } from "next/cache";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
export type InstagramEmbedFormState = {
  message: string;
  success: boolean | null;
  embed: string;
  enabled: boolean;
};
export type InstagramSettings = {
  embed: string | null;
  enabled: boolean;
};

const EMBED_KEY = "instagram:embed";
const ENABLED_KEY = "instagram:enabled";

async function isAdmin() {
  const session = await auth();
  return !!session?.user?.role && ["owner", "manager", "staff"].includes(session.user.role);
}

export async function getInstagramSettings(): Promise<InstagramSettings> {
  try {
    const [embed, enabledFlag] = await Promise.all([
      kvService.getCached<string>(EMBED_KEY),
      kvService.getFeatureFlag(ENABLED_KEY),
    ]);
    return {
      embed: embed || null,
      enabled: enabledFlag ?? false,
    };
  } catch (error) {
    console.error("Failed to fetch instagram settings from KV", error);
    return { embed: null, enabled: false };
  }
}

export async function saveInstagramSettings(
  embedHtml: string,
  enabled: boolean
): Promise<ActionResult<void>> {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const trimmed = embedHtml?.trim();

    if (!trimmed) {
      await kvService.invalidateCache(EMBED_KEY);
      await kvService.setFeatureFlag(ENABLED_KEY, false);
      revalidatePath("/");
      return { success: true, data: undefined };
    }

    await Promise.all([
      kvService.setCache(EMBED_KEY, trimmed, 60 * 60 * 24 * 365), // 1 year TTL
      kvService.setFeatureFlag(ENABLED_KEY, enabled),
    ]);
    // Revalidate homepage to pick up changes
    revalidatePath("/");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to save instagram settings", error);
    return { success: false, error: "Failed to save embed settings" };
  }
}

export async function updateInstagramEmbedFormState(
  _prevState: InstagramEmbedFormState,
  formData: FormData
): Promise<InstagramEmbedFormState> {
  const embed = formData.get("embed")?.toString() ?? "";
  const enabledValues = formData.getAll("enabled").map((v) => v?.toString() ?? "");
  const enabled = enabledValues.some((v) => v === "on" || v === "true" || v === "1");
  const result = await saveInstagramSettings(embed, enabled);
  return {
    embed,
    enabled,
    success: result.success,
    message: result.success ? "Instagram embed saved" : result.error,
  };
}
