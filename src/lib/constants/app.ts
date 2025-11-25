/**
 * Application-wide constants
 * Centralizes magic values for maintainability and consistency
 */

// Pricing & Costs
export const SHIPPING_COST = 4.99;

// Timing & Delays
export const MOCK_API_DELAY_MS = 1000;
export const MOCK_UPLOAD_DELAY_MS = 500;
export const FORM_SUBMISSION_TIMEOUT_MS = 30000;
export const ZERO_TIMEOUT_MS = 0; // For immediate execution in setTimeout
export const QUOTE_ROTATION_INTERVAL_MS = 8000; // 8 seconds

// File Upload Constraints
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE_MB = 5;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Form Validation Limits
export const MAX_NAME_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_TITLE_LENGTH = 200;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MIN_PASSWORD_LENGTH = 8;

// Product Constraints
export const MIN_PRODUCT_PRICE = 0.01;
export const MAX_PRODUCT_PRICE = 1000;
export const MIN_PRODUCT_WEIGHT = 1;

// Content Limits
export const MIN_REVIEW_LENGTH = 10;
export const MAX_REVIEW_LENGTH = 1000;
export const MIN_TESTIMONIAL_LENGTH = 10;
export const MAX_TESTIMONIAL_LENGTH = 500;
export const MAX_NEWS_SUMMARY_LENGTH = 300;

// Rating Constraints
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Common Allergens (for quick selection)
export const COMMON_ALLERGENS = ["Gluten", "Dairy", "Eggs", "Nuts", "Soy", "Sesame"] as const;

// Product Categories
export const PRODUCT_CATEGORIES = [
  "bread",
  "pastries",
  "cakes",
  "cookies",
  "savory",
  "seasonal",
] as const;

// Order Status
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

// Payment Methods
export const PAYMENT_METHODS = ["card", "cash", "payment_on_collection"] as const;

// Fulfillment Methods
export const FULFILLMENT_METHODS = ["delivery", "collection"] as const;

// News Post Status
export const NEWS_POST_STATUSES = ["draft", "published"] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// UI Constants
export const TOAST_DURATION_MS = 3000;
export const DEBOUNCE_DELAY_MS = 300;

// Type exports for const assertions
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type FulfillmentMethod = (typeof FULFILLMENT_METHODS)[number];
export type NewsPostStatus = (typeof NEWS_POST_STATUSES)[number];
export type CommonAllergen = (typeof COMMON_ALLERGENS)[number];
