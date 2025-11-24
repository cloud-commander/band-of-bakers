"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { mockProducts, mockProductCategories } from "@/lib/mocks/products";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AnimatedButton } from "@/components/ui/animated-button";
import { mockReviews, Review } from "@/lib/mocks/reviews";
import { StarRating } from "@/components/ui/star-rating";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.MENU_ITEMS_PER_PAGE;

export const dynamic = "force-dynamic";

type SortOption = "name" | "price-low" | "price-high" | "rating";

function MenuPageContent() {
  const { addItem } = useCart();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");

  const allProducts = mockProducts.filter((p) => p.is_active);
  const categories = mockProductCategories;

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
      case "rating": {
        const aReviews = mockReviews.filter((r: Review) => r.product_id === a.id);
        const bReviews = mockReviews.filter((r: Review) => r.product_id === b.id);
        const aRating =
          aReviews.length > 0
            ? aReviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / aReviews.length
            : 0;
        const bRating =
          bReviews.length > 0
            ? bReviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / bReviews.length
            : 0;
        return bRating - aRating;
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

  // Reset to page 1 when search query or sort changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== null || searchQuery !== "";

  return (
    <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Our Menu"
          description="Freshly baked goods, available for collection or delivery"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Menu" }]}
        />

        {/* Category Filters & Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(null)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low-High)</SelectItem>
              <SelectItem value="price-high">Price (High-Low)</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                Category: {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="ml-1 hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-6 px-2 text-xs"
            >
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

        {/* Products Grid */}
        <motion.div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${DESIGN_TOKENS.sections.gap}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {paginatedProducts.map((product) => {
            const isOutOfStock = product.stock_quantity === 0;
            const isLowStock =
              product.stock_quantity !== null &&
              product.stock_quantity !== undefined &&
              product.stock_quantity > 0 &&
              product.stock_quantity < 5;

            return (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
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

                      {/* Rating */}
                      {(() => {
                        const productReviews = mockReviews.filter(
                          (r: Review) => r.product_id === product.id
                        );
                        const averageRating: number =
                          productReviews.length > 0
                            ? productReviews.reduce((acc: number, r: Review) => acc + r.rating, 0) /
                              productReviews.length
                            : 0;

                        if (averageRating === 0) return <div className="mb-3" />; // Spacer

                        return (
                          <div className="flex items-center gap-1 mb-3">
                            <StarRating rating={averageRating} size={14} />
                            <span className="text-xs text-muted-foreground">
                              ({productReviews.length})
                            </span>
                          </div>
                        );
                      })()}

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
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}
    >
      <MenuPageContent />
    </Suspense>
  );
}
