/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import type { Voucher } from "@/db/schema";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown, X, Edit, Trash2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import {
  formatVoucherType,
  formatVoucherValue,
  getVoucherStatus,
  formatUsage,
} from "@/lib/utils/voucher";
import Link from "next/link";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

type SortField = "code" | "type" | "value" | "valid_until" | "current_uses";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "active" | "expired" | "maxed" | "inactive";

interface VouchersTableProps {
  vouchers: Voucher[];
}

export function VouchersTable({ vouchers }: VouchersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortField, setSortField] = useState<SortField>("valid_until");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter and sort vouchers
  const filteredAndSortedVouchers = useMemo(() => {
    const filtered = vouchers.filter((voucher) => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch = voucher.code.toLowerCase().includes(searchLower);

      const status = getVoucherStatus(voucher as any);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "code":
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case "type":
          aValue = a.type;
          bValue = b.type;
          break;
        case "value":
          aValue = a.value;
          bValue = b.value;
          break;
        case "current_uses":
          aValue = a.current_uses;
          bValue = b.current_uses;
          break;
        case "valid_until":
        default:
          aValue = new Date(a.valid_until).getTime();
          bValue = new Date(b.valid_until).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [vouchers, debouncedSearchTerm, sortField, sortDirection, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedVouchers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedVouchers = filteredAndSortedVouchers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
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

  const getStatusBadge = (voucher: Voucher) => {
    const status = getVoucherStatus(voucher as any);

    const variants = {
      active: { variant: "default" as const, label: "Active", className: "" },
      expired: {
        variant: "outline" as const,
        label: "Expired",
        className: "bg-red-50 text-red-700 border-red-200",
      },
      maxed: {
        variant: "outline" as const,
        label: "Max Uses",
        className: "bg-orange-50 text-orange-700 border-orange-200",
      },
      inactive: { variant: "secondary" as const, label: "Inactive", className: "" },
    };

    const config = variants[status];

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const handleDelete = (voucher: Voucher) => {
    toast.success(`Voucher ${voucher.code} deleted`, {
      description: "The voucher has been removed",
    });
  };

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vouchers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-9"
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StatusFilter);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-stone-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
        >
          <option value="all">All Vouchers</option>
          <option value="active">Active Only</option>
          <option value="expired">Expired</option>
          <option value="maxed">Max Uses Reached</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={filteredAndSortedVouchers.length}
        />
      </div>

      {filteredAndSortedVouchers.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "No vouchers found matching your search." : "No vouchers found."}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-0 font-medium" aria-sort={getAriaSort("code")}>
                    <button
                      onClick={() => handleSort("code")}
                      className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                    >
                      Code {getSortIcon("code")}
                    </button>
                  </th>
                  <th className="text-left p-0 font-medium" aria-sort={getAriaSort("type")}>
                    <button
                      onClick={() => handleSort("type")}
                      className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                    >
                      Type {getSortIcon("type")}
                    </button>
                  </th>
                  <th className="text-left p-0 font-medium" aria-sort={getAriaSort("value")}>
                    <button
                      onClick={() => handleSort("value")}
                      className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                    >
                      Value {getSortIcon("value")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">Min Order</th>
                  <th className="text-left p-0 font-medium" aria-sort={getAriaSort("current_uses")}>
                    <button
                      onClick={() => handleSort("current_uses")}
                      className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                    >
                      Uses {getSortIcon("current_uses")}
                    </button>
                  </th>
                  <th className="text-left p-0 font-medium" aria-sort={getAriaSort("valid_until")}>
                    <button
                      onClick={() => handleSort("valid_until")}
                      className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                    >
                      Valid Until {getSortIcon("valid_until")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVouchers.map((voucher) => (
                  <tr key={voucher.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono font-medium">{voucher.code}</td>
                    <td className="p-4 text-sm">
                      {formatVoucherType(voucher.type as "percentage" | "fixed_amount")}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {formatVoucherValue(voucher as any)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      £{voucher.min_order_value.toFixed(2)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatUsage(voucher as any)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(voucher.valid_until).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">{getStatusBadge(voucher)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/admin/vouchers/${voucher.id}/edit`}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(voucher)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
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
            {paginatedVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono font-medium text-lg">{voucher.code}</p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {formatVoucherValue(voucher as any)} off
                    </p>
                  </div>
                  {getStatusBadge(voucher)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p>{formatVoucherType(voucher.type as "percentage" | "fixed_amount")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Min Order</p>
                    <p>£{voucher.min_order_value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Usage</p>
                    <p>{formatUsage(voucher as any)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Valid Until</p>
                    <p>
                      {new Date(voucher.valid_until).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={`/admin/vouchers/${voucher.id}/edit`}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(voucher)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

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
    </>
  );
}
