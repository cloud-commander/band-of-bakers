/**
 * Homepage Mock Data
 * Mock data specifically for the homepage hero and featured sections
 */

// ============================================================================
// FEATURED BAKES
// ============================================================================

export interface FeaturedBake {
  id: number;
  name: string;
  description: string;
  image: string;
}

export const mockFeaturedBakes: FeaturedBake[] = [
  {
    id: 1,
    name: "Sourdough",
    description: "Classic artisan loaf",
    image: "https://picsum.photos/600/600?random=1",
  },
  {
    id: 2,
    name: "Croissant",
    description: "Buttery layers of perfection",
    image: "https://picsum.photos/600/600?random=2",
  },
  {
    id: 3,
    name: "Focaccia",
    description: "Herb-infused Italian classic",
    image: "https://picsum.photos/600/600?random=3",
  },
];

// ============================================================================
// HERO SECTION
// ============================================================================

export const HERO_SECTION = {
  /** Hero background image URL */
  backgroundImage: "https://picsum.photos/1400/900?random=hero",
  /** Hero background image alt text */
  backgroundAlt: "Baker's hands kneading dough",
  /** Hero main heading */
  heading: "Baking for the Village since 1998.",
  /** Hero subheading/description */
  description:
    "Every loaf tells a story. We use traditional methods, local grains, and time to create bread that nourishes both body and soul. This is more than baking—it's a commitment to craft.",
  /** Hero CTA button text */
  ctaText: "Explore Our Bakes",
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
  subheading: "Handcrafted daily with love and precision",
} as const;

// ============================================================================
// STORY SECTION
// ============================================================================

export const STORY_SECTION = {
  /** Section heading */
  heading: "Real Hands, Real Flour.",
  /** Section main text */
  mainText:
    "For over 25 years, Band of Bakers has been a fixture in our community. We believe in slow fermentation, local sourcing, and the kind of craftsmanship that can't be rushed. Every loaf that leaves our kitchen carries the warmth of family tradition and the precision of modern technique.",
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
  description:
    "Reserve your fresh loaves today. Available for pickup or delivery.",
  /** CTA button text */
  ctaText: "Order Online",
  /** CTA button link */
  ctaLink: "#",
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
