/**
 * Design Tokens - Centralized design system for Band of Bakers
 * Ensures visual consistency across all pages and components
 */

export const DESIGN_TOKENS = {
  // Typography Scale
  typography: {
    // Headings - DM Serif Display (Premium serif for headings)
    h1: {
      size: "text-5xl sm:text-6xl md:text-7xl",
      weight: "font-bold",
      lineHeight: "leading-tight",
      family: "var(--font-dm-serif)",
      letterSpacing: "tracking-tight",
    },
    h2: {
      size: "text-4xl sm:text-5xl md:text-6xl",
      weight: "font-bold",
      lineHeight: "leading-tight",
      family: "var(--font-dm-serif)",
      letterSpacing: "tracking-tight",
    },
    h3: {
      size: "text-2xl sm:text-3xl md:text-4xl",
      weight: "font-bold",
      lineHeight: "leading-snug",
      family: "var(--font-dm-serif)",
      letterSpacing: "tracking-tight",
    },
    h4: {
      size: "text-xl sm:text-2xl",
      weight: "font-bold",
      lineHeight: "leading-snug",
      family: "var(--font-dm-serif)",
      letterSpacing: "tracking-tight",
    },
    h5: {
      size: "text-lg",
      weight: "font-semibold",
      lineHeight: "leading-snug",
      family: "var(--font-dm-serif)",
      letterSpacing: "tracking-tight",
    },
    // Body text - Inter (Clean sans-serif for body)
    body: {
      lg: {
        size: "text-base sm:text-lg",
        weight: "font-normal",
        lineHeight: "leading-relaxed",
      },
      base: {
        size: "text-sm sm:text-base",
        weight: "font-normal",
        lineHeight: "leading-relaxed",
      },
      sm: {
        size: "text-xs sm:text-sm",
        weight: "font-normal",
        lineHeight: "leading-relaxed",
      },
    },
    // Navigation text
    nav: {
      size: "text-sm",
      weight: "font-medium",
      lineHeight: "leading-normal",
      letterSpacing: "tracking-wide",
    },
    // Label text
    label: {
      size: "text-xs sm:text-sm",
      weight: "font-semibold",
      lineHeight: "leading-normal",
      letterSpacing: "tracking-wider",
    },
  },

  // Spacing System (8px base)
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Section Spacing
  sections: {
    padding: "py-24 px-4 sm:px-6 lg:px-8",
    paddingCompact: "py-16 px-4 sm:px-6 lg:px-8",
    gap: "gap-8",
    gapLarge: "gap-12",
  },

  // Visual Separators
  separators: {
    // Subtle divider between sections
    subtle: "border-t border-opacity-10",
    // Medium divider
    medium: "border-t border-opacity-20",
    // Strong divider
    strong: "border-t border-opacity-40",
    // Horizontal rule with spacing
    spacedRule: "my-12 border-t border-opacity-20",
  },

  // Card Styling
  cards: {
    base: "rounded-2xl overflow-hidden transition-all hover:shadow-lg",
    shadow: "shadow-sm hover:shadow-md",
    border: "border border-opacity-10",
    padding: "p-6",
  },

  // Button Styling
  buttons: {
    primary:
      "rounded-full px-8 py-3 text-lg font-semibold text-white transition-all hover:opacity-90",
    secondary: "rounded-lg px-6 py-2 font-medium transition-colors",
    small: "rounded-md px-4 py-2 text-sm font-medium transition-colors",
  },

  // Colors
  colors: {
    background: "var(--bg-warm)",
    text: {
      main: "var(--text-main)",
      muted: "rgba(44, 40, 37, 0.6)",
      light: "rgba(44, 40, 37, 0.4)",
    },
    accent: "var(--accent)",
    card: "var(--card-bg)",
    border: "rgba(44, 40, 37, 0.1)",
  },

  // Opacity Levels
  opacity: {
    full: 1,
    high: 0.95,
    medium: 0.75,
    low: 0.6,
    subtle: 0.4,
  },

  // Border Radius
  radius: {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "1rem",
    xl: "1.5rem",
    full: "9999px",
  },

  // Transitions
  transitions: {
    fast: "transition-all duration-200",
    normal: "transition-all duration-300",
    slow: "transition-all duration-500",
  },

  // Z-index Scale
  zIndex: {
    hide: "-10",
    base: "0",
    dropdown: "10",
    sticky: "20",
    fixed: "30",
    modal: "40",
    popover: "50",
    tooltip: "60",
  },
};

/**
 * Utility function to combine design tokens
 */
export function combineTokens(...tokens: (string | undefined)[]): string {
  return tokens.filter(Boolean).join(" ");
}

/**
 * Section divider styles for visual separation
 */
export const SECTION_DIVIDERS = {
  subtle: {
    className: "border-t border-opacity-10",
    style: {
      borderColor: "rgba(44, 40, 37, 0.1)",
    },
  },
  medium: {
    className: "border-t border-opacity-20",
    style: {
      borderColor: "rgba(44, 40, 37, 0.2)",
    },
  },
  strong: {
    className: "border-t border-opacity-40",
    style: {
      borderColor: "rgba(44, 40, 37, 0.4)",
    },
  },
};
