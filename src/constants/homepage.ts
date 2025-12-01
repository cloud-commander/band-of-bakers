/**
 * Homepage Constants
 * Static content for the homepage hero and featured sections
 */

// ============================================================================
// HERO SECTION
// ============================================================================

export const HERO_SECTION = {
  /** Hero background image URL */
  backgroundImage: "/images/hero/workspace-hero.webp",
  /** Hero background image alt text */
  backgroundAlt: "Artisan Bakery Workspace",
  /** Hero main heading */
  heading: "Fresh. Local. Out of the Oven",
  /** Hero subheading/description */
  description:
    "Small-batch artisan bread free from additives. The way bread was meant to be eaten.",
  /** Hero CTA button text */
  ctaText: "Pre-Order Now ",
  /** Hero CTA button link */
  ctaLink: "#bakes",
} as const;

// ============================================================================
// SIGNATURE BAKES SECTION
// ============================================================================

export const SIGNATURE_BAKES_SECTION = {
  /** Section heading */
  heading: "Signature Bakes",
  /** Section subheading */
  subheading: "Handcrafted with love and precision",
} as const;

// ============================================================================
// STORY SECTION
// ============================================================================

export const STORY_SECTION = {
  /** Section heading */
  heading: "The Alchemy of Baking",
  /** Section main text */
  mainText:
    "For over 10 years, Band of Bakers has been a fixture in our community. We believe in slow fermentation, local sourcing, and the kind of craftsmanship that can't be rushed. Every loaf that leaves our kitchen carries the warmth of family tradition and the precision of modern technique.",
  /** Section tagline */
  tagline: "This is the village kitchen. This is Band of Bakers.",
} as const;

// ============================================================================
// CTA SECTION
// ============================================================================

export const CTA_SECTION = {
  /** Section heading */
  heading: "Ready to Order?",
  /** Section description */
  description: "Reserve your fresh loaves today. Available for pickup.",
  /** CTA button text */
  ctaText: "Pre-Order Now",
  /** CTA button link */
  ctaLink: "\Menu",
} as const;

// ============================================================================
// FOOTER
// ============================================================================

export const FOOTER = {
  /** Copyright year (dynamic) */
  copyrightYear: new Date().getFullYear(),
  /** Copyright text */
  copyrightText: "Band of Bakers. All rights reserved.",
} as const;
