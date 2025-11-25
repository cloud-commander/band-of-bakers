"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockBakeSalesWithLocation, mockPastBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_BAKE_SALES_ITEMS_PER_PAGE;

export const dynamic = "force-dynamic";

export default function AdminBakeSalesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);

  const upcomingBakeSales = mockBakeSalesWithLocation;
  const archivedBakeSales = mockPastBakeSalesWithLocation;

  // Calculate pagination for upcoming
  const totalUpcomingPages = Math.ceil(upcomingBakeSales.length / ITEMS_PER_PAGE);
  const startUpcomingIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endUpcomingIndex = startUpcomingIndex + ITEMS_PER_PAGE;
  const paginatedUpcoming = upcomingBakeSales.slice(startUpcomingIndex, endUpcomingIndex);

  // Calculate pagination for archived
  const totalArchivedPages = Math.ceil(archivedBakeSales.length / ITEMS_PER_PAGE);
  const startArchivedIndex = (archivedPage - 1) * ITEMS_PER_PAGE;
  const endArchivedIndex = startArchivedIndex + ITEMS_PER_PAGE;
  const paginatedArchived = archivedBakeSales.slice(startArchivedIndex, endArchivedIndex);

  const handleUpcomingPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleArchivedPageChange = (page: number) => {
    setArchivedPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBakeSalesTable = (bakeSales: typeof paginatedUpcoming, isArchived = false) => (
    <div className="border rounded-lg">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-medium">Date</th>
            <th className="text-left p-4 font-medium">Location</th>
            <th className="text-left p-4 font-medium">Cutoff</th>
            {!isArchived && <th className="text-left p-4 font-medium">Status</th>}
            {isArchived && <th className="text-left p-4 font-medium">Orders</th>}
            <th className="text-right p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bakeSales.map((bakeSale) => (
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
              {!isArchived && (
                <td className="p-4">
                  <Badge variant={bakeSale.is_active ? "default" : "secondary"}>
                    {bakeSale.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
              )}
              {isArchived && (
                <td className="p-4 text-sm text-muted-foreground">
                  {/* In Phase 4, this will show actual order count */}-
                </td>
              )}
              <td className="p-4 text-right">
                <Button variant="ghost" size="sm">
                  {isArchived ? "View" : "Edit"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Bake Sales"
        description="Manage upcoming and archived bake sale dates"
        actions={<Button>Add Bake Sale</Button>}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBakeSales.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedBakeSales.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={upcomingBakeSales.length}
            />
          </div>

          {renderBakeSalesTable(paginatedUpcoming, false)}

          {/* Pagination Controls */}
          {totalUpcomingPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalUpcomingPages}
                onPageChange={handleUpcomingPageChange}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={archivedPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={archivedBakeSales.length}
            />
          </div>

          {archivedBakeSales.length > 0 ? (
            <>
              {renderBakeSalesTable(paginatedArchived, true)}

              {/* Pagination Controls */}
              {totalArchivedPages > 1 && (
                <div className="mt-8 flex flex-col items-center gap-6">
                  <Pagination
                    currentPage={archivedPage}
                    totalPages={totalArchivedPages}
                    onPageChange={handleArchivedPageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="border rounded-lg p-12 text-center text-muted-foreground">
              <p>No archived bake sales yet.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
