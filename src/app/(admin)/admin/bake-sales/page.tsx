"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_BAKE_SALES_ITEMS_PER_PAGE;

export default function AdminBakeSalesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const bakeSales = mockBakeSalesWithLocation;

  // Calculate pagination
  const totalPages = Math.ceil(bakeSales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBakeSales = bakeSales.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader
        title="Bake Sales"
        description="Manage upcoming bake sale dates"
        actions={<Button>Add Bake Sale</Button>}
      />

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={bakeSales.length}
        />
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Location</th>
              <th className="text-left p-4 font-medium">Cutoff</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBakeSales.map((bakeSale) => (
              <tr key={bakeSale.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">
                  {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-sm">{bakeSale.location.name}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB")}
                </td>
                <td className="p-4">
                  <Badge variant={bakeSale.is_active ? "default" : "secondary"}>
                    {bakeSale.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
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
