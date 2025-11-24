/**
 * Development Environment Constants
 * Override base constants for development environment
 * Loaded when NODE_ENV === 'development'
 */

import * as baseBackend from "./backend";
import * as baseFrontend from "./frontend";

// ============================================================================
// DEVELOPMENT OVERRIDES
// ============================================================================

/**
 * Development-specific backend constants
 * Overrides base backend constants for development environment
 */
export const DEVELOPMENT_BACKEND = {
  ...baseBackend,
  // Override rate limits for easier testing
  RATE_LIMITS: {
    ...baseBackend.RATE_LIMITS,
    AUTH_ATTEMPTS_PER_MINUTE: 100, // Relaxed for testing
    API_READ_PER_MINUTE: 1000,
    API_WRITE_PER_MINUTE: 100,
  },
  // Shorter cache TTL for faster iteration
  CACHE_TTL: {
    ...baseBackend.CACHE_TTL,
    SESSION: 3600, // 1 hour instead of 24
    QUERY: 60, // 1 minute instead of 15
    PRODUCT: 60, // 1 minute instead of 10
  },
  // Enable all feature flags in development
  FEATURE_FLAGS: {
    NEW_CHECKOUT: true,
    PRODUCT_REVIEWS: true,
    WISHLIST: true,
  },
} as const;

/**
 * Development-specific frontend constants
 * Overrides base frontend constants for development environment
 */
export const DEVELOPMENT_FRONTEND = {
  ...baseFrontend,
  // Faster animations for quicker testing
  ANIMATION_DURATIONS: {
    ...baseFrontend.ANIMATION_DURATIONS,
    FADE_IN: 0.2,
    BENTO_GRID: 0.2,
    FEATURE_GRID: 0.2,
  },
  // Enable all feature flags in development
  FEATURE_FLAGS: {
    NEW_CHECKOUT: true,
    PRODUCT_REVIEWS: true,
    WISHLIST: true,
  },
} as const;

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Log development constants to console
 * Useful for debugging configuration
 */
export function logDevelopmentConstants() {
  if (typeof window !== "undefined") {
    console.group("🔧 Development Constants");
    console.log("Backend:", DEVELOPMENT_BACKEND);
    console.log("Frontend:", DEVELOPMENT_FRONTEND);
    console.groupEnd();
  }
}

/**
 * Check if running in development
 */
export const isDevelopment = process.env.NODE_ENV === "development";
