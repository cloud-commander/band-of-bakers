"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FlourIcon } from "@/components/ui/flour-icon";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string; // Changed from LucideIcon to string for serialization
  variant: "wheat" | "time" | "award" | "leaf" | "default";
  trend?: {
    value: number;
    label: string;
  };
  href?: string;
}

export function KPICard({ title, value, icon, variant, trend }: KPICardProps) {
  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;

  return (
    <Card className="hover:shadow-md transition-all duration-300 border border-stone-200 hover:border-bakery-amber-200 group">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-bakery-amber-700 transition-colors">
          {title}
        </h3>
        <FlourIcon icon={icon} size="sm" variant={variant} />
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-serif font-bold text-stone-800">{value}</div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {isPositive && <TrendingUp className="w-3 h-3 text-emerald-600" />}
              {isNegative && <TrendingDown className="w-3 h-3 text-red-600" />}
              <span
                className={cn(
                  "font-medium",
                  isPositive && "text-emerald-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-muted-foreground"
                )}
              >
                {isPositive && "+"}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
