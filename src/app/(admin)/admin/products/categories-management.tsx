"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/categories";
import type { ProductCategory } from "@/lib/repositories/category.repository";
import { ImageGallery } from "@/components/admin/image-gallery";

interface CategoriesManagementProps {
  categories: ProductCategory[];
  onCategoriesChange: (categories: ProductCategory[]) => void;
}

export function CategoriesManagement({
  categories,
  onCategoriesChange,
}: CategoriesManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      sort_order: 0,
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
        sort_order: categories.length,
      });

      if (result.success) {
        toast.success("Category created successfully");
        setIsCreateDialogOpen(false);
        resetForm();
        // Refresh categories
        const { getCategories } = await import("@/actions/categories");
        const updatedCategories = await getCategories();
        onCategoriesChange(updatedCategories);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await updateCategory(selectedCategory.id, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        image_url: formData.image_url.trim() || undefined,
      });

      if (result.success) {
        toast.success("Category updated successfully");
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        resetForm();
        // Refresh categories
        const { getCategories } = await import("@/actions/categories");
        const updatedCategories = await getCategories();
        onCategoriesChange(updatedCategories);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    setIsSubmitting(true);
    try {
      const result = await deleteCategory(selectedCategory.id);

      if (result.success) {
        toast.success("Category deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        // Refresh categories
        const { getCategories } = await import("@/actions/categories");
        const updatedCategories = await getCategories();
        onCategoriesChange(updatedCategories);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (category: ProductCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
      sort_order: category.sort_order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: ProductCategory) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const openImageGallery = () => {
    setIsImageGalleryOpen(true);
  };

  const handleImageSelect = (imagePath: string) => {
    setFormData((prev) => ({
      ...prev,
      image_url: imagePath,
    }));
    setIsImageGalleryOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Product Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories and their display order
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No categories yet. Create your first category to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  </TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {category.description || (
                      <span className="text-muted-foreground text-sm">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(category)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {categories.length === 0 ? (
          <div className="border rounded-lg p-12 text-center text-muted-foreground">
            No categories yet. Create your first category to get started.
          </div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                </div>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              )}
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(category)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(category)}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
            <DialogDescription>Add a new product category to your catalog.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">Name *</Label>
              <Input
                id="create-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Breads & Loaves"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-description">Description</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this category"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex gap-3 items-start">
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-24 w-24 rounded object-cover border"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => openImageGallery()}
                      className="mt-2 w-full"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openImageGallery()}
                    className="h-24 w-24 flex flex-col items-center justify-center"
                  >
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs">Select Image</span>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground flex-1">
                  Choose an image to represent this category on your storefront.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update the category details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Breads & Loaves"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description for this category"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Category Image</Label>
              <div className="flex gap-3 items-start">
                {formData.image_url ? (
                  <div className="relative">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-24 w-24 rounded object-cover border"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => openImageGallery()}
                      className="mt-2 w-full"
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openImageGallery()}
                    className="h-24 w-24 flex flex-col items-center justify-center"
                  >
                    <ImageIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs">Select Image</span>
                  </Button>
                )}
                <p className="text-sm text-muted-foreground flex-1">
                  Choose an image to represent this category on your storefront.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedCategory(null);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCategory?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCategory(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={isSubmitting}>
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
            <DialogDescription>Choose an image from your gallery.</DialogDescription>
          </DialogHeader>
          <ImageGallery
            onImageSelect={handleImageSelect}
            selectedImage={formData.image_url}
            category="categories"
            mode="picker"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
