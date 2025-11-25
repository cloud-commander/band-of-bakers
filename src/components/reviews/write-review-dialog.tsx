"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { TurnstileWidget } from "@/components/turnstile/turnstile-widget";
import { verifyTurnstileToken } from "@/lib/actions/verify-turnstile";

export function WriteReviewDialog() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // Verify Turnstile token if configured
    if (turnstileToken) {
      setIsSubmitting(true);
      const verification = await verifyTurnstileToken(turnstileToken);

      if (!verification.success) {
        toast.error("Verification failed", {
          description: verification.error || "Please try again",
        });
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }

    setOpen(false);
    toast.success("Review submitted", {
      description: "Thank you for your feedback! Your review is pending approval.",
    });
    setRating(0);
    setTurnstileToken(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about this product with other customers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-6 h-6",
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground/30 fill-none"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Review title" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Review</Label>
            <Textarea id="comment" placeholder="Tell us what you liked or disliked..." required />
          </div>

          {/* Cloudflare Turnstile Widget */}
          <TurnstileWidget
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => {
              setTurnstileToken(null);
              toast.error("Verification widget error");
            }}
            onExpire={() => {
              setTurnstileToken(null);
              toast.error("Verification expired", {
                description: "Please refresh and try again",
              });
            }}
            theme="light"
            size="normal"
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
