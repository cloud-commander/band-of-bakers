"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockOrdersWithItems } from "@/lib/mocks/orders";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE;

export default function AdminOrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const orders = mockOrdersWithItems;

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader title="Orders" description="Manage customer orders" />

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={orders.length}
        />
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Order ID</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{order.id}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-sm">{order.user_id}</td>
                <td className="p-4">
                  <Badge>{order.status}</Badge>
                </td>
                <td className="p-4 font-medium">£{order.total.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
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
