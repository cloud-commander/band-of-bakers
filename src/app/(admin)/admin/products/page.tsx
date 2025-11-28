"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Plus, X, ImageOff } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { ProductCategory } from "@/lib/repositories/category.repository";
import type { BakeSaleWithLocation } from "@/lib/repositories/bake-sale.repository";
import { CategoriesManagement } from "./categories-management";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_PRODUCTS_ITEMS_PER_PAGE;

type SortOption = "name" | "price-low" | "price-high";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  base_price: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: Array<{
    id: string;
    product_id: string;
    name: string;
    price_adjustment: number;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
};

const isMissingImage = (value: string | null | undefined): boolean => {
  if (value == null) return true;
  const normalized = value.trim().toLowerCase();
  return normalized === "" || normalized === "null" || normalized === "undefined" || normalized === "none";
};

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [upcomingBakeSales, setUpcomingBakeSales] = useState<BakeSaleWithLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsData, categoriesData, bakeSalesData] = await Promise.all([
          getProducts(),
          getCategories(),
          getUpcomingBakeSales(),
        ]);

        // Debug: Check if any products have null/empty image_url
        console.log("[DEBUG] Products with missing images:",
          productsData.filter(p => !p.image_url || p.image_url === "")
            .map(p => ({ id: p.id, name: p.name, image_url: p.image_url }))
        );

        setAllProducts(productsData);
        setCategories(categoriesData);
        setUpcomingBakeSales(bakeSalesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBakeSale, setSelectedBakeSale] = useState<string>("");

  // Update selected bake sale when data loads
  useEffect(() => {
    if (upcomingBakeSales.length > 0 && !selectedBakeSale) {
      setSelectedBakeSale(upcomingBakeSales[0].id);
    }
  }, [upcomingBakeSales, selectedBakeSale]);

  // Filter products by category and search query
  let products = selectedCategory
    ? allProducts.filter((p) => p.category_id === selectedCategory)
    : allProducts;

  // Apply search filter
  if (searchQuery) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return a.base_price - b.base_price;
      case "price-high":
        return b.base_price - a.base_price;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search query, sort, category, bake sale changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, selectedCategory, selectedBakeSale]);

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages > 0 ? totalPages : 1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setSelectedBakeSale(upcomingBakeSales[0]?.id || "");
  };

  const hasActiveFilters =
    selectedCategory !== null ||
    searchQuery !== "" ||
    selectedBakeSale !== upcomingBakeSales[0]?.id;

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
          {/* Filters and Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Bake Sale Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Bake Sale</label>
              <Select value={selectedBakeSale} onValueChange={setSelectedBakeSale}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {upcomingBakeSales.map((bakeSale) => (
                    <SelectItem key={bakeSale.id} value={bakeSale.id}>
                      {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      - {bakeSale.location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedBakeSale !== upcomingBakeSales[0]?.id && (
                <Badge variant="secondary" className="gap-1">
                  {upcomingBakeSales.find((bs) => bs.id === selectedBakeSale)?.location.name}
                  <button
                    onClick={() => setSelectedBakeSale(upcomingBakeSales[0]?.id || "")}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={sortedProducts.length}
            />
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Base Price</th>
                  <th className="text-center p-4 font-medium">Variants</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const category = categories.find((c) => c.id === product.category_id);
                  const variantCount = product.variants?.length || 0;
                  const activeVariants = product.variants?.filter((v) => v.is_active).length || 0;
                  const isImageMissing = isMissingImage(product.image_url);

                  if (isMissingImage(product.image_url)) {
                    console.log(`[DEBUG] Product ${product.name} has no image:`, {
                      image_url: product.image_url,
                      type: typeof product.image_url,
                      normalized: product.image_url?.trim().toLowerCase() ?? "<nullish>",
                      combined: isImageMissing
                    });
                  }

                  return (
                    <tr key={product.id} className="border-t hover:bg-muted/30">
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-sm">{category?.name}</td>
                      <td className="p-4 font-medium font-serif">
                        £{product.base_price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        {variantCount > 0 ? (
                          <div className="flex items-center justify-center">
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {activeVariants} / {variantCount}
                            </Badge>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">—</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              upcomingBakeSales.length === 0
                                ? "destructive"
                                : product.is_active
                                ? "default"
                                : "secondary"
                            }
                          >
                          {upcomingBakeSales.length === 0
                            ? "Unavailable"
                            : product.is_active
                            ? "Active"
                            : "Inactive"}
                          </Badge>
                          {isImageMissing && (
                            <div className="flex items-center text-amber-600" title="No image">
                              <ImageOff className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {paginatedProducts.map((product) => {
              const category = categories.find((c) => c.id === product.category_id);
              const variantCount = product.variants?.length || 0;
              const activeVariants = product.variants?.filter((v) => v.is_active).length || 0;
              const isImageMissing = isMissingImage(product.image_url);

              return (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="block border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-base mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{category?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          upcomingBakeSales.length === 0
                            ? "destructive"
                            : product.is_active
                            ? "default"
                            : "secondary"
                        }
                      >
                        {upcomingBakeSales.length === 0
                          ? "Unavailable"
                          : product.is_active
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                      {isImageMissing && (
                        <div className="flex items-center text-amber-600" title="No image">
                          <ImageOff className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Base Price</p>
                      <p className="font-serif font-bold text-lg">
                        £{product.base_price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Variants</p>
                      {variantCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {activeVariants} / {variantCount}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement
            categories={categories}
            onCategoriesChange={(newCategories) => setCategories(newCategories)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
