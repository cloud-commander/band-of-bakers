import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getOrderById } from "@/actions/orders";
import { OrderDetailContent } from "./order-detail-content";
import { AdminOrderDetailSkeleton } from "@/components/skeletons/admin-order-detail-skeleton";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const runtime = "nodejs";

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = await getOrderById((await params).id);

  if (!order) {
    notFound();
  }

  return (
    <Suspense fallback={<AdminOrderDetailSkeleton />}>
      <OrderDetailContent order={order} />
    </Suspense>
  );
}
