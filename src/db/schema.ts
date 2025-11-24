import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Helper for timestamps
const timestamps = {
  created_at: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

// ============================================================================
// USERS
// ============================================================================

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash"), // Nullable for OAuth-only users
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("customer"), // customer, staff, manager, owner
  avatar_url: text("avatar_url"),
  email_verified: integer("email_verified", { mode: "boolean" })
    .notNull()
    .default(false),
  ...timestamps,
});

// ============================================================================
// PRODUCT CATEGORIES
// ============================================================================

export const productCategories = sqliteTable("product_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  sort_order: integer("sort_order").notNull().default(0),
  ...timestamps,
});

// ============================================================================
// PRODUCTS
// ============================================================================

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  category_id: text("category_id")
    .notNull()
    .references(() => productCategories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  base_price: real("base_price").notNull(), // GBP
  image_url: text("image_url"),
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ============================================================================
// PRODUCT VARIANTS
// ============================================================================

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  product_id: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // Small, Medium, Large
  price_adjustment: real("price_adjustment").notNull().default(0), // Added to base_price
  sort_order: integer("sort_order").notNull().default(0),
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ============================================================================
// LOCATIONS
// ============================================================================

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  address_line1: text("address_line1").notNull(),
  address_line2: text("address_line2"),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  collection_hours: text("collection_hours"), // e.g. "10:00-16:00"
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ============================================================================
// BAKE SALES
// ============================================================================

export const bakeSales = sqliteTable("bake_sales", {
  id: text("id").primaryKey(),
  date: text("date").notNull(), // ISO date string (YYYY-MM-DD)
  location_id: text("location_id")
    .notNull()
    .references(() => locations.id),
  cutoff_datetime: text("cutoff_datetime").notNull(), // ISO datetime string
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ============================================================================
// ORDERS
// ============================================================================

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
  bake_sale_id: text("bake_sale_id")
    .notNull()
    .references(() => bakeSales.id),
  status: text("status").notNull().default("pending"), // pending, processing, ready, fulfilled, cancelled, refunded
  fulfillment_method: text("fulfillment_method")
    .notNull()
    .default("collection"), // collection, delivery
  payment_method: text("payment_method")
    .notNull()
    .default("payment_on_collection"), // stripe, paypal, bank_transfer, payment_on_collection
  payment_status: text("payment_status").notNull().default("pending"), // pending, completed, failed, refunded
  payment_intent_id: text("payment_intent_id"), // Stripe PaymentIntent ID
  subtotal: real("subtotal").notNull(),
  delivery_fee: real("delivery_fee").notNull().default(0),
  voucher_discount: real("voucher_discount").notNull().default(0),
  total: real("total").notNull(),
  // Shipping address (required if delivery)
  shipping_address_line1: text("shipping_address_line1"),
  shipping_address_line2: text("shipping_address_line2"),
  shipping_city: text("shipping_city"),
  shipping_postcode: text("shipping_postcode"),
  // Billing address (always required)
  billing_address_line1: text("billing_address_line1").notNull(),
  billing_address_line2: text("billing_address_line2"),
  billing_city: text("billing_city").notNull(),
  billing_postcode: text("billing_postcode").notNull(),
  voucher_id: text("voucher_id").references(() => vouchers.id),
  notes: text("notes"),
  ...timestamps,
});

// ============================================================================
// ORDER ITEMS
// ============================================================================

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  order_id: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  product_id: text("product_id")
    .notNull()
    .references(() => products.id),
  product_variant_id: text("product_variant_id").references(
    () => productVariants.id
  ),
  quantity: integer("quantity").notNull(),
  unit_price: real("unit_price").notNull(), // Price at time of order
  total_price: real("total_price").notNull(), // unit_price * quantity
  is_available: integer("is_available", { mode: "boolean" })
    .notNull()
    .default(true),
  unavailable_reason: text("unavailable_reason"),
  ...timestamps,
});

// ============================================================================
// VOUCHERS
// ============================================================================

export const vouchers = sqliteTable("vouchers", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // percentage, fixed_amount
  value: real("value").notNull(), // Percentage (0-100) or GBP amount
  min_order_value: real("min_order_value").notNull().default(0),
  max_uses: integer("max_uses"), // NULL = unlimited
  current_uses: integer("current_uses").notNull().default(0),
  max_uses_per_customer: integer("max_uses_per_customer").notNull().default(1),
  valid_from: text("valid_from").notNull(), // ISO datetime
  valid_until: text("valid_until").notNull(), // ISO datetime
  is_active: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ============================================================================
// NEWS POSTS
// ============================================================================

export const newsPosts = sqliteTable("news_posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(), // HTML or Markdown
  excerpt: text("excerpt"),
  image_url: text("image_url"),
  author_id: text("author_id")
    .notNull()
    .references(() => users.id),
  is_published: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(false),
  published_at: text("published_at"), // ISO datetime
  ...timestamps,
});

// ============================================================================
// SETTINGS
// ============================================================================

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(), // JSON string
  description: text("description"),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// ============================================================================
// Type Exports
// ============================================================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = typeof productCategories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertProductVariant = typeof productVariants.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type InsertLocation = typeof locations.$inferInsert;

export type BakeSale = typeof bakeSales.$inferSelect;
export type InsertBakeSale = typeof bakeSales.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

export type Voucher = typeof vouchers.$inferSelect;
export type InsertVoucher = typeof vouchers.$inferInsert;

export type NewsPost = typeof newsPosts.$inferSelect;
export type InsertNewsPost = typeof newsPosts.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;
