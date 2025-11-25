"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewTestimonialPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    rating: "5",
    avatar: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Testimonial created successfully!");
    setIsSubmitting(false);
    router.push("/admin/testimonials");
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
    setFormData({ ...formData, avatar: randomAvatar });
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

      <form onSubmit={handleSubmit}>
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
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Johnson"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Role / Title <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Food Blogger"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">
                    Rating <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) => setFormData({ ...formData, rating: value })}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote">
                    Testimonial Quote <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="quote"
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    placeholder="Enter the customer's feedback..."
                    className="min-h-[150px]"
                    required
                  />
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
                  {formData.avatar ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                      <Image
                        src={formData.avatar}
                        alt="Avatar preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-stone-400" />
                    </div>
                  )}
                  <p className="text-sm font-medium text-stone-600">
                    {formData.avatar ? "Click to change" : "Click to upload avatar"}
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
