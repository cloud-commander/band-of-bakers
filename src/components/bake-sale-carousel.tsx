"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BakeSaleCarouselProps {
  bakeSales: Array<{
    id: string;
    date: string;
    location: {
      name: string;
    };
  }>;
  maxVisible?: number;
}

export function BakeSaleCarousel({ bakeSales, maxVisible = 3 }: BakeSaleCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const clampedVisible = Math.max(1, Math.min(maxVisible, 3));
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => bakeSales ?? [], [bakeSales]);
  const canPrev = startIndex > 0;
  const canNext = startIndex + clampedVisible < slides.length;

  const handlePrev = useCallback(() => {
    if (canPrev) setStartIndex((prev) => Math.max(0, prev - 1));
  }, [canPrev]);

  const handleNext = useCallback(() => {
    if (canNext) setStartIndex((prev) => Math.min(slides.length - clampedVisible, prev + 1));
  }, [canNext, slides.length, clampedVisible]);

  // Auto-advance (pause on hover)
  useEffect(() => {
    if (isHovering || slides.length <= clampedVisible || !autoPlay) return;
    const timer = setInterval(() => {
      setStartIndex((prev) =>
        prev + clampedVisible >= slides.length
          ? 0
          : Math.min(prev + 1, slides.length - clampedVisible)
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovering, slides.length, clampedVisible, autoPlay]);

  // Basic touch swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let deltaX = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      deltaX = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) handleNext();
        else handlePrev();
      }
      startX = 0;
      deltaX = 0;
    };

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleNext, handlePrev]);

  return (
    <div
      className="space-y-4"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous bake sale"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next bake sale"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setAutoPlay((prev) => !prev)}
          aria-label={autoPlay ? "Pause carousel" : "Play carousel"}
        >
          <span className="text-xs">{autoPlay ? "II" : "►"}</span>
        </Button>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300"
          style={{
            transform: `translateX(-${(startIndex * 100) / clampedVisible}%)`,
            width: `${(slides.length * 100) / clampedVisible}%`,
          }}
        >
          {slides.map((bakeSale) => (
            <div
              key={bakeSale.id}
              className="w-full"
              style={{ flex: `0 0 ${100 / clampedVisible}%` }}
            >
              <Link href={`/menu?bakeSale=${bakeSale.id}`} className="block h-full group">
                <Card className="h-full text-center hover:shadow-lg transition-all cursor-pointer border border-transparent group-hover:border-bakery-amber-200 focus-within:ring-2 focus-within:ring-bakery-amber-200 focus-within:ring-offset-2 group-hover:scale-[1.01]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-center gap-2 transition-colors text-bakery-amber-800 group-hover:text-bakery-amber-900">
                      <Calendar className="w-5 h-5" />
                      {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
                      <MapPin className="w-4 h-4" />
                      <span>{bakeSale.location.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2" aria-label="Bake sale slide indicators">
        {Array.from({ length: Math.max(1, slides.length - clampedVisible + 1) }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors",
              idx === startIndex ? "bg-bakery-amber-600" : "bg-stone-300"
            )}
            aria-label={`Show slides ${idx + 1} to ${idx + clampedVisible}`}
            aria-current={idx === startIndex ? "true" : undefined}
            onClick={() => setStartIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
}
