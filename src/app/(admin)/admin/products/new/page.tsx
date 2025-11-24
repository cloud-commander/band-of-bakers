"use client";

import { useState } from "react";
import { mockProducts } from "@/lib/mocks/products";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  X,
  Trash2,
  Upload,
  Image as ImageIcon,
  Images,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductVariant {
  id: string;
  name: string;
  priceAdjustment: number;
  isActive: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "bread",
    allergens: [] as string[],
    ingredients: "",
    weight: "",
    imageUrl: "",
    availableBakeSales: [] as string[], // Empty = all dates
    isActive: true,
  });

  const [currentAllergen, setCurrentAllergen] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState({
    name: "",
    priceAdjustment: "0",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Get existing product images for gallery
  const existingImages = mockProducts
    .filter((p) => p.image_url)
    .map((p) => ({ url: p.image_url, name: p.name }));

  // Get upcoming bake sales
  const upcomingBakeSales = mockBakeSalesWithLocation.filter((bs) => bs.is_active);

  const categories = ["bread", "pastries", "cakes", "cookies", "savory", "seasonal"];

  const commonAllergens = ["Gluten", "Dairy", "Eggs", "Nuts", "Soy", "Sesame"];

  const commonVariants = [
    { name: "Whole", priceAdjustment: 0 },
    { name: "Sliced", priceAdjustment: 0 },
    { name: "Small", priceAdjustment: -2 },
    { name: "Large", priceAdjustment: 2 },
    { name: "Half", priceAdjustment: -5 },
  ];

  const handleAddAllergen = () => {
    if (currentAllergen && !formData.allergens.includes(currentAllergen)) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, currentAllergen],
      });
      setCurrentAllergen("");
    }
  };

  const handleRemoveAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((a) => a !== allergen),
    });
  };

  const handleAddVariant = () => {
    if (!newVariant.name.trim()) {
      toast.error("Variant name is required");
      return;
    }

    const variant: ProductVariant = {
      id: `var-${crypto.randomUUID()}`,
      name: newVariant.name,
      priceAdjustment: parseFloat(newVariant.priceAdjustment) || 0,
      isActive: true,
    };

    setVariants([...variants, variant]);
    setNewVariant({ name: "", priceAdjustment: "0" });
    toast.success(`Variant "${variant.name}" added`);
  };

  const handleQuickAddVariant = (commonVariant: (typeof commonVariants)[0]) => {
    const variant: ProductVariant = {
      id: `var-${crypto.randomUUID()}`,
      name: commonVariant.name,
      priceAdjustment: commonVariant.priceAdjustment,
      isActive: true,
    };

    setVariants([...variants, variant]);
    toast.success(`Variant "${variant.name}" added`);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleToggleVariantActive = (id: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, isActive: !v.isActive } : v)));
  };

  const handleImageUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setFormData({ ...formData, imageUrl: reader.result as string });
      toast.success("Image uploaded successfully");
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, imageUrl: "" });
    toast.success("Image removed");
  };

  const handleSelectFromGallery = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return;
    setImagePreview(imageUrl);
    setFormData({ ...formData, imageUrl });
    setShowGallery(false);
    toast.success("Image selected from gallery");
  };

  const handleToggleBakeSale = (bakeSaleId: string) => {
    const current = formData.availableBakeSales;
    if (current.includes(bakeSaleId)) {
      setFormData({
        ...formData,
        availableBakeSales: current.filter((id) => id !== bakeSaleId),
      });
    } else {
      setFormData({
        ...formData,
        availableBakeSales: [...current, bakeSaleId],
      });
    }
  };

  const handleSelectAllBakeSales = () => {
    if (formData.availableBakeSales.length === upcomingBakeSales.length) {
      setFormData({ ...formData, availableBakeSales: [] });
    } else {
      setFormData({
        ...formData,
        availableBakeSales: upcomingBakeSales.map((bs) => bs.id),
      });
    }
  };

  const isAllBakeSalesSelected =
    formData.availableBakeSales.length === 0 ||
    formData.availableBakeSales.length === upcomingBakeSales.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Product created successfully!", {
      description: `${formData.name} has been added with ${variants.length} variant(s)`,
    });

    setIsSubmitting(false);
    router.push("/admin/products");
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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Product Image
                </Heading>
                <p className="text-sm text-muted-foreground mt-2">
                  Upload a high-quality image of your product (max 5MB)
                </p>
              </CardHeader>
              <CardContent>
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-stone-200">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove Image
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowGallery(true)}>
                        <Images className="w-4 h-4 mr-2" />
                        Choose from Gallery
                      </Button>
                    </div>
                  </div>
                ) : showGallery ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Heading level={4} className="mb-0">
                        Choose from Gallery
                      </Heading>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowGallery(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                      {existingImages.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSelectFromGallery(img.url)}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-stone-200 hover:border-bakery-amber-500 transition-colors group"
                        >
                          <img
                            src={img.url || ""}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                              Select
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowGallery(false)}
                      className="w-full"
                    >
                      Upload New Image Instead
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                        isDragging
                          ? "border-bakery-amber-500 bg-bakery-amber-50"
                          : "border-stone-300 hover:border-bakery-amber-400"
                      )}
                    >
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-bakery-amber-100 flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-bakery-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">
                            <span className="text-bakery-amber-600">Click to upload</span> or drag
                            and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </label>
                    </div>
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowGallery(true)}
                        className="text-bakery-amber-600 hover:text-bakery-amber-700"
                      >
                        <Images className="w-4 h-4 mr-2" />
                        Or choose from existing images
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  💡 In Phase 4, images will be uploaded to Cloudflare R2 with automatic
                  optimization
                </p>
              </CardContent>
            </Card>

            {/* Bake Sale Availability */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Bake Sale Availability
                </Heading>
                <p className="text-sm text-muted-foreground mt-2">
                  Select which bake sales this product will be available for
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-bakery-amber-50 border border-bakery-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-bakery-amber-600" />
                    <div>
                      <p className="font-medium">All Upcoming Bake Sales</p>
                      <p className="text-xs text-muted-foreground">
                        Product will be available for all future dates
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllBakeSales}
                    className={cn(
                      "w-12 h-12 rounded-lg border-2 transition-all active:scale-95",
                      isAllBakeSalesSelected
                        ? "bg-bakery-amber-600 border-bakery-amber-600"
                        : "bg-white border-stone-300"
                    )}
                  >
                    {isAllBakeSalesSelected && (
                      <svg
                        className="w-full h-full text-white p-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Or select specific dates:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {upcomingBakeSales.map((bakeSale) => {
                      const isSelected =
                        formData.availableBakeSales.length === 0 ||
                        formData.availableBakeSales.includes(bakeSale.id);

                      return (
                        <button
                          key={bakeSale.id}
                          type="button"
                          onClick={() => handleToggleBakeSale(bakeSale.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border-2 transition-all text-left active:scale-98",
                            isSelected
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-stone-200 hover:border-stone-300"
                          )}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {typeof bakeSale.location === "string"
                                ? bakeSale.location
                                : bakeSale.location?.name || ""}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-blue-600 border-blue-600"
                                : "bg-white border-stone-300"
                            )}
                          >
                            {isSelected && (
                              <svg
                                className="w-full h-full text-white p-1.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Product Details
                </Heading>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Product Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Sourdough Loaf"
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
                  />
                </div>

                {/* Price and Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-2">
                      Base Price (£) <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="4.50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Base price before variant adjustments
                    </p>
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium mb-2">
                      Weight (g)
                    </label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="500"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500 capitalize"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="capitalize">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ingredients */}
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
                    Ingredients
                  </label>
                  <textarea
                    id="ingredients"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Flour, Water, Salt, Yeast..."
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
                  />
                </div>

                {/* Allergens */}
                <div>
                  <label className="block text-sm font-medium mb-2">Allergens</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="text"
                      value={currentAllergen}
                      onChange={(e) => setCurrentAllergen(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddAllergen();
                        }
                      }}
                      placeholder="Type allergen..."
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={handleAddAllergen}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonAllergens.map((allergen) => (
                      <Button
                        key={allergen}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!formData.allergens.includes(allergen)) {
                            setFormData({
                              ...formData,
                              allergens: [...formData.allergens, allergen],
                            });
                          }
                        }}
                        className="text-xs"
                      >
                        + {allergen}
                      </Button>
                    ))}
                  </div>
                  {formData.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.allergens.map((allergen) => (
                        <Badge
                          key={allergen}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          {allergen}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergen(allergen)}
                            className="ml-2 hover:text-amber-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Variants */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Product Variants
                </Heading>
                <p className="text-sm text-muted-foreground mt-2">
                  Add size or type variations (e.g., Whole/Sliced, Small/Large)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Add Variants */}
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Add</label>
                  <div className="flex flex-wrap gap-2">
                    {commonVariants.map((variant) => (
                      <Button
                        key={variant.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAddVariant(variant)}
                        className="text-xs"
                      >
                        + {variant.name}
                        {variant.priceAdjustment !== 0 && (
                          <span className="ml-1 text-muted-foreground">
                            ({variant.priceAdjustment > 0 ? "+" : ""}£
                            {variant.priceAdjustment.toFixed(2)})
                          </span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Variant */}
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Variant</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newVariant.name}
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      placeholder="Variant name (e.g., Extra Large)"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={newVariant.priceAdjustment}
                      onChange={(e) =>
                        setNewVariant({
                          ...newVariant,
                          priceAdjustment: e.target.value,
                        })
                      }
                      placeholder="Price adjustment"
                      className="w-32"
                    />
                    <Button type="button" variant="outline" onClick={handleAddVariant}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Price adjustment: positive adds to base price, negative subtracts
                  </p>
                </div>

                {/* Variant List */}
                {variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Variants ({variants.length})
                    </label>
                    {variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-lg",
                          variant.isActive
                            ? "bg-white border-stone-200"
                            : "bg-stone-50 border-stone-200 opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={variant.isActive}
                            onChange={() => handleToggleVariantActive(variant.id)}
                            className="w-4 h-4 text-bakery-amber-600 border-stone-300 rounded focus:ring-bakery-amber-500"
                          />
                          <div>
                            <p className="font-medium">{variant.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formData.price && (
                                <>
                                  £
                                  {(parseFloat(formData.price) + variant.priceAdjustment).toFixed(
                                    2
                                  )}
                                  {variant.priceAdjustment !== 0 && (
                                    <span className="ml-1">
                                      ({variant.priceAdjustment > 0 ? "+" : ""}£
                                      {variant.priceAdjustment.toFixed(2)})
                                    </span>
                                  )}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Status
                </Heading>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </label>
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-bakery-amber-600 border-stone-300 rounded focus:ring-bakery-amber-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.isActive
                      ? "Product will be visible to customers"
                      : "Product will be hidden from customers"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {(formData.name || variants.length > 0) && (
              <Card className="mt-6">
                <CardHeader>
                  <Heading level={3} className="mb-0">
                    Summary
                  </Heading>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {imagePreview && (
                    <div>
                      <p className="text-muted-foreground mb-2">Image</p>
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
                        <img
                          src={imagePreview}
                          alt="Product thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  {formData.name && (
                    <div>
                      <p className="text-muted-foreground">Product</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                  )}
                  {formData.price && (
                    <div>
                      <p className="text-muted-foreground">Base Price</p>
                      <p className="font-medium font-serif">
                        £{parseFloat(formData.price).toFixed(2)}
                      </p>
                    </div>
                  )}
                  {variants.length > 0 && (
                    <div>
                      <p className="text-muted-foreground">Variants</p>
                      <p className="font-medium">
                        {variants.filter((v) => v.isActive).length} active
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Product"}
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
          </div>
        </div>
      </form>
    </div>
  );
}
