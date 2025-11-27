import { Suspense } from "react";
import { PageHeader } from "@/components/state/page-header";
import { getOrders } from "@/actions/orders";
import { OrdersTable } from "./orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <PageHeader title="Orders" description="Manage customer orders" />
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersTable initialOrders={orders} />
      </Suspense>
    </div>
  );
}
