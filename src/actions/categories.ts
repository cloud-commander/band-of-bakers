"use server";

import { categoryRepository } from "@/lib/repositories/category.repository";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { productCategories, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import { eq } from "drizzle-orm";
import { requireCsrf, CsrfError } from "@/lib/csrf";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

async function checkAdmin() {
  const session = await auth();
  return (
    session?.user?.role === "owner" ||
    session?.user?.role === "manager" ||
    session?.user?.role === "staff"
  );
}

export async function getCategories() {
  try {
    return await categoryRepository.findAllSorted();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
}): Promise<ActionResult<{ id: string }>> {
  if (!(await checkAdmin())) {
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

  try {
    const db = await getDb();

    // Check if slug already exists
    const existing = await categoryRepository.findBySlug(data.slug);
    if (existing) {
      return { success: false, error: "A category with this slug already exists" };
    }

    const id = `cat-${Date.now()}`;
    await db.insert(productCategories).values({
      id,
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      image_url: data.image_url || null,
      sort_order: data.sort_order ?? 0,
    });

    revalidatePath("/admin/products");
    return { success: true, data: { id } };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    image_url?: string;
    sort_order?: number;
  }
): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) {
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

  try {
    const db = await getDb();

    // If slug is being updated, check it doesn't conflict
    if (data.slug) {
      const existing = await categoryRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        return { success: false, error: "A category with this slug already exists" };
      }
    }

    await db
      .update(productCategories)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.image_url !== undefined && { image_url: data.image_url || null }),
        ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
        updated_at: new Date().toISOString(),
      })
      .where(eq(productCategories.id, id));

    revalidatePath("/admin/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) {
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

  try {
    const db = await getDb();

    // Check if category has products
    const categoryProducts = await db
      .select()
      .from(products)
      .where(eq(products.category_id, id));

    if (categoryProducts.length > 0) {
      return {
        success: false,
        error: `Cannot delete category with ${categoryProducts.length} product(s). Move or delete the products first.`,
      };
    }

    await db.delete(productCategories).where(eq(productCategories.id, id));

    revalidatePath("/admin/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function reorderCategories(
  categoryIds: string[]
): Promise<ActionResult<void>> {
  if (!(await checkAdmin())) {
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

  try {
    const db = await getDb();

    // Update sort_order for each category
    await Promise.all(
      categoryIds.map((id, index) =>
        db
          .update(productCategories)
          .set({ sort_order: index, updated_at: new Date().toISOString() })
          .where(eq(productCategories.id, id))
      )
    );

    revalidatePath("/admin/products");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to reorder categories:", error);
    return { success: false, error: "Failed to reorder categories" };
  }
}
