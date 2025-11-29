"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X, ImageOff } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import type { ProductCategory } from "@/lib/repositories/category.repository";

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

interface AdminProductsTableProps {
  initialProducts: Product[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
  categories: ProductCategory[];
}

export function AdminProductsTable({
  initialProducts,
  totalCount,
  currentPage,
  pageSize = PAGINATION_CONFIG.ADMIN_PRODUCTS_ITEMS_PER_PAGE,
  categories,
}: AdminProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageState, setPageState] = useState(currentPage);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    setPageState(currentPage);
  }, [currentPage]);

  // Filters
  let filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (debouncedSearchQuery) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }

  // Sorting
  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    return copy.sort((a, b) => {
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
  }, [filteredProducts, sortBy]);

  const hasClientFilters = Boolean(debouncedSearchQuery || selectedCategory);
  const totalPages = hasClientFilters
    ? Math.max(1, Math.ceil(sortedProducts.length / pageSize))
    : Math.max(1, Math.ceil(totalCount / pageSize));

  // When client filters are active, paginate client-side; otherwise rely on server paging.
  const startIndex = hasClientFilters ? (pageState - 1) * pageSize : 0;
  const endIndex = hasClientFilters ? startIndex + pageSize : sortedProducts.length;
  const paginatedProducts = hasClientFilters ? sortedProducts.slice(startIndex, endIndex) : sortedProducts;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    router.push(`${pathname}?${params.toString()}`);
    setPageState(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId === "all" ? null : categoryId);
    setPageState(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setPageState(1);
  };

  const hasActiveFilters = selectedCategory !== null || searchQuery !== "";

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
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

          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Category: {categories.find((c) => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-2">
                Search: {searchQuery}
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Category</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Price</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Variants</th>
              <th className="p-4 text-left text-sm font-medium text-muted-foreground">Image</th>
              <th className="p-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">/{product.slug}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {categories.find((c) => c.id === product.category_id)?.name || "Unassigned"}
                </td>
                <td className="p-4 text-sm font-medium">£{product.base_price.toFixed(2)}</td>
                <td className="p-4">
                  <Badge
                    variant={product.is_active ? "default" : "secondary"}
                    className={product.is_active ? "bg-green-100 text-green-700" : ""}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{product.variants?.length || 0} variants</td>
                <td className="p-4">
                  {product.image_url ? (
                    <div className="w-12 h-12 rounded overflow-hidden border bg-muted relative">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded border bg-muted flex items-center justify-center text-muted-foreground">
                      <ImageOff className="h-5 w-5" />
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${product.id}`} className="text-primary">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <PaginationInfo
          currentPage={pageState}
          pageSize={pageSize}
          totalItems={hasClientFilters ? sortedProducts.length : totalCount}
        />
        <Pagination currentPage={pageState} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
