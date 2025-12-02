"use client";

import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { ANIMATION_DURATIONS } from "@/lib/constants/frontend";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}

const DEFAULT_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0 : ANIMATION_DURATIONS.FADE_IN,
        delay: prefersReducedMotion ? 0 : delay,
        ease: DEFAULT_EASE,
      }}
      viewport={prefersReducedMotion ? undefined : { once: true }}
    >
      {children}
    </m.div>
  );
}
