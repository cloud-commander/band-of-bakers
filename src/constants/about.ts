/**
 * About Page Constants
 * Centralized content for the About page including team, values, and how we work
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  favorite: string;
  bio: string;
  image: string;
}

export interface Value {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  number: number;
}

// ============================================================================
// HERO SECTION
// ============================================================================

export const ABOUT_HERO_SECTION = {
  heading: "Our Story",
  description:
    "A family tradition of artisan baking, passed down through generations and baked with love in the heart of Shropshire.",
  backgroundImage: "/images/hero/about-hero-v2.jpg",
  backgroundAlt: "Artisan bakery workspace",
} as const;

// ============================================================================
// STORY SECTION
// ============================================================================

export const ABOUT_STORY_SECTION = {
  heading: "Baking with Passion Since Day One",
  paragraphs: [
    "Band of Bakers started as a dream in our home kitchen—a vision to bring authentic, handcrafted bread to our local community. What began with a single sourdough starter has grown into a beloved bakery that serves fresh, artisan baked goods throughout Shropshire.",
    "We believe in the simple pleasures of real bread: the aroma of a fresh loaf, the satisfying crunch of a perfectly baked crust, and the soft, airy crumb that comes from time, patience, and traditional techniques. Every product we make is a labor of love, crafted by hand using the finest local ingredients.",
  ],
} as const;

// ============================================================================
// TEAM SECTION
// ============================================================================

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Jon Philips",
    role: "Head Baker & Founder",
    favorite: "Sourdough Country Loaf",
    bio: "Jon is the heart and soul of Band of Bakers. With over 15 years of baking experience and a passion for traditional fermentation methods, he's dedicated to bringing authentic artisan bread to Shropshire. When he's not perfecting his sourdough starter, Jon loves experimenting with new grain blends and sharing his knowledge with the community.",
    image: "/images/team/jon.webp",
  },
  {
    id: "team-2",
    name: "Mike Deeble",
    role: "Manager & Founder",
    favorite: "Almond Croissant",
    bio: "Mike is the strategic mind behind Band of Bakers, ensuring every bake sale runs smoothly and every customer has a delightful experience. With a background in hospitality and a love for quality food, Mike combines operational excellence with genuine care for the business and its community. He's passionate about supporting local suppliers and sustainable practices.",
    image: "/images/team/mike.webp",
  },
];

export const ABOUT_TEAM_SECTION = {
  heading: "Meet the Team",
  members: TEAM_MEMBERS,
} as const;

// ============================================================================
// VALUES SECTION
// ============================================================================

export const VALUES: Value[] = [
  {
    id: "value-1",
    title: "Traditional Methods",
    description:
      "We use time-honored baking techniques, including long fermentation and natural starters, to create bread with superior flavor and texture.",
  },
  {
    id: "value-2",
    title: "Local Ingredients",
    description:
      "We source our flour, dairy, and produce from trusted local suppliers, supporting our community and ensuring the freshest ingredients.",
  },
  {
    id: "value-3",
    title: "Made to Order",
    description:
      "Every bake sale features fresh batches made specifically for your order, ensuring you receive our products at their absolute best.",
  },
];

export const ABOUT_VALUES_SECTION = {
  heading: "What We Stand For",
  values: VALUES,
} as const;

// ============================================================================
// HOW WE WORK SECTION
// ============================================================================

export const HOW_WE_WORK_STEPS: ProcessStep[] = [
  {
    id: "step-1",
    number: 1,
    title: "Browse our menu",
    description: "and select your favorite baked goods",
  },
  {
    id: "step-2",
    number: 2,
    title: "Choose a bake sale date",
    description: "that works for you",
  },
  {
    id: "step-3",
    number: 3,
    title: "Place your order",
    description: "before the cutoff date (typically 2 days before)",
  },
  {
    id: "step-4",
    number: 4,
    title: "We bake fresh",
    description: "based on confirmed orders",
  },
  {
    id: "step-5",
    number: 5,
    title: "Collect or receive delivery",
    description: "on your chosen bake sale day",
  },
];

export const ABOUT_HOW_WE_WORK_SECTION = {
  heading: "How Our Bake Sales Work",
  introText:
    "We operate through a unique bake sale model that allows us to guarantee freshness and reduce waste. Here's how it works:",
  steps: HOW_WE_WORK_STEPS,
  closingText:
    "This approach means every loaf, pastry, and cake is made specifically for you, ensuring maximum freshness and allowing us to minimize waste while supporting sustainable practices.",
} as const;

// ============================================================================
// LOCATION SECTION
// ============================================================================

export const ABOUT_LOCATION_SECTION = {
  heading: "Find Us in Shropshire",
  description:
    "We serve the communities of Cressage and Shrewsbury, and Telford through our regular bake sales. Follow us on social media to stay updated on our schedule and special offerings.",
} as const;

// ============================================================================
// CTA SECTION
// ============================================================================

export const ABOUT_CTA_SECTION = {
  heading: "Ready to Try Our Bakes?",
  description: "Browse our menu and place your order for the next bake sale.",
  ctaText: "View Our Menu",
  ctaLink: "/menu",
} as const;
