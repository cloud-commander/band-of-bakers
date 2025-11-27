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
      formData.append("status", "inactive"); // Always inactive for user submissions
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                ? "fill-bakery-amber-400 text-bakery-amber-400"
                                : "text-stone-300"
                            }`}
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
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us what you liked..."
                      className="resize-none"
                      {...field}
                    />
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
