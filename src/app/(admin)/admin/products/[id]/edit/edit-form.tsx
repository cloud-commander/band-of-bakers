"use client";

import { useState, useEffect } from "react";
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
import { getProductById, updateProduct, deleteProduct } from "@/actions/products";
import type { ProductCategory } from "@/db/schema";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

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
}

export default function EditProductForm({ productId, categories }: EditProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      is_active: true,
      variants: [],
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

  // Load product data
  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(productId);

        if (!product) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        // Calculate absolute prices for variants
        const variantsWithPrices = product.variants.map((v: unknown) => ({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: (v as any).id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          name: (v as any).name,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          price: product.base_price + (v as any).price_adjustment,
        }));

        // Set form values
        reset({
          name: product.name,
          slug: product.slug,
          description: product.description || "",
          category_id: product.category_id,
          base_price: product.base_price.toString(),
          is_active: product.is_active,
          variants: variantsWithPrices,
        });

        // Set image and category
        if (product.image_url) {
          setSelectedImage(product.image_url);
        }
        setSelectedCategory(product.category_id);
      } catch (error) {
        console.error("Failed to load product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, reset, router]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

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
