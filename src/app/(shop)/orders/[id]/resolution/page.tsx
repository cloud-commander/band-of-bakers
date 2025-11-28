import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { orders, bakeSales } from "@/db/schema";
import { eq, and, gt, ne } from "drizzle-orm";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { asc } from "drizzle-orm";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ResolutionOptions } from "./resolution-options";

interface OrderResolutionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderResolutionPage({ params }: OrderResolutionPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login"); // Or a specific login redirect
  }

  const orderId = (await params).id;
  const db = await getDb();

  // 1. Fetch order
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      bakeSale: {
        with: {
          location: true,
        },
      },
    },
  });

  if (!order) notFound();
  if (order.user_id !== session.user.id) notFound(); // Security check

  // 2. Check status
  if (order.status !== "action_required") {
    // If already resolved, redirect to order details
    redirect(`/orders/${orderId}`);
  }

  // 3. Fetch alternative bake sales
  const upcomingSales = await db.query.bakeSales.findMany({
    where: and(
      gt(bakeSales.date, new Date().toISOString().split("T")[0]),
      ne(bakeSales.id, order.bake_sale_id!), // Exclude current (cancelled/rescheduled) one
      eq(bakeSales.is_active, true)
    ),
    with: {
      location: true,
    },
    orderBy: (sales, { asc }: { asc: (column: unknown) => unknown }) => [asc(sales.date)],
    limit: 5,
  });

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <Heading level={1}>Action Required</Heading>
        <p className="text-muted-foreground mt-2">
          There has been a change to the bake sale for your order #{order.id.slice(0, 8)}. Please
          choose how you would like to proceed.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Order Info */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Original Date:</span>
              <span className="font-medium">
                {new Date(order.bakeSale!.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{order.bakeSale!.location.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-medium">£{order.total.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <ResolutionOptions orderId={order.id} upcomingSales={upcomingSales} />
      </div>
    </div>
  );
}
