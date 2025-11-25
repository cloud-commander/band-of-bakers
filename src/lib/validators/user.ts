import { z } from "zod";

// ============================================================================
// USER SCHEMAS
// ============================================================================

export const userRoles = ["customer", "staff", "manager", "owner"] as const;
export type UserRole = (typeof userRoles)[number];

// Base user schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string().nullable(),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^\+?44\d{10}$/)
    .nullable()
    .optional(),
  role: z.enum(userRoles),
  avatar_url: z.string().url().nullable().optional(),
  email_verified: z.boolean(),
  is_banned: z.boolean().default(false),
  banned_at: z.string().datetime().nullable().optional(),
  banned_reason: z.string().nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Insert schema (without id and timestamps)
export const insertUserSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(8, "Password must be at least 8 characters").nullable().optional(),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^\+?44\d{10}$/, "Invalid UK phone number")
    .nullable()
    .optional(),
  role: z.enum(userRoles).default("customer"),
  avatar_url: z.string().url().nullable().optional(),
  email_verified: z.boolean().default(false),
  is_banned: z.boolean().default(false),
  banned_at: z.string().datetime().nullable().optional(),
  banned_reason: z.string().nullable().optional(),
});

// Update schema (partial with id)
export const updateUserSchema = insertUserSchema.partial().extend({
  id: z.string().uuid(),
});

// Public user schema (without sensitive fields)
export const publicUserSchema = userSchema.omit({
  password_hash: true,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

// Signup schema
export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^\+?44\d{10}$/, "Invalid UK phone number")
    .nullable()
    .optional(),
});

// Password reset schema
export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const confirmResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
