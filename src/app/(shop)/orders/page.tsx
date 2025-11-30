import { Suspense } from "react";
import { getPaginatedUserOrders } from "@/actions/orders";
import { OrdersList } from "./orders-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrdersPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/orders");
  }
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 5;
   const sort = params?.sort === "oldest" ? "oldest" : "newest";
  const { orders, total, page: currentPage, pageSize: limit } = await getPaginatedUserOrders(
    page,
    pageSize,
    sort
  );

  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <OrdersList
        orders={orders}
        totalItems={total}
        currentPage={currentPage}
        pageSize={limit}
        sort={sort}
      />
    </Suspense>
  );
}
