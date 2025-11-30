"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createTestimonial } from "@/actions/testimonials";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial must be less than 500 characters"),
  rating: z.number().min(1).max(5),
});

type FormValues = z.infer<typeof formSchema>;

export function SubmitTestimonialDialog() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: 5,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!session?.user) {
      toast.error("You must be logged in to submit a testimonial");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", session.user.name || "Anonymous");
      formData.append("role", "Customer"); // Default role
      formData.append("content", data.content);
      formData.append("rating", String(data.rating));
      formData.append("status", "pending"); // Always pending for user submissions
      formData.append("avatar", session.user.image || "");

      const result = await createTestimonial(formData);

      if (result.success) {
        toast.success("Testimonial submitted for approval!");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to submit testimonial");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-8">
          Submit Your Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Testimonial</DialogTitle>
          <DialogDescription>
            Share your experience with us. Your testimonial will be reviewed before publishing.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative">
            {form.formState.isSubmitting && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md">
                <p className="text-sm text-muted-foreground">Submitting...</p>
              </div>
            )}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => field.onChange(star)}
                          className="focus:outline-none transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= field.value
                                ? "fill-yellow-400 text-yellow-500"
                                : "text-stone-300"
                            }`}
                            role="radio"
                            aria-checked={star === field.value}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                field.onChange(star);
                              }
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel aria-live="polite">Your Review</FormLabel>
                  <FormControl>
                    <div className="space-y-1">
                      <Textarea
                        placeholder="Tell us what you liked..."
                        className="resize-none"
                        maxLength={500}
                        {...field}
                      />
                      <div className="text-xs text-muted-foreground text-right" aria-live="polite">
                        {field.value.length}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
