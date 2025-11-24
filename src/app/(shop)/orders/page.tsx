import { PageHeader } from "@/components/state/page-header";
import { EmptyState } from "@/components/state/empty-state";
import { mockOrdersWithItems } from "@/lib/mocks/orders";
import { mockCurrentUser } from "@/lib/mocks/users";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  ready: "bg-purple-100 text-purple-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
} as const;

export default function OrdersPage() {
  // Filter orders for current user
  const userOrders = mockOrdersWithItems.filter(
    (order) => order.user_id === mockCurrentUser.id
  );

  if (userOrders.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader title="My Orders" />
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="You haven't placed any orders. Start shopping to see your orders here."
            actionLabel="Browse Products"
            actionHref="/menu"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="My Orders"
          description="View and track your orders"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Orders" }]}
        />

        <div className="space-y-4">
          {userOrders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <Badge
                      className={
                        statusColors[order.status as keyof typeof statusColors]
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    £{order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {order.fulfillment_method}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
