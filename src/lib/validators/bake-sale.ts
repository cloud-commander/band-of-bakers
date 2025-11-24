import { z } from "zod";

// ============================================================================
// LOCATION SCHEMAS
// ============================================================================

// UK postcode regex (simplified but comprehensive)
const ukPostcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;

export const locationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Location name is required"),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().regex(ukPostcodeRegex, "Invalid UK postcode"),
  collection_hours: z.string().nullable().optional(), // e.g. "10:00-16:00"
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertLocationSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  address_line1: z.string().min(1, "Address line 1 is required"),
  address_line2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().regex(ukPostcodeRegex, "Invalid UK postcode"),
  collection_hours: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export const updateLocationSchema = insertLocationSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// BAKE SALE SCHEMAS
// ============================================================================

export const bakeSaleSchema = z.object({
  id: z.string().uuid(),
  date: z.string().date(), // ISO date (YYYY-MM-DD)
  location_id: z.string().uuid(),
  cutoff_datetime: z.string().datetime(), // ISO datetime
  is_active: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const insertBakeSaleSchema = z
  .object({
    date: z.string().date(), // ISO date (YYYY-MM-DD)
    location_id: z.string().uuid(),
    cutoff_datetime: z.string().datetime(),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const cutoffDate = new Date(data.cutoff_datetime);
      const bakeSaleDate = new Date(data.date);
      return cutoffDate <= bakeSaleDate;
    },
    {
      message: "Cutoff time must be before or on the bake sale date",
    }
  );

export const updateBakeSaleSchema = insertBakeSaleSchema.partial().extend({
  id: z.string().uuid(),
});

// ============================================================================
// COMBINED SCHEMAS
// ============================================================================

export const bakeSaleWithLocationSchema = bakeSaleSchema.extend({
  location: locationSchema,
});

// Type exports
export type Location = z.infer<typeof locationSchema>;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type UpdateLocation = z.infer<typeof updateLocationSchema>;

export type BakeSale = z.infer<typeof bakeSaleSchema>;
export type InsertBakeSale = z.infer<typeof insertBakeSaleSchema>;
export type UpdateBakeSale = z.infer<typeof updateBakeSaleSchema>;

export type BakeSaleWithLocation = z.infer<typeof bakeSaleWithLocationSchema>;
