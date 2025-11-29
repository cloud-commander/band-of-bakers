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
  const {
    users,
    total,
    page: currentPage,
    pageSize: limit,
  } = await getPaginatedUsers(page, pageSize);

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
