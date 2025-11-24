"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockProductsWithVariants, mockProductCategories } from "@/lib/mocks/products";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_PRODUCTS_ITEMS_PER_PAGE;

type SortOption = "name" | "price-low" | "price-high";

export default function AdminProductsPage() {
  const allProducts = mockProductsWithVariants;
  const categories = mockProductCategories;

  // Get upcoming bake sales for bake date display
  const upcomingBakeSales = mockBakeSalesWithLocation.filter((bs) => bs.is_active);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBakeSale, setSelectedBakeSale] = useState<string>(upcomingBakeSales[0]?.id || "");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, sortBy, selectedCategory, selectedBakeSale]);

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
              <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">
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

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-center p-4 font-medium">Bake Date</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => {
              const category = categories.find((c) => c.id === product.category_id);
              const selectedBakeSaleData = upcomingBakeSales.find(
                (bs) => bs.id === selectedBakeSale
              );
              return (
                <tr key={product.id} className="border-t hover:bg-muted/30">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{category?.name}</td>
                  <td className="p-4 font-medium">£{product.base_price.toFixed(2)}</td>
                  <td className="p-4">
                    {selectedBakeSaleData && (
                      <div className="flex items-center justify-center">
                        <div className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-medium">
                          {new Date(selectedBakeSaleData.date).toLocaleDateString("en-GB", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
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
    </div>
  );
}
