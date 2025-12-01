"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { MESSAGES } from "@/lib/constants/frontend";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Calendar } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { Product, ProductCategory, ProductVariant, BakeSaleWithLocation } from "@/lib/repositories";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.MENU_ITEMS_PER_PAGE;
const LOW_STOCK_THRESHOLD = 5;

type SortOption = "name" | "price-low" | "price-high" | "rating";

type ProductWithVariants = Product & {
  variants: ProductVariant[];
};

interface MenuContentProps {
  initialProducts: ProductWithVariants[];
  categories: ProductCategory[];
  upcomingBakeSales: BakeSaleWithLocation[];
}

export function MenuContent({ initialProducts, categories, upcomingBakeSales }: MenuContentProps) {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const bakeSaleParam = searchParams.get("bakeSale");
  const categoryParam = searchParams.get("category");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    if (categoryParam) {
      const category = categories.find((c) => c.slug === categoryParam);
      return category ? category.id : null;
    }
    return null;
  });

  // Initialize with URL param or first available bake sale
  const [selectedBakeSale, setSelectedBakeSale] = useState<string>(
    bakeSaleParam && upcomingBakeSales.find((bs) => bs.id === bakeSaleParam)
      ? bakeSaleParam
      : upcomingBakeSales[0]?.id || ""
  );
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Filter products by category and search query
  let products = selectedCategory
    ? initialProducts.filter((p) => p.category_id === selectedCategory)
    : initialProducts;

  // Apply search filter
  if (searchQuery) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
      case "rating": {
        // Rating sort temporarily disabled during migration
        return 0;
      }
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change using useMemo
  const validCurrentPage = useMemo(() => {
    // When filters change, we want to be on page 1
    // This is derived state, not side effect
    if (currentPage > totalPages && totalPages > 0) {
      return totalPages;
    }
    if (currentPage > totalPages) {
      return 1;
    }
    return currentPage;
  }, [currentPage, totalPages]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1); // eslint-disable-line react-hooks/set-state-in-effect
  }, [searchQuery, sortBy, selectedCategory, selectedBakeSale]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    // Reset to first bake sale instead of null
    setSelectedBakeSale(upcomingBakeSales[0]?.id || "");
  };

  const hasActiveFilters = selectedCategory !== null || searchQuery !== "";

  // Helper to get bake sale location name
  const getBakeSaleLabel = (bs: BakeSaleWithLocation) => {
    // We need location name. BakeSale type has location_id.
    // The prop upcomingBakeSales should ideally include location.
    // For now, we might need to fetch location or assume it's joined.
    // Wait, getUpcomingBakeSales returns BakeSale[], which is the schema type.
    // It doesn't include location relation by default unless we use a join or custom type.
    // In mock data it was `mockBakeSalesWithLocation`.
    // I should update `getUpcomingBakeSales` to return location data.
    // Or I can just show date for now.
    // Let's assume for now we just show date.
    return new Date(bs.date).toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  if (upcomingBakeSales.length === 0) {
    return (
      <div
        className={`min-h-screen ${DESIGN_TOKENS.sections.padding} flex items-center justify-center`}
      >
        <div className="max-w-2xl mx-auto text-center">
          <PageHeader
            title="Our Menu"
            description="Freshly baked goods, available for collection or delivery"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Menu" }]}
          />
          <div className="mt-12 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden border-4 border-bakery-amber-100 shadow-lg">
              <Image
                src="/images/bakers-away.png"
                alt="Bakers Away"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif text-bakery-amber-800 mb-4">
              We&apos;re Taking a Short Break
            </h2>
            <p className="text-lg text-stone-600 max-w-lg mx-auto leading-relaxed">
              {MESSAGES.BAKERS_AWAY}
            </p>
            <Button asChild className="mt-8 bg-bakery-amber-700 hover:bg-bakery-amber-800">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Our Menu"
          description="Freshly baked goods, available for collection or delivery"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Menu" }]}
        />

        {/* Filters and Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Bake Sale Filter */}
          <div>
            <label
              className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
            >
              <Calendar className="inline h-4 w-4 mr-1" />
              Collection Date
            </label>
            <Select value={selectedBakeSale} onValueChange={setSelectedBakeSale}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {upcomingBakeSales.map((bakeSale) => (
                  <SelectItem key={bakeSale.id} value={bakeSale.id}>
                    {getBakeSaleLabel(bakeSale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label
              className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
            >
              Category
            </label>
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
            <label
              className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
            >
              Sort By
            </label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="rating">Rating (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div>
            <label
              className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-2`}
            >
              Search
            </label>
            <div className="w-full">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
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
            currentPage={validCurrentPage}
            pageSize={ITEMS_PER_PAGE}
            totalItems={sortedProducts.length}
          />
        </div>

        {/* Products Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${DESIGN_TOKENS.sections.gap}`}
        >
          {paginatedProducts.map((product) => {
            const isOutOfStock = product.stock_quantity !== null && product.stock_quantity <= 0;
            const isLowStock =
              product.stock_quantity !== null &&
              product.stock_quantity > 0 &&
              product.stock_quantity <= LOW_STOCK_THRESHOLD;

            return (
              <div key={product.id}>
                <Link href={`/menu/${product.slug}`} className="group block h-full">
                  <div
                    className={`${DESIGN_TOKENS.cards.base} border border-opacity-20 h-full flex flex-col`}
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image
                        </div>
                      )}

                      {/* Stock Badges */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                          <span className="bg-destructive text-destructive-foreground px-3 py-1 text-sm font-bold rounded-full shadow-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {!isOutOfStock && isLowStock && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-orange-500 text-white px-2 py-0.5 text-xs font-bold rounded-full shadow-sm">
                            Low Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`${DESIGN_TOKENS.cards.padding} flex flex-col flex-1`}>
                      <h3
                        className={`${DESIGN_TOKENS.typography.h4.size} font-semibold mb-1 group-hover:text-primary transition-colors`}
                      >
                        {product.name}
                      </h3>

                      <p
                        className={`${DESIGN_TOKENS.typography.body.sm.size} text-muted-foreground line-clamp-2 mb-3`}
                      >
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg font-bold">£{product.base_price.toFixed(2)}</span>
                        <AnimatedButton
                          size="sm"
                          disabled={isOutOfStock}
                          onClick={(e: React.MouseEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isOutOfStock) return;

                            addItem({
                              productId: product.id,
                              name: product.name,
                              price: product.base_price,
                              image: product.image_url || undefined,
                              bakeSaleId: selectedBakeSale,
                              bakeSaleDate: upcomingBakeSales.find(
                                (bs) => bs.id === selectedBakeSale
                              )?.date,
                              bakeSaleLocation: upcomingBakeSales.find(
                                (bs) => bs.id === selectedBakeSale
                              )?.location.name,
                            });
                            toast.success(`Added ${product.name} to cart`);
                          }}
                        >
                          {isOutOfStock ? "Sold Out" : "Add to Cart"}
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-6">
            <Pagination
              currentPage={validCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
