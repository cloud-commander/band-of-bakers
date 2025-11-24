"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockUsers } from "@/lib/mocks/users";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

type SortField = "name" | "email" | "created_at" | "phone";
type SortDirection = "asc" | "desc";

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = mockUsers.filter((user) => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower))
      );
    });

    return filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "phone":
          aValue = a.phone || "";
          bValue = b.phone || "";
          break;
        case "created_at":
        default:
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [debouncedSearchTerm, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when sorting
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

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts" />

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
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
      </div>

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={filteredAndSortedUsers.length}
        />
      </div>

      {filteredAndSortedUsers.length === 0 ? (
        <div className="border rounded-lg p-12 text-center">
          <div className="text-muted-foreground">
            {searchTerm ? "No users found matching your search." : "No users found."}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-0 font-medium" aria-sort={getAriaSort("name")}>
                  <button
                    onClick={() => handleSort("name")}
                    className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                  >
                    Name {getSortIcon("name")}
                  </button>
                </th>
                <th className="text-left p-0 font-medium" aria-sort={getAriaSort("email")}>
                  <button
                    onClick={() => handleSort("email")}
                    className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                  >
                    Email {getSortIcon("email")}
                  </button>
                </th>
                <th className="text-left p-4 font-medium">Telephone</th>
                <th className="text-left p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-0 font-medium" aria-sort={getAriaSort("created_at")}>
                  <button
                    onClick={() => handleSort("created_at")}
                    className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                  >
                    Joined {getSortIcon("created_at")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-muted/30">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.phone || "—"}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant={user.email_verified ? "default" : "secondary"}>
                      {user.email_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
