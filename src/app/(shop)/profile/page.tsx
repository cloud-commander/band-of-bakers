"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockCurrentUser } from "@/lib/mocks/users";
import { mockTestimonials } from "@/lib/mocks/testimonials";
import { mockReviews } from "@/lib/mocks/reviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Star, Pencil, Trash2, Upload, Quote } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { mockProducts } from "@/lib/mocks/products";

export const dynamic = "force-dynamic";

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^(\+44|0)\s?[0-9]{10}$/, "Please enter a valid UK phone number")
    .or(z.literal("")),
  avatar: z.string().url().optional().or(z.literal("")),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(mockCurrentUser.avatar_url || "");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
      phone: mockCurrentUser.phone || "",
      avatar: mockCurrentUser.avatar_url || "",
    },
  });

  // Filter content for current user
  const userTestimonials = mockTestimonials.filter((t) => t.user_id === mockCurrentUser.id);
  const userReviews = mockReviews.filter((r) => r.user_id === mockCurrentUser.id);

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/users/profile", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: mockCurrentUser.name,
      email: mockCurrentUser.email,
      phone: mockCurrentUser.phone || "",
      avatar: mockCurrentUser.avatar_url || "",
    });
    setAvatarPreview(mockCurrentUser.avatar_url || "");
  };

  const handleAvatarUpload = () => {
    // Mock upload
    const mockAvatars = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    ];
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setAvatarPreview(randomAvatar);
    setValue("avatar", randomAvatar);
    toast.success("Avatar uploaded successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="My Profile"
          description="Manage your account information and content"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
          actions={!isEditing && <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>}
        />

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="testimonials">My Testimonials</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-stone-100">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback
                      className={`${DESIGN_TOKENS.typography.h2.size}`}
                      style={{ color: DESIGN_TOKENS.colors.text.main }}
                    >
                      {getInitials(mockCurrentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={handleAvatarUpload}
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{mockCurrentUser.name}</h3>
                  <p className="text-stone-500 capitalize">{mockCurrentUser.role}</p>
                  {mockCurrentUser.email_verified && (
                    <p className="text-sm text-green-600 mt-1">✓ Email verified</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...register("name")} disabled={!isEditing} />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} disabled={true} />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      disabled={!isEditing}
                      placeholder="+44 7700 900000"
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  My Testimonials
                </Heading>
                <p className="text-sm text-muted-foreground mt-2">
                  {userTestimonials.length} testimonial{userTestimonials.length !== 1 && "s"}
                </p>
              </CardHeader>
              <CardContent>
                {userTestimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <Quote className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                    <p className="text-muted-foreground">
                      You haven&apos;t submitted any testimonials yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTestimonials.map((testimonial) => (
                      <div key={testimonial.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-stone-700">{testimonial.quote}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(testimonial.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  My Product Reviews
                </Heading>
                <p className="text-sm text-muted-foreground mt-2">
                  {userReviews.length} review{userReviews.length !== 1 && "s"}
                </p>
              </CardHeader>
              <CardContent>
                {userReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                    <p className="text-muted-foreground">
                      You haven&apos;t reviewed any products yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReviews.map((review) => {
                      const product = mockProducts.find((p) => p.id === review.product_id);
                      return (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            {product?.image_url && (
                              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium">
                                    {product?.name || "Unknown Product"}
                                  </p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400 text-amber-400"
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              {review.title && (
                                <p className="font-medium text-sm mb-1">{review.title}</p>
                              )}
                              <p className="text-stone-700 text-sm">{review.comment}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(review.created_at).toLocaleDateString()}
                                {review.status !== "approved" && (
                                  <span className="ml-2 text-amber-600">• Pending approval</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
