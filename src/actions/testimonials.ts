"use server";

import { auth } from "@/auth";
import { testimonialRepository } from "@/lib/repositories/testimonial.repository";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { nanoid } from "nanoid";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

// Validation schema
const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().optional(),
  content: z.string().min(1, "Content is required").max(500),
  rating: z.number().min(1).max(5),
  status: z.enum(["active", "inactive"]),
  avatar: z.string().optional(),
});

/**
 * Check admin role
 */
async function checkAdminRole() {
  const session = await auth();
  if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
    return false;
  }
  return true;
}

/**
 * Create a new testimonial
 */
export async function createTestimonial(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    if (!(await checkAdminRole())) {
      return { success: false, error: "Unauthorized" };
    }

    const rawData = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string),
      status: formData.get("status") as string,
      avatar: formData.get("avatar") as string, // URL or empty
    };

    const validated = testimonialSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    const testimonial = await testimonialRepository.create({
      id: nanoid(),
      name: validated.data.name,
      role: validated.data.role,
      content: validated.data.content,
      rating: validated.data.rating,
      avatar_url: validated.data.avatar || null,
      is_active: validated.data.status === "active",
    });

    revalidatePath("/admin/testimonials");
    revalidatePath("/testimonials"); // Assuming public page exists

    return { success: true, data: { id: testimonial.id } };
  } catch (error) {
    console.error("Create testimonial error:", error);
    return { success: false, error: "Failed to create testimonial" };
  }
}
