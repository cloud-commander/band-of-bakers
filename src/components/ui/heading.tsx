import React from "react";
import { cn } from "@/lib/utils";

type HeadingProps = {
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
};

export function Heading({ level, children, className }: HeadingProps) {
  const styles = {
    1: "font-serif text-4xl md:text-6xl font-bold tracking-tight text-stone-850 mb-6 leading-[1.1]",
    2: "font-serif text-3xl md:text-4xl font-semibold tracking-tight text-stone-850 mb-4 leading-[1.2]",
    3: "font-serif text-2xl font-medium text-stone-850 mb-2 leading-[1.2]",
    4: "font-sans text-lg font-bold uppercase tracking-widest text-stone-600 mb-1",
  };

  const Tag = `h${level}` as React.ElementType;

  return <Tag className={cn(styles[level], "antialiased", className)}>{children}</Tag>;
}
