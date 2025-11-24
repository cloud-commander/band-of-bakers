"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockUsers } from "@/lib/mocks/users";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_USERS_ITEMS_PER_PAGE;

export default function AdminUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const users = mockUsers;

  // Calculate pagination
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts" />

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={users.length}
        />
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
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
