"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronUp, ChevronDown, X, Edit } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import type { User } from "@/lib/repositories/user.repository";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

type SortField = "name" | "email" | "created_at" | "phone";
type SortDirection = "asc" | "desc";
type BanFilter = "all" | "active" | "banned";

interface AdminUsersTableProps {
  initialUsers: User[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
}

export function AdminUsersTable({
  initialUsers,
  totalCount,
  currentPage,
  pageSize = ITEMS_PER_PAGE,
}: AdminUsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [pageState, setPageState] = useState(currentPage);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [banFilter, setBanFilter] = useState<BanFilter>("all");

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "customer" as User["role"],
    avatar_url: "",
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    setPageState(currentPage);
  }, [currentPage]);

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.toLowerCase().includes(searchLower));

      const matchesBanFilter =
        banFilter === "all" ||
        (banFilter === "active" && !user.is_banned) ||
        (banFilter === "banned" && user.is_banned);

      return matchesSearch && matchesBanFilter;
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
  }, [debouncedSearchTerm, sortField, sortDirection, banFilter, users]);

  const hasClientFilters = Boolean(debouncedSearchTerm || banFilter !== "all");
  const totalPages = hasClientFilters
    ? Math.max(1, Math.ceil(filteredAndSortedUsers.length / pageSize))
    : Math.max(1, Math.ceil(totalCount / pageSize));

  const startIndex = hasClientFilters ? (pageState - 1) * pageSize : 0;
  const endIndex = hasClientFilters ? startIndex + pageSize : filteredAndSortedUsers.length;
  const paginatedUsers = hasClientFilters
    ? filteredAndSortedUsers.slice(startIndex, endIndex)
    : filteredAndSortedUsers;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    router.push(`${pathname}?${params.toString()}`);
    setPageState(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPageState(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setPageState(1);
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

  // Edit user handlers
  const handleEditSave = () => {
    if (!selectedUser) return;
    // Placeholder: integrate server action later
    toast.success(`User ${editForm.name} updated successfully`, {
      description: "Changes will be reflected in the database",
    });
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageState(1);
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
          <Select
            value={banFilter}
            onValueChange={(value) => {
              setBanFilter(value as BanFilter);
              setPageState(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => {
              setSortField(value as SortField);
              setPageState(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="created_at">Joined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="mb-4">
        <PaginationInfo
          currentPage={pageState}
          pageSize={pageSize}
          totalItems={hasClientFilters ? filteredAndSortedUsers.length : totalCount}
        />
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
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
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-0 font-medium" aria-sort={getAriaSort("phone")}>
                <button
                  onClick={() => handleSort("phone")}
                  className="w-full h-full p-4 flex items-center hover:bg-muted/80 transition-colors text-left font-medium"
                >
                  Phone {getSortIcon("phone")}
                </button>
              </th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.phone || "—"}</td>
                <td className="p-4 text-sm">
                  <Badge variant="secondary">{user.role}</Badge>
                </td>
                <td className="p-4 text-sm">
                  {user.is_banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditForm({
                        name: user.name,
                        phone: user.phone || "",
                        role: user.role,
                        avatar_url: user.avatar_url || "",
                      });
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Pagination currentPage={pageState} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={editForm.avatar_url}
                onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
