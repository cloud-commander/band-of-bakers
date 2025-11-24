import { SECTION_DIVIDERS } from "@/lib/design-tokens";

interface SectionDividerProps {
  variant?: "subtle" | "medium" | "strong";
  className?: string;
}

/**
 * Section Divider Component
 * Provides consistent visual separation between major page sections
 * Supports three intensity levels for design flexibility
 */
export function SectionDivider({ variant = "subtle", className = "" }: SectionDividerProps) {
  const divider = SECTION_DIVIDERS[variant];

  return (
    <div
      className={`${divider.className} ${className}`}
      style={divider.style}
      role="separator"
      aria-hidden="true"
    />
  );
}
