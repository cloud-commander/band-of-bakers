/**
 * Homepage Constants
 * Static content for the homepage hero and featured sections
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

export const FEATURED_BAKES: FeaturedBake[] = [
  {
    id: 1,
    name: "Sourdough",
    description: "Classic artisan loaf",
    image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=600&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "Croissant",
    description: "Buttery layers of perfection",
    image:
      "https://images.pexels.com/photos/160802/pexels-photo-160802.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
  },
  {
    id: 3,
    name: "Focaccia",
    description: "Herb-infused Italian classic",
    image:
      "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=600&fit=crop&auto=format",
  },
];

// ============================================================================
// HERO SECTION
// ============================================================================

export const HERO_SECTION = {
  /** Hero background image URL */
  backgroundImage: "/images/hero/workspace-hero.jpg",
  /** Hero background image alt text */
  backgroundAlt: "Artisan Bakery Workspace",
  /** Hero main heading */
  heading: "Baking for the Village since 2012.",
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
