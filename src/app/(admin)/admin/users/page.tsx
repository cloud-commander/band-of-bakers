"use server";

import { PageHeader } from "@/components/state/page-header";
import { getPaginatedUsers } from "@/actions/users";
import { Suspense } from "react";
import { AdminUsersTable } from "./users-table";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 20;

  const searchParam = params?.search;
  const search = Array.isArray(searchParam) ? searchParam[0] : searchParam || undefined;

  const roleParam = params?.role;
  const role = Array.isArray(roleParam) ? roleParam[0] : roleParam || undefined;

  const statusParam = params?.status;
  const status = Array.isArray(statusParam) ? statusParam[0] : statusParam || undefined;

  const is_banned = status === "banned" ? true : status === "active" ? false : undefined;

  const {
    users,
    total,
    page: currentPage,
    pageSize: limit,
  } = await getPaginatedUsers(page, pageSize, {
    search,
    role,
    is_banned,
  });

  return (
    <div>
      <PageHeader title="Users" description="Manage user accounts" />
      <Suspense fallback={<div>Loading users...</div>}>
        <AdminUsersTable
          initialUsers={users}
          totalCount={total}
          currentPage={currentPage}
          pageSize={limit}
        />
      </Suspense>
    </div>
  );
}
