"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Form validation schema (simplified for admin form - we'll add user_id server-side)
const testimonialFormSchema = z.object({
  content: z
    .string()
    .min(10, "Testimonial must be at least 10 characters")
    .max(500, "Testimonial is too long"),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  // These fields are for display purposes (we'll extract from user in real implementation)
  name: z.string().min(1, "Customer name is required"),
  role: z.string().min(1, "Role/title is required"),
  avatar: z.string().url().optional().or(z.literal("")),
});

type TestimonialForm = z.infer<typeof testimonialFormSchema>;

export default function NewTestimonialPage() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      role: "",
      content: "",
      rating: 5,
      avatar: "",
    },
  });

  const onSubmit = async (data: TestimonialForm) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/testimonials", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     user_id: currentUser.id,
      //     content: data.content,
      //     rating: data.rating,
      //   }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Testimonial created successfully!");
      router.push("/admin/testimonials");
    } catch (error) {
      toast.error("Failed to create testimonial", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  // Mock image upload
  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload to R2
    const mockAvatars = [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    ];
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setAvatarUrl(randomAvatar);
    setValue("avatar", randomAvatar);
    toast.success("Image uploaded successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Testimonial"
        description="Create a new customer testimonial"
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
                    <Label htmlFor="role">
                      Role / Title <span className="text-red-600">*</span>
                    </Label>
                    <Input id="role" {...register("role")} placeholder="e.g. Food Blogger" />
                    {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
                  </div>
                </div>

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
                  {errors.rating && <p className="text-sm text-red-600">{errors.rating.message}</p>}
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

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-stone-200">
              <CardContent className="p-6 space-y-4">
                <Label>Customer Avatar</Label>
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg p-6 hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={handleImageUpload}
                >
                  {avatarUrl ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                      <Image src={avatarUrl} alt="Avatar preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-stone-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-stone-600">
                    {avatarUrl ? "Click to change" : "Click to upload avatar"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Testimonial
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
