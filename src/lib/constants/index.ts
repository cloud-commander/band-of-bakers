/**
 * Constants Index
 * Central export point for all application constants
 * Import from this file for convenient access to all constants
 *
 * @example
 * import { ANIMATION_DURATIONS, UI_THRESHOLDS } from "@/lib/constants";
 */

// Frontend Constants
export {
  BUSINESS_INFO,
  STORE,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  UI_THRESHOLDS,
  LAYOUT,
  BREAKPOINTS,
  COLORS,
  FONTS,
  FORM_VALIDATION,
  API_ENDPOINTS,
  FEATURE_FLAGS,
  MESSAGES,
} from "./frontend";

// Backend Constants
export {
  DB_CONSTRAINTS,
  PRICING,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  FULFILLMENT_METHODS,
  USER_ROLES,
  STRIPE,
  EMAIL_TEMPLATES,
  RATE_LIMITS,
  CACHE_TTL,
  BUSINESS_RULES,
  PAGINATION,
  ERROR_CODES,
  LOGGING,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
  type FulfillmentMethod,
  type UserRole,
} from "./backend";
