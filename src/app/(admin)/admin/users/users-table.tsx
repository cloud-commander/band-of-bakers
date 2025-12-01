"use client";

import { useEffect, useState } from "react";
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
import { updateUser } from "@/actions/users";
import { AvatarUpload } from "@/components/ui/avatar-upload";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

type SortField = "name" | "email" | "created_at" | "phone";
type SortDirection = "asc" | "desc";
type BanFilter = "all" | "active" | "banned";
type RoleFilter = "all" | "customer" | "staff" | "manager" | "owner";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams?.get("search") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [banFilter, setBanFilter] = useState<BanFilter>(
    (searchParams?.get("status") as BanFilter) || "all"
  );
  const [roleFilter, setRoleFilter] = useState<RoleFilter>(
    (searchParams?.get("role") as RoleFilter) || "all"
  );
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  // const [pageState, setPageState] = useState(currentPage); // Removed as we rely on URL param

  // Sync debounced search with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to page 1 on search
    router.push(`${pathname}?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, router, pathname]);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "customer" as User["role"],
    avatar_url: "" as string | null,
    avatarFile: null as File | null,
  });

  // Update URL when filters change
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    // setPageState(1); // Removed
  };

  const clearSearch = () => {
    setSearchTerm("");
    // URL update handled by useEffect
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
  const handleEditSave = async () => {
    if (!selectedUser) return;

    try {
      const result = await updateUser(selectedUser.id, {
        name: editForm.name,
        phone: editForm.phone,
        role: editForm.role as "customer" | "staff" | "manager" | "owner",
        avatar: editForm.avatarFile !== null ? editForm.avatarFile : editForm.avatar_url,
      });

      if (result.success) {
        toast.success(`User ${editForm.name} updated successfully`);
        setEditDialogOpen(false);
        setSelectedUser(null);
        // Refresh the page to show updated data
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      toast.error("An unexpected error occurred");
    }
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            value={banFilter}
            onValueChange={(value) => {
              setBanFilter(value as BanFilter);
              updateFilter("status", value);
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
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value as RoleFilter);
              updateFilter("role", value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortField}
            onValueChange={(value) => {
              setSortField(value as SortField);
              // setPageState(1); // Removed
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
        <PaginationInfo currentPage={currentPage} pageSize={pageSize} totalItems={totalCount} />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border rounded-lg shadow-sm bg-white">
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
            {initialUsers.map((user) => (
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
                        avatar_url: user.avatar_url || null,
                        avatarFile: null,
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {initialUsers.map((user) => (
          <div key={user.id} className="border rounded-lg p-4 bg-white shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-foreground">{user.name}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              {user.is_banned ? (
                <Badge variant="destructive">Banned</Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <Badge variant="secondary" className="mt-1">
                  {user.role}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Joined</p>
                <p>
                  {new Date(user.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p>{user.phone || "—"}</p>
              </div>
            </div>

            <div className="pt-3 border-t flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedUser(user);
                  setEditForm({
                    name: user.name,
                    phone: user.phone || "",
                    role: user.role,
                    avatar_url: user.avatar_url || null,
                    avatarFile: null,
                  });
                  setEditDialogOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center pb-4">
              <AvatarUpload
                name={editForm.name}
                currentAvatarUrl={editForm.avatar_url}
                onAvatarChange={(file) => {
                  if (file) {
                    setEditForm({ ...editForm, avatarFile: file });
                  } else {
                    // If file is null, it means remove avatar
                    setEditForm({ ...editForm, avatarFile: null, avatar_url: null });
                  }
                }}
                variant="overlay"
                size="xl"
              />
            </div>
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
