"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
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
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ImageGallery } from "@/components/admin/image-gallery";
import { updateProduct, deleteProduct } from "@/actions/products";
import type { Product, ProductCategory, ProductVariant } from "@/db/schema";
import type { BakeSaleWithLocation } from "@/lib/repositories";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

// Validation schema
const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  base_price: z.string().optional(),
  is_active: z.boolean(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
      })
    )
    .optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  productId: string;
  categories: ProductCategory[];
  initialProduct: Product & { variants: ProductVariant[] };
  upcomingBakeSales: BakeSaleWithLocation[];
  initialAvailabilities: Record<string, boolean>;
}

export default function EditProductForm({
  productId,
  categories,
  initialProduct,
  upcomingBakeSales,
  initialAvailabilities,
}: EditProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(initialProduct.image_url || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(initialProduct.category_id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bakeSaleAvailabilities, setBakeSaleAvailabilities] =
    useState<Record<string, boolean>>(initialAvailabilities);

  // Calculate absolute prices for variants
  const variantsWithPrices = initialProduct.variants.map((v) => ({
    id: v.id,
    name: v.name,
    price: initialProduct.base_price + v.price_adjustment,
  }));

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialProduct.name,
      slug: initialProduct.slug,
      description: initialProduct.description || "",
      category_id: initialProduct.category_id,
      base_price: initialProduct.base_price.toString(),
      is_active: initialProduct.is_active,
      variants: variantsWithPrices,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const isActive = watch("is_active");
  const variants = watch("variants");

  // Calculate starting price based on variants
  const startingPrice =
    variants && variants.length > 0 ? Math.min(...variants.map((v) => v.price || 0)) : null;

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("slug", slug);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description || "");
      formData.append("category_id", data.category_id);
      formData.append("is_active", data.is_active.toString());

      // If variants exist, we don't send base_price directly, backend calculates it
      if (data.variants && data.variants.length > 0) {
        formData.append("variants", JSON.stringify(data.variants));
      } else {
        formData.append("base_price", data.base_price || "0");
      }

      // Handle image if changed
      if (selectedImage) {
        // If it's a blob URL (newly uploaded), convert to file
        if (selectedImage.startsWith("blob:")) {
          const response = await fetch(selectedImage);
          const blob = await response.blob();
          const file = new File([blob], "product-image.jpg", { type: blob.type });
          formData.append("image", file);
        } else {
          // If it's a path from the gallery, send it as image_url
          formData.append("image_url", selectedImage);
        }
      }

      if (upcomingBakeSales.length > 0) {
        formData.append("bake_sale_availabilities", JSON.stringify(bakeSaleAvailabilities));
      }

      const result = await updateProduct(productId, formData);

      if (result.success) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProduct(productId);

      if (result.success) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Edit Product"
        description="Update product details"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit Product" }]}
        actions={
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product and
                    remove it from the catalog.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
        {/* Basic Information */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={(e) => {
                register("name").onChange(e);
                handleNameChange(e);
              }}
              placeholder="e.g. Sourdough Loaf"
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your product..."
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category *</Label>
              <Select
                value={watch("category_id")}
                onValueChange={(value) => {
                  setValue("category_id", value);
                  setSelectedCategory(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_price">
                {variants && variants.length > 0 ? "Starting Price" : "Price (£) *"}
              </Label>
              <div className="relative">
                <Input
                  id="base_price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("base_price")}
                  placeholder="0.00"
                  disabled={variants && variants.length > 0}
                  value={variants && variants.length > 0 ? startingPrice?.toFixed(2) : undefined}
                />
                {variants && variants.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated from lowest variant price
                  </p>
                )}
              </div>
              {errors.base_price && !variants?.length && (
                <p className="text-sm text-destructive">{errors.base_price.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (visible to customers)
            </Label>
          </div>

          <div className="space-y-4">
            <Label>Availability for bake sales</Label>
            {upcomingBakeSales.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all-bake-sales"
                      checked={
                        upcomingBakeSales.every((bs) => bakeSaleAvailabilities[bs.id] !== false)
                          ? true
                          : upcomingBakeSales.some((bs) => bakeSaleAvailabilities[bs.id] !== false)
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={(checked: boolean | "indeterminate") => {
                        const newValue = checked === true;
                        const newAvailabilities = { ...bakeSaleAvailabilities };
                        upcomingBakeSales.forEach((bs) => {
                          newAvailabilities[bs.id] = newValue;
                        });
                        setBakeSaleAvailabilities(newAvailabilities);
                      }}
                    />
                    <Label htmlFor="select-all-bake-sales" className="cursor-pointer font-medium">
                      Select All
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {upcomingBakeSales.map((bakeSale) => (
                    <div
                      key={bakeSale.id}
                      className="flex items-center gap-3 border rounded-lg p-3 bg-muted/40"
                    >
                      <Checkbox
                        id={`bake-sale-${bakeSale.id}`}
                        checked={bakeSaleAvailabilities[bakeSale.id] ?? true}
                        onCheckedChange={(checked: boolean | "indeterminate") =>
                          setBakeSaleAvailabilities((prev) => ({
                            ...prev,
                            [bakeSale.id]: checked === true,
                          }))
                        }
                      />
                      <Label
                        htmlFor={`bake-sale-${bakeSale.id}`}
                        className="cursor-pointer text-sm"
                      >
                        {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        at {bakeSale.location.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming bake sale dates configured yet.
              </p>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Variants</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", price: 0 })}
            >
              Add Variant
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No variants added. This product will use the simple price set above.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`variants.${index}.name`} className="sr-only">
                      Name
                    </Label>
                    <Input
                      {...register(`variants.${index}.name` as const)}
                      placeholder="Variant Name (e.g. Small, Large)"
                    />
                    {errors.variants?.[index]?.name && (
                      <p className="text-sm text-destructive">
                        {errors.variants[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`variants.${index}.price`} className="sr-only">
                      Price
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`variants.${index}.price` as const, {
                        valueAsNumber: true,
                      })}
                      placeholder="Price"
                    />
                    {errors.variants?.[index]?.price && (
                      <p className="text-sm text-destructive">
                        {errors.variants[index]?.price?.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Image */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Product Image</h2>
          <ImageGallery
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
            category={selectedCategory}
            productOnly
            allowUpload={true}
          />
        </div>

        {/* Advanced Settings */}
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="mr-2">{showAdvanced ? "▼" : "▶"}</span>
            Advanced Settings
          </button>

          {showAdvanced && (
            <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" {...register("slug")} placeholder="e.g. sourdough-loaf" />
                <p className="text-xs text-muted-foreground">
                  The unique part of the product URL. Auto-generated from name.
                </p>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
