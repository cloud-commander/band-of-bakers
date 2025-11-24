import { PageHeader } from "@/components/state/page-header";
import { mockOrdersWithItems } from "@/lib/mocks/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminOrdersPage() {
  const orders = mockOrdersWithItems;

  return (
    <div>
      <PageHeader title="Orders" description="Manage customer orders" />

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Order ID</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Total</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-muted/30">
                <td className="p-4 font-medium">{order.id}</td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="p-4 text-sm">{order.user_id}</td>
                <td className="p-4">
                  <Badge>{order.status}</Badge>
                </td>
                <td className="p-4 font-medium">£{order.total.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/orders/${order.id}`}>View</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
