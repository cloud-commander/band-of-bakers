"use client";

import { useState, useEffect, useCallback } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { m, AnimatePresence } from "framer-motion";
import { Testimonial } from "@/db/schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitTestimonialDialog } from "@/components/testimonials/submit-testimonial-dialog";

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = useCallback(() => {
    if (!testimonials || testimonials.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials]);

  const prevTestimonial = () => {
    if (!testimonials || testimonials.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const timer = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => clearInterval(timer);
  }, [nextTestimonial, testimonials]);

  // If no testimonials, show a gentle placeholder
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`${DESIGN_TOKENS.cards.base} p-8 md:p-12 text-center`}>
        <p className="text-muted-foreground mb-4">No testimonials yet.</p>
        <SubmitTestimonialDialog />
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative">
      <div className={`${DESIGN_TOKENS.cards.base} p-8 md:p-12 relative overflow-hidden`}>
        {/* Quote Icon */}
        <Quote className="absolute top-4 right-4 text-primary/10" size={80} strokeWidth={1.5} />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <m.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="relative z-10"
          >
            {/* Rating */}
            <div className="flex justify-center mb-6">
              <StarRating rating={currentTestimonial.rating} size={24} />
            </div>

            {/* Quote */}
            <blockquote className="text-center mb-8">
              <p
                className={`${DESIGN_TOKENS.typography.body.lg.size} italic text-foreground leading-relaxed max-w-3xl mx-auto`}
              >
                &ldquo;{currentTestimonial.content}&rdquo;
              </p>
            </blockquote>

            {/* Author */}
            <div className="flex flex-col items-center text-center">
              {currentTestimonial.avatar_url && (
                <Avatar className="w-16 h-16 mb-4 border-2 border-background shadow-sm">
                  <AvatarImage src={currentTestimonial.avatar_url} alt={currentTestimonial.name} />
                  <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
              {currentTestimonial.role && (
                <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
              )}
            </div>
          </m.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Submit Testimonial Dialog */}
        <div className="flex justify-center mt-8">
          <SubmitTestimonialDialog />
        </div>
      </div>
    </div>
  );
}
