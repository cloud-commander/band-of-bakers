import { Suspense } from "react";
import { getUserOrders } from "@/actions/orders";
import { OrdersList } from "./orders-list";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrdersList orders={orders} />
    </Suspense>
  );
}
