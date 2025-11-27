import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/orders";
import { OrderDetailContent } from "./order-detail-content";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await getOrderById((await params).id);

  if (!order) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading order details...</div>}>
      <OrderDetailContent order={order} />
    </Suspense>
  );
}
