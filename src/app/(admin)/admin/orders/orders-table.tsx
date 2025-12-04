"use client";

import { useEffect, useMemo, useState } from "react";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, ChevronUp, ChevronDown, X, Check, Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/orders";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatOrderReference } from "@/lib/utils/order";

type SortField = "created_at" | "bake_sale_date" | "total" | "status";
type SortDirection = "asc" | "desc";
type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "ready"
  | "fulfilled"
  | "cancelled"
  | "refunded"
  | "action_required"
  | "overdue";

// Define the shape of the order with relations
interface OrderWithRelations {
  id: string;
  order_number: number;
  created_at: number | string | Date; // Adjust based on DB schema
  total: number;
  status: string;
  fulfillment_method: string;
  payment_method: string;
  user_id: string;
  bake_sale_id?: string | null;
  item_count?: number;
  // Snapshot fields for historical accuracy
  bake_sale_date_snapshot?: string | null;
  collection_location_name_snapshot?: string | null;
  user?: {
    name: string | null;
    email: string;
  } | null;
  bakeSale?: {
    date: string;
    location: {
      name: string;
    };
  } | null;
}

interface OrdersTableProps {
  initialOrders: OrderWithRelations[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
}

export function OrdersTable({
  initialOrders,
  totalCount,
  currentPage: currentPageProp,
  pageSize = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE,
}: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [currentPage, setCurrentPage] = useState(currentPageProp);
  const [swipedOrderId, setSwipedOrderId] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  // Get all unique bake sales from orders
  const allBakeSales = useMemo(() => {
    const uniqueBakeSales = new Map();
    orders.forEach((order) => {
      if (order.bakeSale && order.bakeSale.date) {
        // Use date as key or ID if available. Order has bake_sale_id.
        // But here we want to list unique bake sales.
        if (order.bake_sale_id && !uniqueBakeSales.has(order.bake_sale_id)) {
          uniqueBakeSales.set(order.bake_sale_id, order.bakeSale);
        }
      }
    });

    return Array.from(uniqueBakeSales.entries())
      .map(([id, bakeSale]) => ({ id, ...bakeSale }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [bakeSaleFilter, setBakeSaleFilter] = useState<string>("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep local state in sync with server-provided data when navigating between pages
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Determine the active bake sale filter
  const activeBakeSaleId = useMemo(() => {
    return bakeSaleFilter;
  }, [bakeSaleFilter]);

  // Helper function to get bake sale date (uses snapshot for historical accuracy)
  const getBakeSaleDate = (order: OrderWithRelations) => {
    const dateStr = order.bake_sale_date_snapshot || order.bakeSale?.date;
    return dateStr ? new Date(dateStr) : null;
  };

  const todayIso = new Date().toISOString().slice(0, 10);
  const isOrderOverdue = (order: OrderWithRelations) => {
    const bakeSaleDate = getBakeSaleDate(order);
    if (!bakeSaleDate) return false;
    const bakeSaleIso = bakeSaleDate.toISOString().slice(0, 10);
    const status = order.status.toLowerCase();
    const eligibleStatuses = ["pending", "processing", "ready", "action_required"];
    return eligibleStatuses.includes(status) && bakeSaleIso < todayIso;
  };

  // Helper function to get customer name
  const getCustomerName = (order: OrderWithRelations) => {
    if (order.user?.name) return order.user.name;
    if (order.user?.email) return order.user.email;
    return "Guest Customer";
  };

  const getItemCount = (order: OrderWithRelations) => {
    // Prefer precomputed item_count; fall back to items length if available
    if (typeof order.item_count === "number") return order.item_count;
    // @ts-expect-error items may be present when fetched with relations
    if (Array.isArray(order.items)) return order.items.length;
    return 0;
  };

  const formatDate = (value: string | number | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) => {
    if (!value) return "N/A";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "N/A";
    return parsed.toLocaleDateString("en-GB", opts);
  };

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // Apply search filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter((order) => {
        const customerName = getCustomerName(order).toLowerCase();
        const bakeSaleDate = order.bakeSale
          ? new Date(order.bakeSale.date).toLocaleDateString("en-GB")
          : "";

        return (
          order.id.toLowerCase().includes(searchLower) ||
          customerName.includes(searchLower) ||
          bakeSaleDate.includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        filtered = filtered.filter((order) => isOrderOverdue(order));
      } else {
        filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter);
      }
    }

    // Apply bake sale filter
    if (activeBakeSaleId) {
      filtered = filtered.filter((order) => order.bake_sale_id === activeBakeSaleId);
    }

    // Sort orders
    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "bake_sale_date":
          aValue = getBakeSaleDate(a)?.getTime() || 0;
          bValue = getBakeSaleDate(b)?.getTime() || 0;
          break;
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "status":
          aValue = a.status.toLowerCase();
          bValue = b.status.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [orders, debouncedSearchTerm, statusFilter, activeBakeSaleId, sortField, sortDirection]);

  // Sync page state with incoming props when navigation happens
  useEffect(() => {
    setCurrentPage(currentPageProp);
  }, [currentPageProp, setCurrentPage]);

  // Calculate pagination using server-provided totals when no client-side filters/search are applied.
  const hasClientFilters = Boolean(debouncedSearchTerm || bakeSaleFilter || statusFilter !== "all");
  const totalPages = hasClientFilters
    ? Math.max(1, Math.ceil(filteredAndSortedOrders.length / pageSize))
    : Math.max(1, Math.ceil(totalCount / pageSize));

  // Paginate orders for mobile view
  const paginatedOrders = filteredAndSortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    // params.set("pageSize", String(pageSize)); // Don't enforce page size in URL
    router.push(`${pathname}?${params.toString()}`);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const getAriaSort = (field: SortField) => {
    if (sortField !== field) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  const handleStatusUpdate = async (
    orderId: string,
    nextStatus: "ready" | "fulfilled",
    successMessage: string
  ) => {
    setUpdatingOrderId(orderId);
    try {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (!result.success) {
        throw new Error(result.error);
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: result.data.status } : order
        )
      );

      toast.success(successMessage);
    } catch (error) {
      toast.error("Failed to update order", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Quick action handlers
  const handleMarkReady = (orderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    void handleStatusUpdate(
      orderId,
      "ready",
      `${formatOrderReference(orderId, orders.find((o) => o.id === orderId)?.order_number)} marked as Ready`
    );
  };

  const handleMarkComplete = (orderId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const orderNumber = orders.find((o) => o.id === orderId)?.order_number;
    void handleStatusUpdate(
      orderId,
      "fulfilled",
      `${formatOrderReference(orderId, orderNumber)} marked as Fulfilled`
    );
  };

  // Get quick action button for order status
  const getQuickAction = (order: OrderWithRelations) => {
    const status = order.status.toLowerCase();
    const isUpdating = updatingOrderId === order.id;

    if (status === "pending" || status === "processing") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          onClick={(e) => handleMarkReady(order.id, e)}
          disabled={isUpdating}
          aria-busy={isUpdating}
        >
          <Package className="w-4 h-4 mr-1" />
          {isUpdating ? "Updating..." : "Ready"}
        </Button>
      );
    }

    if (status === "ready") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
          onClick={(e) => handleMarkComplete(order.id, e)}
          disabled={isUpdating}
          aria-busy={isUpdating}
        >
          <Check className="w-4 h-4 mr-1" />
          {isUpdating ? "Updating..." : "Complete"}
        </Button>
      );
    }

    return null;
  };

  const handleTouchStart = (orderId: string, e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    if (swipedOrderId && swipedOrderId !== orderId) {
      setSwipedOrderId(null);
    }
  };

  const handleTouchMove = (orderId: string, e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.touches[0].clientX - touchStartX;
    if (deltaX < -30) {
      setSwipedOrderId(orderId);
    } else if (deltaX > 30) {
      setSwipedOrderId(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-9 w-full"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bake Sale Filter */}
          <Select
            value={activeBakeSaleId}
            onValueChange={(value) => {
              setBakeSaleFilter(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-12 text-base bg-white border-stone-200">
              <SelectValue placeholder="All Bake Sales" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-base py-3">
                All Bake Sales
              </SelectItem>
              {allBakeSales.map((bakeSale) => (
                <SelectItem key={bakeSale.id} value={bakeSale.id} className="text-base py-3">
                  {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as StatusFilter);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-12 text-base bg-white border-stone-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-base py-3">
                All Status
              </SelectItem>
              <SelectItem value="pending" className="text-base py-3">
                Pending
              </SelectItem>
              <SelectItem value="processing" className="text-base py-3">
                Processing
              </SelectItem>
              <SelectItem value="ready" className="text-base py-3">
                Ready for Collection
              </SelectItem>
              <SelectItem value="fulfilled" className="text-base py-3">
                Fulfilled
              </SelectItem>
              <SelectItem value="cancelled" className="text-base py-3">
                Cancelled
              </SelectItem>
              <SelectItem value="refunded" className="text-base py-3">
                Refunded
              </SelectItem>
              <SelectItem value="action_required" className="text-base py-3">
                Action Required
              </SelectItem>
              <SelectItem value="overdue" className="text-base py-3">
                Overdue
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={statusFilter === "overdue" ? "default" : "outline"}
            onClick={() => setStatusFilter(statusFilter === "overdue" ? "all" : "overdue")}
          >
            {statusFilter === "overdue" ? "Showing Overdue" : "Show Overdue"}
          </Button>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={hasClientFilters ? filteredAndSortedOrders.length : totalCount}
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-0 font-medium" aria-sort={getAriaSort("created_at")}>
                <button
                  onClick={() => handleSort("created_at")}
                  className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                >
                  Order Date {getSortIcon("created_at")}
                </button>
              </th>
              <th className="text-left p-0 font-medium" aria-sort={getAriaSort("bake_sale_date")}>
                <button
                  onClick={() => handleSort("bake_sale_date")}
                  className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                >
                  Bake Sale {getSortIcon("bake_sale_date")}
                </button>
              </th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-0 font-medium" aria-sort={getAriaSort("status")}>
                <button
                  onClick={() => handleSort("status")}
                  className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                >
                  Status {getSortIcon("status")}
                </button>
              </th>
              <th className="text-left p-0 font-medium" aria-sort={getAriaSort("total")}>
                <button
                  onClick={() => handleSort("total")}
                  className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                >
                  Total {getSortIcon("total")}
                </button>
              </th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDate(order.created_at, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {(() => {
                    const bakeSaleDate = getBakeSaleDate(order);
                    return bakeSaleDate
                      ? bakeSaleDate.toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";
                  })()}
                </td>
                <td className="p-4 text-sm font-medium">{getCustomerName(order)}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      order.status.toLowerCase() === "pending" &&
                        "bg-amber-50 text-amber-700 border-amber-200",
                      order.status.toLowerCase() === "processing" &&
                        "bg-blue-50 text-blue-700 border-blue-200",
                      order.status.toLowerCase() === "ready" &&
                        "bg-indigo-50 text-indigo-700 border-indigo-200",
                      order.status.toLowerCase() === "completed" &&
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                      order.status.toLowerCase() === "cancelled" &&
                        "bg-red-50 text-red-700 border-red-200",
                      order.status.toLowerCase() === "action_required" &&
                        "bg-amber-50 text-amber-800 border-amber-200"
                    )}
                  >
                    {order.status}
                  </Badge>
                  {isOrderOverdue(order) && (
                    <Badge variant="destructive" className="ml-2">
                      Overdue
                    </Badge>
                  )}
                  <Badge variant="secondary" className="ml-2 capitalize">
                    {order.fulfillment_method}
                  </Badge>
                  <Badge variant="outline" className="ml-2 capitalize">
                    {order.payment_method.replace(/_/g, " ")}
                  </Badge>
                </td>
                <td className="p-4 font-medium font-serif">
                  <div className="flex flex-col items-start gap-1">
                    <span>£{order.total.toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground">
                      {getItemCount(order)} item{getItemCount(order) !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {getQuickAction(order)}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedOrders.map((order) => (
          <div
            key={order.id}
            className="relative overflow-hidden rounded-lg border bg-white shadow-sm"
            onTouchStart={(e) => handleTouchStart(order.id, e)}
            onTouchMove={(e) => handleTouchMove(order.id, e)}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center gap-2 pr-4 bg-gradient-to-l from-white to-white/0 transition-transform",
                swipedOrderId === order.id ? "translate-x-0" : "translate-x-full"
              )}
            >
              {getQuickAction(order)}
              <Button variant="ghost" size="sm" className="bg-white/80" asChild>
                <Link href={`/admin/orders/${order.id}`}>Open</Link>
              </Button>
            </div>
            <Link
              href={`/admin/orders/${order.id}`}
              className={cn(
                "block p-4 transition-transform",
                swipedOrderId === order.id ? "-translate-x-20" : "translate-x-0"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Order {formatOrderReference(order.id, order.order_number)}
                  </p>
                  <p className="font-medium text-sm">{getCustomerName(order)}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    order.status.toLowerCase() === "pending" &&
                      "bg-amber-50 text-amber-700 border-amber-200",
                    order.status.toLowerCase() === "processing" &&
                      "bg-blue-50 text-blue-700 border-blue-200",
                    order.status.toLowerCase() === "ready" &&
                      "bg-indigo-50 text-indigo-700 border-indigo-200",
                    order.status.toLowerCase() === "completed" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200",
                    order.status.toLowerCase() === "cancelled" &&
                      "bg-red-50 text-red-700 border-red-200",
                    order.status.toLowerCase() === "action_required" &&
                      "bg-amber-50 text-amber-800 border-amber-200"
                  )}
                >
                  {order.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-medium">{formatDate(order.created_at, { day: "numeric", month: "short" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bake Sale</p>
                  <p className="font-medium">
                    {(() => {
                      const bakeSaleDate = getBakeSaleDate(order);
                      return bakeSaleDate
                        ? bakeSaleDate.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : "N/A";
                    })()}
                  </p>
                </div>
              </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="font-serif font-bold text-lg">£{order.total.toFixed(2)}</span>
                  <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
                    {isOrderOverdue(order) && <Badge variant="destructive">Overdue</Badge>}
                    {getQuickAction(order)}
                  </div>
                </div>
            </Link>
          </div>
        ))}
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
