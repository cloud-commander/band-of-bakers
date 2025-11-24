"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockProductsWithVariants, mockProductCategories } from "@/lib/mocks/products";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_PRODUCTS_ITEMS_PER_PAGE;

export default function AdminProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const products = mockProductsWithVariants;
  const categories = mockProductCategories;

  // Calculate pagination
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={products.length}
        />
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => {
              const category = categories.find((c) => c.id === product.category_id);
              return (
                <tr key={product.id} className="border-t hover:bg-muted/30">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{category?.name}</td>
                  <td className="p-4 font-medium">£{product.base_price.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge variant={product.is_active ? "default" : "secondary"}>
                      {product.is_active ? "Active" : "Inactive"}
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
