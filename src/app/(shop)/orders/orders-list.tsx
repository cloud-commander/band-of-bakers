"use client";

import { PageHeader } from "@/components/state/page-header";
import { EmptyState } from "@/components/state/empty-state";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { formatOrderReference } from "@/lib/utils/order";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  ready: "bg-purple-100 text-purple-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
} as const;

const fulfillmentColors = {
  collection: "bg-emerald-50 text-emerald-700",
  delivery: "bg-blue-50 text-blue-700",
} as const;

// Define shape matching getUserOrders return type
interface OrdersListProps {
  orders: Array<{
    id: string;
    order_number?: number | null;
    created_at: number | string | Date;
    total: number;
    status: string;
    fulfillment_method: string;
    item_count?: number;
    bakeSaleDate?: string | null;
    bakeSaleLocation?: string | null;
  }>;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  sort: "newest" | "oldest";
}

export function OrdersList({ orders, totalItems, currentPage, pageSize, sort }: OrdersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  if (orders.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader title="My Orders" />
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders. Start shopping to see your orders here."
            actionLabel="Browse Products"
            actionHref="/menu"
          />
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    params.set("sort", sort);
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="My Orders"
          description="View and track your orders"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Orders" }]}
        />

        {/* Pagination Info */}
        <div className="mb-6">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
          />
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams?.toString() || "");
                params.set("page", "1");
                params.set("pageSize", String(pageSize));
                params.set("sort", e.target.value);
                router.push(`${pathname}?${params.toString()}`);
              }}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      Order {formatOrderReference(order.id, order.order_number)}
                    </h3>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {order.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={fulfillmentColors[order.fulfillment_method as "collection" | "delivery"]}
                    >
                      {order.fulfillment_method}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {order.fulfillment_method}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.item_count ?? 0} item{(order.item_count ?? 0) !== 1 ? "s" : ""}
                  </p>
                  {order.bakeSaleDate && (
                    <p className="text-sm text-muted-foreground">
                      Bake Sale:{" "}
                      {new Date(order.bakeSaleDate).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      {order.bakeSaleLocation ? `• ${order.bakeSaleLocation}` : ""}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">£{order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.fulfillment_method}
                  </p>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-6 pb-24">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          </div>
        )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur border rounded-full shadow-lg px-4 py-2 flex items-center justify-center pointer-events-auto">
              <Pagination
                aria-label="Orders pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
