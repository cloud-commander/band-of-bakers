"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { locationRepository } from "@/lib/repositories/location.repository";
import { z } from "zod";
import { type Location, bakeSales } from "@/db/schema";
import { getDb } from "@/lib/db";
import { eq, count } from "drizzle-orm";
import { requireCsrf, CsrfError } from "@/lib/csrf";

// Validation schema
const locationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  collection_hours: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
});

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Get all locations (for admin)
 */
export async function getAllLocations() {
  try {
    return await locationRepository.findAll();
  } catch (error) {
    console.error("Get all locations error:", error);
    return [];
  }
}

/**
 * Get active locations (for dropdowns)
 */
export async function getActiveLocations() {
  try {
    return await locationRepository.findActive();
  } catch (error) {
    console.error("Get active locations error:", error);
    return [];
  }
}

/**
 * Create a new location
 */
export async function createLocation(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
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

    // 2. Validation
    const rawData = {
      name: formData.get("name"),
      address_line1: formData.get("address_line1"),
      address_line2: formData.get("address_line2") || null,
      city: formData.get("city"),
      postcode: formData.get("postcode"),
      collection_hours: formData.get("collection_hours") || null,
      is_active: formData.get("is_active") === "true",
    };

    const validated = locationSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Create record
    const id = crypto.randomUUID();
    const location = await locationRepository.create({
      id,
      ...validated.data,
    });

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");

    return { success: true, data: { id: location.id } };
  } catch (error) {
    console.error("Create location error:", error);
    return { success: false, error: "Failed to create location" };
  }
}

/**
 * Update an existing location
 */
export async function updateLocation(
  id: string,
  formData: FormData
): Promise<ActionResult<Location>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
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

    // 2. Validation
    const rawData = {
      name: formData.get("name"),
      address_line1: formData.get("address_line1"),
      address_line2: formData.get("address_line2") || null,
      city: formData.get("city"),
      postcode: formData.get("postcode"),
      collection_hours: formData.get("collection_hours") || null,
      is_active: formData.get("is_active") === "true",
    };

    const validated = locationSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Update record
    const location = (await locationRepository.update(id, validated.data)) as Location | null;

    if (!location) {
      return { success: false, error: "Location not found" };
    }

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");

    return { success: true, data: location };
  } catch (error) {
    console.error("Update location error:", error);
    return { success: false, error: "Failed to update location" };
  }
}

/**
 * Delete a location
 */
export async function deleteLocation(id: string): Promise<ActionResult<void>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
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

    // 2. Check for usage
    const db = await getDb();
    const usage = await db
      .select({ count: count() })
      .from(bakeSales)
      .where(eq(bakeSales.location_id, id));

    if (usage[0].count > 0) {
      return {
        success: false,
        error:
          "Cannot delete location because it is used by existing bake sales. Please deactivate it instead.",
      };
    }

    // 3. Delete record
    await locationRepository.delete(id);

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete location error:", error);
    return { success: false, error: "Failed to delete location" };
  }
}
