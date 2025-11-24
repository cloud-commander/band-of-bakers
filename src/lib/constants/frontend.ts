/**
 * Frontend Constants
 * Single source of truth for UI-related constants
 * Used across components for animations, thresholds, and styling
 */

// ============================================================================
// BUSINESS IDENTITY
// ============================================================================

export const BUSINESS_INFO = {
  // Store Identity
  name: "Band of Bakers",
  shortName: "Band of Bakers",
  tagline: "Fresh-baked goodness every day",
  logo: "🍞",

  // Contact & Location
  address: {
    street: "Station Road",
    city: "Cressage",
    postcode: "SY5 6AD",
    country: "United Kingdom",
    formatted: "Station Road,\n Cressage,\n SY5 6AD",
  },

  // Coordinates for Google Maps
  coordinates: {
    latitude: 52.63449405760631,
    longitude: -2.604849301822585,
  },

  // Contact Details
  phone: "+44 (0)75 2222 2222",
  email: "hello@bandofbakers.co.uk",

  // Business Hours
  hours: {
    saturday: "8:00 AM - 1:00 PM",
  },

  // Social Media
  social: {
    enabled: true, // Toggle social icons on/off
    instagram: "https://www.instagram.com/band_of_bakers/",
    facebook: "https://www.facebook.com/ShrewsburyMarketHall/",
    twitter: "",
  },
} as const;

// ============================================================================
// STORE CONSTANTS (for storefront components)
// ============================================================================

export const STORE = {
  name: BUSINESS_INFO.name,
  shortName: BUSINESS_INFO.shortName,
  address: {
    formatted: BUSINESS_INFO.address.formatted,
  },
  social: BUSINESS_INFO.social,
  designCredit: {
    name: "Design Credit Name", // Placeholder - update as needed
    url: "https://example.com", // Placeholder - update as needed
  },
} as const;

// ============================================================================
// ANIMATION CONSTANTS
// ============================================================================

export const ANIMATION_DURATIONS = {
  /** Fade-in animation duration (seconds) */
  FADE_IN: 0.6,
  /** Bento grid item animation duration (seconds) */
  BENTO_GRID: 0.5,
  /** Feature grid item animation duration (seconds) */
  FEATURE_GRID: 0.6,
} as const;

export const ANIMATION_DELAYS = {
  /** Stagger delay between animated items (seconds) */
  STAGGER: 0.1,
} as const;

// ============================================================================
// UI THRESHOLDS
// ============================================================================

export const UI_THRESHOLDS = {
  /** Scroll distance to trigger navbar background (pixels) */
  SCROLL_NAVBAR: 10,
} as const;

// ============================================================================
// LAYOUT CONSTANTS
// ============================================================================

export const LAYOUT = {
  /** Maximum content width (pixels) */
  MAX_WIDTH: 1400,
  /** Standard padding (pixels) */
  PADDING: 16,
  /** Standard gap between elements (pixels) */
  GAP: 32,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const BREAKPOINTS = {
  /** Mobile breakpoint (pixels) */
  MOBILE: 640,
  /** Tablet breakpoint (pixels) */
  TABLET: 768,
  /** Desktop breakpoint (pixels) */
  DESKTOP: 1024,
  /** Large desktop breakpoint (pixels) */
  LARGE: 1280,
} as const;

// ============================================================================
// COLORS (CSS Variables)
// ============================================================================

export const COLORS = {
  /** Warm background color */
  BG_WARM: "var(--bg-warm)",
  /** Main text color */
  TEXT_MAIN: "var(--text-main)",
  /** Accent color */
  ACCENT: "var(--accent)",
  /** Card background color */
  CARD_BG: "var(--card-bg)",
} as const;

// ============================================================================
// FONTS (CSS Variables)
// ============================================================================

export const FONTS = {
  /** DM Serif Display font family */
  DM_SERIF: "var(--font-dm-serif)",
  /** Geist Sans font family */
  GEIST_SANS: "var(--font-geist-sans)",
} as const;

// ============================================================================
// FORM VALIDATION
// ============================================================================

export const FORM_VALIDATION = {
  /** Minimum password length */
  MIN_PASSWORD_LENGTH: 8,
  /** Maximum email length */
  MAX_EMAIL_LENGTH: 254,
  /** Minimum name length */
  MIN_NAME_LENGTH: 2,
  /** Maximum name length */
  MAX_NAME_LENGTH: 100,
} as const;

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const API_ENDPOINTS = {
  /** Base API URL */
  BASE: "/api",
  /** Products endpoint */
  PRODUCTS: "/api/products",
  /** Orders endpoint */
  ORDERS: "/api/orders",
  /** Users endpoint */
  USERS: "/api/users",
  /** Auth endpoint */
  AUTH: "/api/auth",
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export const FEATURE_FLAGS = {
  /** Enable new checkout flow */
  NEW_CHECKOUT: false,
  /** Enable product reviews */
  PRODUCT_REVIEWS: false,
  /** Enable wishlist feature */
  WISHLIST: false,
} as const;

// ============================================================================
// USER-FACING MESSAGES
// ============================================================================

export const MESSAGES = {
  /** Success message for form submission */
  SUCCESS: "Operation completed successfully",
  /** Error message for form submission */
  ERROR: "An error occurred. Please try again.",
  /** Loading message */
  LOADING: "Loading...",
  /** No data message */
  NO_DATA: "No data available",
} as const;
