"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, Check, Loader2, Trash2 } from "lucide-react";
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

interface ImageGalleryProps {
  /**
   * Currently selected image URL
   */
  selectedImage?: string | null;

  /**
   * Callback when an image is selected
   */
  onImageSelect: (imageUrl: string) => void;

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
}

/**
 * Reusable Image Gallery Component
 *
 * Features:
 * - Upload images to Cloudflare R2
 * - Browse existing images
 * - Select image for use
 * - Filter by category
 * - Responsive grid layout
 * - Delete images with confirmation
 */
export function ImageGallery({
  selectedImage,
  onImageSelect,
  category,
  allowUpload = true,
  maxSizeMB = 5,
}: ImageGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>(category || "all");
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch existing images on mount or when filter changes
  useEffect(() => {
    async function fetchExistingImages() {
      try {
        setLoadingImages(true);
        const response = await fetch(`/api/list-images?category=${selectedFilter}`);

        if (response.ok) {
          const data = await response.json();
          setExistingImages(data.images || []);
        }
      } catch (error) {
        console.error("Failed to fetch existing images:", error);
      } finally {
        setLoadingImages(false);
      }
    }

    fetchExistingImages();
  }, [selectedFilter]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        toast.error(`File too large. Max size is ${maxSizeMB}MB.`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }

      setUploading(true);

      try {
        // Create FormData for upload
        const formData = new FormData();
        formData.append("image", file);
        if (category) {
          formData.append("category", category);
        }

        // Upload to server action (we'll create this)
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        const imageUrl = data.url;

        // Add to uploaded images list
        setUploadedImages((prev) => [imageUrl, ...prev]);

        // Auto-select the newly uploaded image
        onImageSelect(imageUrl);

        toast.success("Image uploaded successfully");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
        // Reset input
        event.target.value = "";
      }
    },
    [category, maxSizeMB, onImageSelect]
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
        body: JSON.stringify({ url: imageToDelete }),
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Remove from lists
      setExistingImages((prev) => prev.filter((img) => img !== imageToDelete));
      setUploadedImages((prev) => prev.filter((img) => img !== imageToDelete));

      // Deselect if currently selected
      if (selectedImage === imageToDelete) {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Responsive page size
  useEffect(() => {
    const handleResize = () => {
      setPageSize(window.innerWidth < 768 ? 4 : 8);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter]);

  // Combine existing images, uploaded images, and selected image
  const allImages = [
    ...(selectedImage &&
    !existingImages.includes(selectedImage) &&
    !uploadedImages.includes(selectedImage)
      ? [selectedImage]
      : []),
    ...uploadedImages,
    ...existingImages,
  ].filter((img, index, self) => img && self.indexOf(img) === index); // Remove duplicates

  // Pagination logic
  const totalPages = Math.ceil(allImages.length / pageSize);
  const paginatedImages = allImages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      {!loadingImages && existingImages.length > 0 && (
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="text-sm font-medium">
            Filter by category:
          </label>
          <select
            id="category-filter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-input rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            <option value="cat-breads">Breads</option>
            <option value="cat-pastries-bakes">Pastries & Bakes</option>
            <option value="cat-cakes-loaves">Cakes & Loaves</option>
            <option value="cat-tarts-pies">Tarts & Pies</option>
            <option value="cat-savoury-specialities">Savoury & Specialities</option>
          </select>
        </div>
      )}

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
                    <p className="text-sm font-medium">Click to upload image</p>
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
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}

      {/* Image Grid */}
      {!loadingImages && allImages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">
            {allowUpload ? "Select or upload an image" : "Select an image"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {paginatedImages.map((imageUrl, index) => {
              const isSelected = imageUrl === selectedImage;

              return (
                <div key={`${imageUrl}-${index}`} className="relative group">
                  <button
                    type="button"
                    onClick={() => onImageSelect(imageUrl)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all w-full",
                      isSelected
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-muted hover:border-muted-foreground/50"
                    )}
                  >
                    <Image
                      src={imageUrl}
                      alt="Product image option"
                      fill
                      className="object-cover"
                    />

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Delete Button (visible on hover) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToDelete(imageUrl);
                    }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
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
                totalItems={allImages.length}
              />
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loadingImages && allImages.length === 0 && !allowUpload && (
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
    </div>
  );
}
