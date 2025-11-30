"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import type { Testimonial } from "@/db/schema";
import { updateTestimonial } from "@/actions/testimonials";

const editSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  role: z.string().optional(),
  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial is too long"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  status: z.enum(["pending", "approved", "rejected"]),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditTestimonialFormProps {
  testimonial: Testimonial;
}

export function EditTestimonialForm({ testimonial }: EditTestimonialFormProps) {
  const router = useRouter();

  const safeStatus =
    testimonial.status === "approved" ||
    testimonial.status === "pending" ||
    testimonial.status === "rejected"
      ? testimonial.status
      : "pending";

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: testimonial.name,
      role: testimonial.role ?? "",
      content: testimonial.content,
      rating: testimonial.rating ?? 5,
      status: safeStatus,
    },
  });

  const onSubmit = async (data: EditFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("role", data.role || "");
      formData.append("content", data.content);
      formData.append("rating", data.rating.toString());
      formData.append("status", data.status);

      const result = await updateTestimonial(testimonial.id, formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Testimonial updated");
      router.push("/admin/testimonials");
    } catch (error) {
      toast.error("Failed to update testimonial", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Testimonial"
        description="Update the testimonial content, rating, and status"
        actions={
          <Link href="/admin/testimonials">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-stone-200">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Customer Name <span className="text-red-600">*</span>
                    </Label>
                    <Input id="name" {...register("name")} placeholder="e.g. Sarah Johnson" />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Title</Label>
                    <Input id="role" {...register("role")} placeholder="e.g. Food Blogger" />
                    {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">
                      Rating <span className="text-red-600">*</span>
                    </Label>
                    <Controller
                      name="rating"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.rating && (
                      <p className="text-sm text-red-600">{errors.rating.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">
                      Status <span className="text-red-600">*</span>
                    </Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Testimonial Quote <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    {...register("content")}
                    placeholder="Enter the customer's feedback..."
                    className="min-h-[150px]"
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
