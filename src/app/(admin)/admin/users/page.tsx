"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/state/page-header";
import { getUsers } from "@/actions/users";
import type { User } from "@/lib/repositories/user.repository";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
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
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

type SortField = "name" | "email" | "created_at" | "phone";
type SortDirection = "asc" | "desc";
type BanFilter = "all" | "active" | "banned";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
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

  // Filter and sort users
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

  // Edit user handlers
  const handleEditSave = () => {
    if (!selectedUser) return;

    // In Phase 4, this will call an API
    toast.success(`User ${editForm.name} updated successfully`, {
      description: "Changes will be reflected in the database",
    });

    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

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

        {/* Ban Status Filter */}
        <select
          value={banFilter}
          onChange={(e) => {
            setBanFilter(e.target.value as BanFilter);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-stone-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
        >
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="banned">Banned Only</option>
        </select>
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
      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-x-auto">
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
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className={cn(
                  "border-t hover:bg-muted/30 transition-colors",
                  user.is_banned && "bg-red-50/50"
                )}
              >
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.phone || "—"}</td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <Badge variant={user.email_verified ? "default" : "secondary"}>
                      {user.email_verified ? "Verified" : "Unverified"}
                    </Badge>
                    {user.is_banned && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Banned
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString("en-GB")}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Link href={`/admin/users/${user.id}`}>
                        <Edit className="w-4 h-4 mr-1" />
                        View
                      </Link>
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
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className={cn(
              "border rounded-lg p-4 hover:bg-muted/30 transition-colors",
              user.is_banned && "bg-red-50/50"
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p>{user.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p>{new Date(user.created_at).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="col-span-2 flex gap-2">
                <Badge variant={user.email_verified ? "default" : "secondary"}>
                  {user.email_verified ? "Verified" : "Unverified"}
                </Badge>
                {user.is_banned && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Banned
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Link href={`/admin/users/${user.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        ))}
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user profile information. Email cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email (Read-only)</Label>
              <Input
                id="edit-email"
                value={selectedUser?.email || ""}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email addresses cannot be changed</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="+447700900000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editForm.role}
                onValueChange={(value) => setEditForm({ ...editForm, role: value as User["role"] })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-avatar">Avatar URL</Label>
              <Input
                id="edit-avatar"
                value={editForm.avatar_url}
                onChange={(e) => setEditForm({ ...editForm, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-muted-foreground">
                In Phase 4, this will be a file upload
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
