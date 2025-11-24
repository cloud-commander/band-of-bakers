import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComponentType } from "react";

type LucideComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

interface FlourIconProps {
  // Accept either the icon component itself (client-only) or a serializable icon name (string)
  icon: string | LucideComponent;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  variant?: "wheat" | "time" | "award" | "leaf" | "default";
  className?: string;
}

export function FlourIcon({
  icon,
  size = "md",
  active = false,
  variant = "default",
  className,
}: FlourIconProps) {
  // Resolve icon when a string is provided (use lucide-react export map)
  const IconComponent: LucideComponent =
    typeof icon === "string"
      ? // fallback to Package if not found
        (Icons as unknown as Record<string, LucideComponent>)[icon] || Icons.Package
      : (icon as LucideComponent);
  const config = {
    sm: { wrapper: "w-8 h-8", icon: "w-4 h-4", stroke: 2 },
    md: { wrapper: "w-12 h-12", icon: "w-6 h-6", stroke: 2 },
    lg: { wrapper: "w-16 h-16", icon: "w-8 h-8", stroke: 2 },
  };

  const colorMap = {
    wheat: "text-bakery-amber-700",
    time: "text-stone-700",
    award: "text-yellow-600",
    leaf: "text-emerald-700",
    default: "text-bakery-amber-800",
  };

  const { wrapper, icon: iconClass, stroke } = config[size];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-500 ease-out",
        "bg-gradient-to-br from-stone-50 to-stone-100",
        "border-2 border-stone-200",
        "shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.08)]",
        "hover:scale-110 hover:-rotate-2",
        "hover:shadow-[0_4px_16px_rgba(251,191,36,0.15)]",
        active &&
          "shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] bg-bakery-amber-50 border-bakery-amber-100 ring-2 ring-bakery-amber-100",
        wrapper,
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.015) 2px,
          rgba(0,0,0,0.015) 4px
        )`,
      }}
    >
      <IconComponent className={cn(colorMap[variant], iconClass)} strokeWidth={stroke} />
    </div>
  );
}
