"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { bakeSaleRepository } from "@/lib/repositories/bake-sale.repository";
import { z } from "zod";
import { type BakeSale } from "@/db/schema";
import { requireCsrf, CsrfError } from "@/lib/csrf";

// Validation schema
const bakeSaleSchema = z.object({
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  cutoff_datetime: z.string().min(1, "Cutoff time is required"),
  is_active: z.boolean().default(true),
  notes: z.string().optional(),
});

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Get all bake sales (upcoming and archived)
 */
export async function getBakeSales() {
  try {
    const upcoming = await bakeSaleRepository.findUpcoming();
    const archived = await bakeSaleRepository.findArchived();
    return { upcoming, archived };
  } catch (error) {
    console.error("Get bake sales error:", error);
    return { upcoming: [], archived: [] };
  }
}

/**
 * Get upcoming bake sales
 */
export async function getUpcomingBakeSales() {
  try {
    return await bakeSaleRepository.findUpcoming();
  } catch (error) {
    console.error("Get upcoming bake sales error:", error);
    return [];
  }
}

/**
 * Get all active locations for dropdowns
 */
export async function getLocations() {
  try {
    const { locationRepository } = await import("@/lib/repositories/location.repository");
    return await locationRepository.findActive();
  } catch (error) {
    console.error("Get locations error:", error);
    return [];
  }
}

/**
 * Get a single bake sale by ID
 */
export async function getBakeSaleById(id: string) {
  try {
    return await bakeSaleRepository.findByIdWithLocation(id);
  } catch (error) {
    console.error("Get bake sale error:", error);
    return null;
  }
}

/**
 * Create a new bake sale
 */
export async function createBakeSale(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
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
      date: formData.get("date") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      cutoff_datetime: formData.get("cutoff_datetime") as string,
      is_active: formData.get("is_active") === "true",
      notes: formData.get("notes") as string,
    };

    const validated = bakeSaleSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Find or create location
    // We need to import locationRepository dynamically or at top level if not circular
    const { locationRepository } = await import("@/lib/repositories/location.repository");
    let location = await locationRepository.findByName(validated.data.location);

    if (!location) {
      location = await locationRepository.create({
        id: crypto.randomUUID(),
        name: validated.data.location,
        address_line1: validated.data.address,
        city: "Unknown", // Default
        postcode: "Unknown", // Default
        is_active: true,
      });
    }

    // 4. Create record
    const id = crypto.randomUUID();
    const bakeSale = await bakeSaleRepository.create({
      id,
      date: validated.data.date,
      location_id: location.id,
      cutoff_datetime: validated.data.cutoff_datetime,
      is_active: validated.data.is_active,
    });

    // 5. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/");

    return { success: true, data: { id: bakeSale.id } };
  } catch (error) {
    console.error("Create bake sale error:", error);
    return { success: false, error: "Failed to create bake sale" };
  }
}

/**
 * Update an existing bake sale
 */
export async function updateBakeSale(
  id: string,
  formData: FormData
): Promise<ActionResult<BakeSale>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
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
      date: formData.get("date"),
      location_id: formData.get("location_id"),
      cutoff_datetime: formData.get("cutoff_datetime"),
      is_active: formData.get("is_active") === "true",
    };

    const validated = bakeSaleSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Update record
    const bakeSale = (await bakeSaleRepository.update(id, validated.data)) as BakeSale | null;

    if (!bakeSale) {
      return { success: false, error: "Bake sale not found" };
    }

    // 4. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/");

    return { success: true, data: bakeSale };
  } catch (error) {
    console.error("Update bake sale error:", error);
    return { success: false, error: "Failed to update bake sale" };
  }
}

/**
 * Delete a bake sale
 */
export async function deleteBakeSale(id: string): Promise<ActionResult<void>> {
  try {
    // 1. Auth check
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Delete record
    await bakeSaleRepository.delete(id);

    // 3. Revalidate
    revalidatePath("/admin/bake-sales");
    revalidatePath("/");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete bake sale error:", error);
    return { success: false, error: "Failed to delete bake sale" };
  }
}
