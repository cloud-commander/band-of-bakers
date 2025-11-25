"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simplified product form validation schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100, "Name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description is too long"),
  price: z.number().min(0.01, "Price must be greater than 0").max(1000, "Price is too high"),
  category: z.enum(["bread", "pastries", "cakes", "cookies", "savory", "seasonal"]),
  weight: z.number().min(1, "Weight must be at least 1g").optional().or(z.literal(0)),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type ProductForm = z.infer<typeof productFormSchema>;

export default function NewProductPage() {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "bread",
      weight: 0,
      imageUrl: "",
      isActive: true,
    },
  });

  const categories = [
    { value: "bread", label: "Bread" },
    { value: "pastries", label: "Pastries" },
    { value: "cakes", label: "Cakes" },
    { value: "cookies", label: "Cookies" },
    { value: "savory", label: "Savory" },
    { value: "seasonal", label: "Seasonal" },
  ];

  const onSubmit = async (data: ProductForm) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Product created successfully!", {
        description: data.name,
      });

      router.push("/admin/products");
    } catch (error) {
      toast.error("Failed to create product", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/products">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <PageHeader title="Add New Product" description="Create a new product for your bakery" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Product Details
                </Heading>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name <span className="text-red-600">*</span>
                  </Label>
                  <Input id="name" {...register("name")} placeholder="e.g., Sourdough Loaf" />
                  {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-600">*</span>
                  </Label>
                  <textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Price and Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price (£) <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      placeholder="4.50"
                    />
                    {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      {...register("weight", { valueAsNumber: true })}
                      placeholder="500"
                    />
                    {errors.weight && (
                      <p className="text-sm text-red-600">{errors.weight.message}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Product Image URL (Optional)</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    {...register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && (
                    <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    💡 In Phase 4, images will be uploaded to Cloudflare R2 with automatic
                    optimization
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Status
                </Heading>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <input
                      id="isActive"
                      type="checkbox"
                      {...register("isActive")}
                      className="w-4 h-4 text-bakery-amber-600 border-stone-300 rounded focus:ring-bakery-amber-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When active, this product will be visible to customers
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white"
              >
                {isSubmitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">📝 Simplified Form</p>
              <p className="text-xs text-blue-700">
                This is a streamlined version focusing on core fields. Advanced features like
                variant management, image galleries, and bake sale selection are available in the
                full product management interface.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
