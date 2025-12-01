import { Suspense } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getPaginatedOrders } from "@/actions/orders";
import { OrdersTable } from "./orders-table";
import { AdminOrdersSkeleton } from "@/components/skeletons/admin-orders-skeleton";

import { PAGINATION_CONFIG } from "@/lib/constants/pagination";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE;
  const {
    orders,
    total,
    page: currentPage,
    pageSize: limit,
  } = await getPaginatedOrders(page, pageSize);

  return (
    <div>
      <PageHeader title="Orders" description="Manage customer orders" />
      <Suspense fallback={<AdminOrdersSkeleton />}>
        <OrdersTable
          initialOrders={orders}
          totalCount={total}
          currentPage={currentPage}
          pageSize={limit}
        />
      </Suspense>
    </div>
  );
}
