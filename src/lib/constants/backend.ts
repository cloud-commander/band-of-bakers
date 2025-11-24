/**
 * Backend Constants
 * Single source of truth for backend-related constants
 * Used in Server Actions, database operations, and business logic
 */

// ============================================================================
// DATABASE CONSTRAINTS
// ============================================================================

export const DB_CONSTRAINTS = {
  /** Maximum product name length */
  MAX_PRODUCT_NAME: 255,
  /** Maximum product description length */
  MAX_PRODUCT_DESCRIPTION: 2000,
  /** Maximum category name length */
  MAX_CATEGORY_NAME: 100,
  /** Maximum user name length */
  MAX_USER_NAME: 255,
  /** Maximum email length */
  MAX_EMAIL_LENGTH: 254,
  /** Maximum order notes length */
  MAX_ORDER_NOTES: 500,
} as const;

// ============================================================================
// PRICING CONSTANTS
// ============================================================================

export const PRICING = {
  /** Minimum order value (GBP) */
  MIN_ORDER_VALUE: 5.0,
  /** Standard delivery fee (GBP) */
  DELIVERY_FEE: 5.0,
  /** Free delivery threshold (GBP) */
  FREE_DELIVERY_THRESHOLD: 50.0,
  /** Maximum discount percentage */
  MAX_DISCOUNT_PERCENTAGE: 100,
  /** Currency code */
  CURRENCY: "GBP",
} as const;

// ============================================================================
// ORDER STATUSES
// ============================================================================

export const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready",
  FULFILLED: "fulfilled",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

// ============================================================================
// PAYMENT METHODS
// ============================================================================

export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  PAYMENT_ON_COLLECTION: "payment_on_collection",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// ============================================================================
// PAYMENT STATUSES
// ============================================================================

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

// ============================================================================
// FULFILLMENT METHODS
// ============================================================================

export const FULFILLMENT_METHODS = {
  COLLECTION: "collection",
  DELIVERY: "delivery",
} as const;

export type FulfillmentMethod =
  (typeof FULFILLMENT_METHODS)[keyof typeof FULFILLMENT_METHODS];

// ============================================================================
// USER ROLES
// ============================================================================

export const USER_ROLES = {
  CUSTOMER: "customer",
  STAFF: "staff",
  MANAGER: "manager",
  OWNER: "owner",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================

export const STRIPE = {
  /** Stripe API version */
  API_VERSION: "2024-04-10",
  /** Stripe webhook timeout (milliseconds) */
  WEBHOOK_TIMEOUT: 5000,
} as const;

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export const EMAIL_TEMPLATES = {
  /** Order confirmation email */
  ORDER_CONFIRMATION: "order-confirmation",
  /** Order shipped email */
  ORDER_SHIPPED: "order-shipped",
  /** Order delivered email */
  ORDER_DELIVERED: "order-delivered",
  /** Password reset email */
  PASSWORD_RESET: "password-reset",
  /** Welcome email */
  WELCOME: "welcome",
} as const;

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMITS = {
  /** Authentication attempts per minute per IP */
  AUTH_ATTEMPTS_PER_MINUTE: 5,
  /** API read requests per minute per user */
  API_READ_PER_MINUTE: 100,
  /** API write requests per minute per user */
  API_WRITE_PER_MINUTE: 10,
  /** Payment requests per second per user */
  PAYMENT_PER_SECOND: 1,
  /** Image uploads per day per user */
  IMAGE_UPLOADS_PER_DAY: 10,
} as const;

// ============================================================================
// CACHE TTL (Time To Live)
// ============================================================================

export const CACHE_TTL = {
  /** Session cache TTL (seconds) */
  SESSION: 86400, // 24 hours
  /** Auth token TTL (seconds) */
  AUTH_TOKEN: 3600, // 1 hour
  /** Query cache TTL (seconds) */
  QUERY: 900, // 15 minutes
  /** Product cache TTL (seconds) */
  PRODUCT: 600, // 10 minutes
  /** User cache TTL (seconds) */
  USER: 300, // 5 minutes
  /** Temporary data TTL (seconds) */
  TEMPORARY: 3600, // 1 hour
} as const;

// ============================================================================
// BUSINESS LOGIC RULES
// ============================================================================

export const BUSINESS_RULES = {
  /** Bake sale cutoff days before event */
  BAKE_SALE_CUTOFF_DAYS: 2,
  /** Maximum items per order */
  MAX_ITEMS_PER_ORDER: 100,
  /** Minimum items per order */
  MIN_ITEMS_PER_ORDER: 1,
  /** Order history retention days */
  ORDER_HISTORY_RETENTION_DAYS: 365,
  /** Voucher code length */
  VOUCHER_CODE_LENGTH: 10,
} as const;

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  /** Default page size */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum page size */
  MAX_PAGE_SIZE: 100,
  /** Minimum page size */
  MIN_PAGE_SIZE: 1,
} as const;

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  /** Unauthorized access */
  UNAUTHORIZED: "UNAUTHORIZED",
  /** Forbidden access */
  FORBIDDEN: "FORBIDDEN",
  /** Resource not found */
  NOT_FOUND: "NOT_FOUND",
  /** Validation error */
  VALIDATION_ERROR: "VALIDATION_ERROR",
  /** Internal server error */
  INTERNAL_ERROR: "INTERNAL_ERROR",
  /** Payment failed */
  PAYMENT_FAILED: "PAYMENT_FAILED",
  /** Insufficient inventory */
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

// ============================================================================
// LOGGING
// ============================================================================

export const LOGGING = {
  /** Log level: debug */
  DEBUG: "debug",
  /** Log level: info */
  INFO: "info",
  /** Log level: warning */
  WARNING: "warning",
  /** Log level: error */
  ERROR: "error",
} as const;
