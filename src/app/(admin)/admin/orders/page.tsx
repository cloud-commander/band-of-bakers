import { Suspense } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getPaginatedOrders } from "@/actions/orders";
import { OrdersTable } from "./orders-table";
import { type SearchParams } from "next/dist/server/request/search-params";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: SearchParams;
};

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 20;
  const { orders, total, page: currentPage, pageSize: limit } = await getPaginatedOrders(
    page,
    pageSize
  );

  return (
    <div>
      <PageHeader title="Orders" description="Manage customer orders" />
      <Suspense fallback={<div>Loading orders...</div>}>
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
