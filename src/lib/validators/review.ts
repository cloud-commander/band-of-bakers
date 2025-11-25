import { z } from "zod";

// ============================================================================
// REVIEW SCHEMAS
// ============================================================================

export const reviewSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .nullable()
    .optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review is too long"),
  is_verified_purchase: z.boolean().default(false),
  is_approved: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertReviewSchema = z.object({
  user_id: z.string().uuid(),
  product_id: z.string().uuid(),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long")
    .nullable()
    .optional(),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review is too long"),
});

export const updateReviewSchema = insertReviewSchema.partial().extend({
  id: z.string().uuid(),
});

export const approveReviewSchema = z.object({
  id: z.string().uuid(),
  is_approved: z.boolean(),
});

// Type exports
export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type ApproveReview = z.infer<typeof approveReviewSchema>;
