/**
 * Production Environment Constants
 * Override base constants for production environment
 * Loaded when NODE_ENV === 'production'
 */

import * as baseBackend from "./backend";
import * as baseFrontend from "./frontend";

// ============================================================================
// PRODUCTION OVERRIDES
// ============================================================================

/**
 * Production-specific backend constants
 * Stricter limits and longer cache TTL for performance
 */
export const PRODUCTION_BACKEND = {
  ...baseBackend,
  // Stricter rate limits for security
  RATE_LIMITS: {
    ...baseBackend.RATE_LIMITS,
    AUTH_ATTEMPTS_PER_MINUTE: 3, // Stricter for security
    API_READ_PER_MINUTE: 100,
    API_WRITE_PER_MINUTE: 10,
  },
  // Longer cache TTL for better performance
  CACHE_TTL: {
    ...baseBackend.CACHE_TTL,
    SESSION: 86400, // 24 hours
    QUERY: 900, // 15 minutes
    PRODUCT: 1800, // 30 minutes (longer for stable products)
  },
  // Disable experimental features in production
  FEATURE_FLAGS: {
    NEW_CHECKOUT: false,
    PRODUCT_REVIEWS: false,
    WISHLIST: false,
  },
} as const;

/**
 * Production-specific frontend constants
 * Standard animations for production
 */
export const PRODUCTION_FRONTEND = {
  ...baseFrontend,
  // Standard animation durations
  ANIMATION_DURATIONS: {
    ...baseFrontend.ANIMATION_DURATIONS,
    FADE_IN: 0.6,
    BENTO_GRID: 0.5,
    FEATURE_GRID: 0.6,
  },
  // Disable experimental features in production
  FEATURE_FLAGS: {
    NEW_CHECKOUT: false,
    PRODUCT_REVIEWS: false,
    WISHLIST: false,
  },
} as const;

// ============================================================================
// PRODUCTION UTILITIES
// ============================================================================

/**
 * Check if running in production
 */
export const isProduction = process.env.NODE_ENV === "production";

/**
 * Production-specific error handling
 * Sanitize error messages for security
 */
export function sanitizeErrorMessage(error: Error): string {
  // In production, don't expose internal error details
  if (isProduction) {
    return "An error occurred. Please try again later.";
  }
  return error.message;
}

/**
 * Production-specific logging
 * Only log critical errors in production
 */
export function logProductionError(error: Error, context?: string) {
  if (isProduction) {
    // Send to error tracking service (e.g., Rollbar, Sentry)
    console.error(`[${context || "Error"}]`, error.message);
  } else {
    console.error(`[${context || "Error"}]`, error);
  }
}
