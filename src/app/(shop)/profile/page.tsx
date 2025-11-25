"use client";

import { useState } from "react";
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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockCurrentUser.name,
    email: mockCurrentUser.email,
    phone: mockCurrentUser.phone || "",
    avatar: mockCurrentUser.avatar_url || "",
  });

  // Filter content for current user
  const userTestimonials = mockTestimonials.filter((t) => t.user_id === mockCurrentUser.id);
  const userReviews = mockReviews.filter((r) => r.user_id === mockCurrentUser.id);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleAvatarUpload = () => {
    // Mock upload
    const mockAvatars = [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    ];
    const randomAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setFormData({ ...formData, avatar: randomAvatar });
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
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback
                      className={`${DESIGN_TOKENS.typography.h2.size}`}
                      style={{ color: DESIGN_TOKENS.colors.text.main }}
                    >
                      {getInitials(formData.name)}
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
                  <h3 className="text-xl font-bold text-stone-900">{formData.name}</h3>
                  <p className="text-stone-500 capitalize">{mockCurrentUser.role}</p>
                  {mockCurrentUser.email_verified && (
                    <p className="text-sm text-green-600 mt-1">✓ Email verified</p>
                  )}
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} disabled={true} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: mockCurrentUser.name,
                          email: mockCurrentUser.email,
                          phone: mockCurrentUser.phone || "",
                          avatar: mockCurrentUser.avatar_url || "",
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-lg font-medium mt-1">
                    {new Date(mockCurrentUser.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-medium mt-1">
                    {new Date(mockCurrentUser.updated_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Heading level={3} className="mb-0">
                    My Testimonials
                  </Heading>
                  <Button size="sm">Add Testimonial</Button>
                </div>
              </CardHeader>
              <CardContent>
                {userTestimonials.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Quote className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven&apos;t submitted any testimonials yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating
                                      ? "fill-bakery-amber-400 text-bakery-amber-400"
                                      : "text-stone-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(testimonial.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-stone-600 italic">&quot;{testimonial.quote}&quot;</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4 text-stone-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
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
                  My Reviews
                </Heading>
              </CardHeader>
              <CardContent>
                {userReviews.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven&apos;t reviewed any products yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReviews.map((review) => {
                      const product = mockProducts.find((p) => p.id === review.product_id);
                      return (
                        <div
                          key={review.id}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          {product?.image_url && (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 bg-stone-100">
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-stone-900">
                                {product?.name || "Unknown Product"}
                              </h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  review.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : review.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {review.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < review.rating
                                        ? "fill-bakery-amber-400 text-bakery-amber-400"
                                        : "text-stone-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-stone-600">{review.comment}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="w-4 h-4 text-stone-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
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
