import { z } from "zod";

// ============================================================================
// TESTIMONIAL SCHEMAS
// ============================================================================

export const testimonialSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  content: z.string().min(10, "Testimonial must be at least 10 characters"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  is_approved: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertTestimonialSchema = z.object({
  user_id: z.string().uuid(),
  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial is too long"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
});

export const updateTestimonialSchema = insertTestimonialSchema.partial().extend({
  id: z.string().uuid(),
});

export const approveTestimonialSchema = z.object({
  id: z.string().uuid(),
  is_approved: z.boolean(),
  is_featured: z.boolean().optional(),
});

// Type exports
export type Testimonial = z.infer<typeof testimonialSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type UpdateTestimonial = z.infer<typeof updateTestimonialSchema>;
export type ApproveTestimonial = z.infer<typeof approveTestimonialSchema>;
