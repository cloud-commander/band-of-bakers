"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Star, Pencil, Trash2, Quote } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { updateProfile } from "@/actions/profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReviewWithUser } from "@/lib/repositories/review.repository";
import { Testimonial } from "@/db/schema";

// Profile update validation schema
const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^(\+44|0)\s?[0-9]{10}$/, "Please enter a valid UK phone number")
    .or(z.literal("")),
  avatar: z.any().optional(), // Allow file or string
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

interface ProfileClientProps {
  initialReviews: ReviewWithUser[];
  initialTestimonials: Testimonial[];
}

export function ProfileClient({ initialReviews, initialTestimonials }: ProfileClientProps) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  // Extended user type to include custom fields
  interface ExtendedUser {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    phone?: string;
    role?: string;
    emailVerified?: boolean;
  }

  const user = session?.user as ExtendedUser | undefined;

  const profile = {
    id: user?.id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "customer",
    image: user?.image || "",
    email_verified: user?.emailVerified || false,
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      avatar: profile.image || "",
    },
  });

  // Update form defaults when session loads
  useEffect(() => {
    if (profile.id) {
      reset({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        avatar: profile.image || "",
      });
    }
  }, [profile.id, profile.name, profile.email, profile.phone, profile.image, reset]);

  const onSubmit = async (data: ProfileUpdateForm) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone || "");
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const result = await updateProfile(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      await updateSession(); // Refresh session to get new avatar
      router.refresh(); // Refresh server components

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
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      avatar: profile.image || "",
    });
    setSelectedFile(null);
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
                  <AvatarUpload
                    name={profile.name || "User"}
                    currentAvatarUrl={profile.image}
                    onAvatarChange={setSelectedFile}
                    variant="overlay"
                    size="lg"
                    className={!isEditing ? "pointer-events-none" : ""}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{profile.name}</h3>
                  <p className="text-stone-500 capitalize">{profile.role || "Customer"}</p>
                  {profile.email_verified && (
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
                  {initialTestimonials.length} testimonial{initialTestimonials.length !== 1 && "s"}
                </p>
              </CardHeader>
              <CardContent>
                {initialTestimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <Quote className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                    <p className="text-muted-foreground">
                      You haven&apos;t submitted any testimonials yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {initialTestimonials.map((testimonial) => (
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
                        <p className="text-stone-700">{testimonial.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(testimonial.created_at).toLocaleDateString()}
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
                  {initialReviews.length} review{initialReviews.length !== 1 && "s"}
                </p>
              </CardHeader>
              <CardContent>
                {initialReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                    <p className="text-muted-foreground">
                      You haven&apos;t reviewed any products yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {initialReviews.map((review) => {
                      return (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            {review.product_image_url && (
                              <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={review.product_image_url}
                                  alt={review.product_name || "Product"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium">
                                    {review.product_name || "Unknown Product"}
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
