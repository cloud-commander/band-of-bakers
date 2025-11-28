"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import { ANIMATION_DURATIONS } from "@/lib/constants/frontend";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: ANIMATION_DURATIONS.FADE_IN, delay }}
      viewport={{ once: true }}
    >
      {children}
    </m.div>
  );
}
