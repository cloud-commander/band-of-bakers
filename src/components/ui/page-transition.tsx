"use client";

import { ReactNode, useMemo } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const EASING: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const transition = useMemo(
    () => ({
      duration: prefersReducedMotion ? 0 : 0.24,
      ease: EASING,
    }),
    [prefersReducedMotion]
  );

  const variants = prefersReducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      };

  return (
    <AnimatePresence mode="wait" initial>
      <m.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className={cn("relative will-change-[transform,opacity]", className)}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}
