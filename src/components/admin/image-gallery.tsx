"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Upload, Check, Loader2, Trash2, Edit, RefreshCw, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
const knownProductCategories = [
  "breads-loaves",
  "pastries",
  "pies-tarts",
  "cakes-slices",
  "savory",
  "biscuits-bars",
];

interface ImageRecord {
  id: string;
  url: string;
  filename: string;
  category?: string;
  tags?: string[];
  size?: number;
}

interface ImageGalleryProps {
  /**
   * Currently selected image URL (in picker mode)
   */
  selectedImage?: string | null;

  /**
   * Callback when an image is selected
   */
  onImageSelect?: (imageUrl: string) => void;

  /**
   * Optional category filter for images
   */
  category?: string;

  /**
   * Whether to show upload functionality
   */
  allowUpload?: boolean;

  /**
   * Maximum file size in MB
   */
  maxSizeMB?: number;

  /**
   * Mode of operation
   */
  mode?: "picker" | "manager";
}

/**
 * Reusable Image Gallery Component
 *
 * Features:
 * - Upload images to Cloudflare R2
 * - Browse existing images
 * - Select image for use (picker mode)
 * - Manage images (manager mode): delete, edit tags
 * - Filter by category
 * - Responsive grid layout
 */
export function ImageGallery({
  selectedImage,
  onImageSelect,
  category,
  allowUpload = true,
  maxSizeMB = 5,
  mode = "picker",
}: ImageGalleryProps) {
  const bucketFromCategory = (cat?: string | null) => {
    if (!cat || cat === "all") return "all";
    if (cat === "uncategorized") return "uncategorized";
    if (cat === "news") return "news";
    return "products";
  };

  const initialBucket = category ? bucketFromCategory(category) : "products";

  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(initialBucket);

  // Dialog states
  const [imageToDelete, setImageToDelete] = useState<ImageRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<ImageRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editProductCategory, setEditProductCategory] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>("");

  // Fetch existing images
  const fetchImages = useCallback(async () => {
    try {
      setLoadingImages(true);
      const params = new URLSearchParams();
      params.set("bucket", selectedFilter);
      if (selectedFilter === "products" && selectedProductCategory) {
        params.set("category", selectedProductCategory);
      }
      params.set("limit", "48");
      const response = await fetch(`/api/list-images?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setImages(data.data);
        } else if (data.images) {
          // Backward compatibility
          setImages(
            data.images.map((url: string) => ({
              id: url,
              url,
              filename: url.split("/").pop() || "image",
            }))
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch existing images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoadingImages(false);
    }
  }, [selectedFilter, selectedProductCategory]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      let successCount = 0;

      try {
        // Upload each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Validate file size
          const maxSizeBytes = maxSizeMB * 1024 * 1024;
          if (file.size > maxSizeBytes) {
            toast.error(`File ${file.name} too large. Max size is ${maxSizeMB}MB.`);
            continue;
          }

          // Validate file type
          if (!file.type.startsWith("image/")) {
            toast.error(`File ${file.name} is not an image.`);
            continue;
          }

          const formData = new FormData();
          formData.append("image", file);
          if (selectedFilter !== "all") {
            formData.append("category", selectedFilter);
          }

          const response = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            successCount++;
          } else {
            console.error(`Failed to upload ${file.name}`);
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully uploaded ${successCount} images`);
          fetchImages();
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload images");
      } finally {
        setUploading(false);
        // Reset input
        event.target.value = "";
      }
    },
    [selectedFilter, maxSizeMB, fetchImages]
  );

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageToDelete.url }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setImages((prev) => prev.filter((img) => img.id !== imageToDelete.id));

      // Deselect if currently selected in picker mode
      if (mode === "picker" && selectedImage === imageToDelete.url && onImageSelect) {
        onImageSelect("");
      }

      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setImageToDelete(null);
    }
  };

  const handleUpdateImage = async () => {
    if (!imageToEdit) return;

    setIsEditing(true);
    try {
      const resolvedProductCategory =
        editCategory === "products"
          ? editProductCategory || productCategoryOptions[0] || imageToEdit.category || null
          : null;

      if (editCategory === "products" && !resolvedProductCategory) {
        toast.error("Select a product category for product images.");
        setIsEditing(false);
        return;
      }

      const response = await fetch("/api/update-image", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: imageToEdit.url,
          category:
            editCategory === "uncategorized"
              ? null
              : editCategory === "products"
                ? resolvedProductCategory
                : "news",
          tags: (() => {
            const intrinsic = (imageToEdit.tags || []).filter((t) =>
              ["card", "detail", "thumbnail", "featured"].includes(t)
            );
            const result = new Set<string>([...intrinsic]);
            if (editCategory === "products") {
              result.add("product");
              if (resolvedProductCategory) result.add(resolvedProductCategory);
            } else if (editCategory === "news") {
              result.add("news");
            }
            return Array.from(result);
          })(),
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      toast.success("Image updated successfully");
      fetchImages(); // Refresh to get updated data
      setImageToEdit(null);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update image");
    } finally {
      setIsEditing(false);
    }
  };

  const openEditDialog = (image: ImageRecord) => {
    setImageToEdit(image);
    setEditCategory(bucketFromCategory(image.category));
    setEditProductCategory(image.category && image.category !== "news" ? image.category : "");
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Responsive page size
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 4 : 8);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatLabel = (value: string) =>
    value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  const productCategoryOptions = useMemo(() => {
    const set = new Set<string>(knownProductCategories);
    images.forEach((img) => {
      const cat = img.category || "";
      if (cat && cat !== "news") set.add(cat);
    });
    return Array.from(set)
      .filter((cat) => !["products", "news", "uncategorized", "all", "category"].includes(cat))
      .sort();
  }, [images]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, selectedProductCategory]);

  const visibleImages = useMemo(() => {
    if (selectedFilter === "products" && selectedProductCategory) {
      return images.filter((img) => img.category === selectedProductCategory);
    }
    return images;
  }, [images, selectedFilter, selectedProductCategory]);

  // Pagination logic
  const totalPages = Math.ceil(visibleImages.length / pageSize);
  const paginatedImages = visibleImages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getPreviewUrl = (image: ImageRecord) => {
    const url = image.url;
    const tags = image.tags || [];
    if (tags.includes("thumbnail") || url.includes("-thumbnail")) {
      return url;
    }
    if (url.includes("/images/products/")) {
      if (url.includes("-detail")) return url.replace("-detail", "-thumbnail");
      if (url.includes("-card")) return url.replace("-card", "-thumbnail");
    }
    return url;
  };

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {!loadingImages && (
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="text-sm font-medium">
              Category:
            </label>
            <select
              id="category-filter"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-input rounded-md bg-background"
            >
              <option value="all">All</option>
              <option value="products">Products</option>
              <option value="news">News</option>
              <option value="uncategorized">Uncategorized</option>
            </select>
            <Button variant="ghost" size="icon" onClick={fetchImages} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loadingImages && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading images...</span>
        </div>
      )}

      {/* Upload Section */}
      {!loadingImages && allowUpload && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
          <label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center cursor-pointer",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {uploading ? (
                <>
                  <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP up to {maxSizeMB}MB
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Image Grid */}
      {!loadingImages && images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">
            {mode === "picker" ? "Select an image" : "Image Library"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {paginatedImages.map((image, index) => {
              const isSelected = mode === "picker" && image.url === selectedImage;
              const previewUrl = getPreviewUrl(image);

              return (
                <div key={`${image.id}-${index}`} className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === "picker" && onImageSelect) {
                        onImageSelect(image.url);
                      } else if (mode === "manager") {
                        openEditDialog(image);
                      }
                    }}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full",
                      isSelected
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    <Image
                      src={previewUrl}
                      alt={image.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 40vw, (max-width: 1200px) 25vw, 200px"
                      loading="lazy"
                      unoptimized
                    />

                    {/* Selection Indicator (Picker Mode) */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}

                    {/* Tags Indicator */}
                    {image.tags && image.tags.length > 0 && (
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        <Badge variant="secondary" className="text-[10px] px-1 h-5 opacity-90">
                          <Tag className="h-3 w-3 mr-1" />
                          {image.tags.length}
                        </Badge>
                      </div>
                    )}
                  </button>

                  {/* Actions (Manager Mode or Hover) */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {mode === "manager" && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-full shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(image);
                        }}
                        title="Edit details"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7 rounded-full shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageToDelete(image);
                      }}
                      title="Delete image"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
              <PaginationInfo
                currentPage={currentPage}
                pageSize={pageSize}
                totalItems={images.length}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loadingImages && images.length === 0 && !allowUpload && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No images available</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteImage();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={!!imageToEdit} onOpenChange={(open) => !open && setImageToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
            <DialogDescription>Update category and tags for this image.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Image Type</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "products", label: "Product" },
                  { value: "news", label: "News" },
                  { value: "uncategorized", label: "Uncategorized" },
                ].map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    size="sm"
                    variant={editCategory === type.value ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => {
                      setEditCategory(type.value);
                      if (type.value !== "products") {
                        setEditProductCategory("");
                      } else if (!editProductCategory && productCategoryOptions.length > 0) {
                        setEditProductCategory(productCategoryOptions[0]);
                      }
                    }}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {editCategory === "products" && (
              <div className="space-y-2">
                <Label>Product Category</Label>
                <div className="flex flex-wrap gap-2">
                  {productCategoryOptions.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      size="sm"
                      variant={editProductCategory === cat ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setEditProductCategory(cat)}
                    >
                      {formatLabel(cat)}
                    </Button>
                  ))}
                  {productCategoryOptions.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No product categories detected. Save will fail without one.
                    </p>
                  )}
                </div>
              </div>
            )}

            {editCategory === "news" && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  This image will be tagged for News. Existing thumbnail/detail tags are kept.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setImageToEdit(null)} disabled={isEditing}>
              Cancel
            </Button>
            <Button onClick={handleUpdateImage} disabled={isEditing}>
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
