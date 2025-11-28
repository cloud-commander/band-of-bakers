"use client";

import { m } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <m.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="inline-block">
      <Button ref={ref} {...props} />
    </m.div>
  );
});

AnimatedButton.displayName = "AnimatedButton";
