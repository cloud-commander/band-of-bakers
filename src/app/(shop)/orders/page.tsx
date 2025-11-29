import { Suspense } from "react";
import { getUserOrders } from "@/actions/orders";
import { OrdersList } from "./orders-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/orders");
  }
  const orders = await getUserOrders();

  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrdersList orders={orders} />
    </Suspense>
  );
}
