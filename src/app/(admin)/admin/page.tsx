import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockOrders } from "@/lib/mocks/orders";
import { mockProducts } from "@/lib/mocks/products";
import { mockUsers } from "@/lib/mocks/users";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowUpRight, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminDashboard() {
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = mockProducts.filter((p) => p.is_active).length;
  const totalUsers = mockUsers.filter((u) => u.role === "customer").length;

  const recentOrders = mockOrders.slice(0, 5);

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Revenue",
      value: `£${totalRevenue.toFixed(2)}`,
      icon: ArrowUpRight,
      href: "/admin/orders",
    },
    {
      title: "Products",
      value: totalProducts,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Customers",
      value: totalUsers,
      icon: Users,
      href: "/admin/users",
    },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your store" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge>{order.status}</Badge>
                  <span className="font-semibold">
                    £{order.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
