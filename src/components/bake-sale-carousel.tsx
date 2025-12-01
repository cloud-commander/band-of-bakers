"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Calendar, Clock3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BakeSaleCarouselProps {
  bakeSales: Array<{
    id: string;
    date: string;
    location: {
      name: string;
      collection_hours?: string | null;
    };
  }>;
}

export function BakeSaleCarousel({ bakeSales }: BakeSaleCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const clampedVisible = 1; // show one at a time
  const [isHovering, setIsHovering] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides = useMemo(() => bakeSales ?? [], [bakeSales]);
  const canPrev = startIndex > 0;
  const canNext = startIndex + clampedVisible < slides.length;
  const visibleSlides = slides.slice(startIndex, startIndex + clampedVisible);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <Clock3 className="h-4 w-4 text-bakery-amber-700" />
          <span>Pick your next bake date</span>
        </div>
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
      </div>

      <div className="rounded-xl border border-stone-200/70 bg-white/70 shadow-sm p-3 sm:p-4">
        <div className="relative space-y-4 sm:space-y-5">
          <div
            className="absolute left-[11px] top-4 bottom-4 w-px bg-bakery-amber-100"
            aria-hidden
          />
          {visibleSlides.map((bakeSale, idx) => (
            <div key={bakeSale.id} className="relative pl-8">
              <span
                className={cn(
                  "absolute left-0 top-4 h-3 w-3 rounded-full border-2 border-white shadow-sm",
                  "bg-bakery-amber-600"
                )}
                aria-hidden
              />
              <Link href={`/menu?bakeSale=${bakeSale.id}`} className="block group">
                <Card className="border border-stone-200/90 transition-all duration-200 group-hover:-translate-y-[2px] group-hover:shadow-md bg-gradient-to-br from-white via-bakery-amber-50/40 to-white">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-[0.08em] text-stone-500">
                          Bake sale {startIndex + idx + 1} of {slides.length}
                        </span>
                        <CardTitle className="text-lg flex items-center gap-2 text-bakery-amber-800 group-hover:text-bakery-amber-900 transition-colors">
                          <Calendar className="w-5 h-5" />
                          <span className="rounded-md px-2 py-1 bg-bakery-amber-50 text-bakery-amber-900">
                            {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap text-sm text-stone-700">
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="w-4 h-4 text-bakery-amber-700" />
                        <span>{bakeSale.location.name}</span>
                      </div>
                      <div className="rounded-md border border-bakery-amber-100 bg-white/70 px-3 py-1 text-xs font-semibold text-bakery-amber-900">
                        {bakeSale.location.collection_hours || "Hours shared at checkout"}
                      </div>
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
              "h-2 w-8 rounded-full transition-all",
              idx === startIndex
                ? "bg-bakery-amber-700 shadow-sm"
                : "bg-stone-300 hover:bg-stone-400"
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
