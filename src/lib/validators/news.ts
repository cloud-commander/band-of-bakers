import { z } from "zod";

// ============================================================================
// NEWS POST SCHEMAS
// ============================================================================

export const newsPostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  featured_image: z.string().url().nullable().optional(),
  author: z.string().nullable().optional(),
  author_id: z.string().uuid(),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertNewsPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  author_id: z.string().uuid(),
  is_published: z.boolean().default(false),
  published_at: z.string().datetime().nullable().optional(),
});

export const updateNewsPostSchema = insertNewsPostSchema.partial().extend({
  id: z.string().uuid(),
});

// Publish news post schema
export const publishNewsPostSchema = z.object({
  id: z.string().uuid(),
  is_published: z.boolean(),
  published_at: z.string().datetime().nullable().optional(),
});

// Type exports
export type NewsPost = z.infer<typeof newsPostSchema>;
export type InsertNewsPost = z.infer<typeof insertNewsPostSchema>;
export type UpdateNewsPost = z.infer<typeof updateNewsPostSchema>;
export type PublishNewsPost = z.infer<typeof publishNewsPostSchema>;
