import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { mockOrders } from "@/lib/mocks/orders";
import { mockProducts } from "@/lib/mocks/products";
import { mockUsers } from "@/lib/mocks/users";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { RevenueTrendChart } from "@/components/admin/revenue-chart";
import { TopProductsChart } from "@/components/admin/top-products-chart";
import { OrderStatusChart } from "@/components/admin/order-status-chart";
import { TopVouchersList } from "@/components/admin/top-vouchers-list";
import { Heading } from "@/components/ui/heading";
import { KPICard } from "@/components/admin/kpi-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = mockProducts.filter((p) => p.is_active).length;
  const totalUsers = mockUsers.filter((u) => u.role === "customer").length;

  // Calculate trends (mock data - in production, compare with previous period)
  const ordersTrend = 12.5;
  const revenueTrend = 8.3;
  const productsTrend = -2.1;
  const customersTrend = 15.7;

  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance and analytics"
      />

      {/* KPI Cards with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/orders">
          <KPICard
            title="Total Orders"
            value={totalOrders}
            icon="ShoppingCart"
            variant="wheat"
            trend={{ value: ordersTrend, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/orders">
          <KPICard
            title="Revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            icon="ArrowUpRight"
            variant="award"
            trend={{ value: revenueTrend, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/products">
          <KPICard
            title="Active Products"
            value={totalProducts}
            icon="Package"
            variant="leaf"
            trend={{ value: productsTrend, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/users">
          <KPICard
            title="Customers"
            value={totalUsers}
            icon="Users"
            variant="time"
            trend={{ value: customersTrend, label: "vs last month" }}
          />
        </Link>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="fulfilment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fulfilment">Fulfilment</TabsTrigger>
          <TabsTrigger value="sales">Sales & Analytics</TabsTrigger>
        </TabsList>

        {/* Fulfilment Tab */}
        <TabsContent value="fulfilment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status Chart */}
            <div className="lg:col-span-1">
              <OrderStatusChart />
            </div>

            {/* Recent Orders List */}
            <div className="lg:col-span-2">
              <Card className="border border-stone-200 h-full">
                <CardHeader>
                  <Heading level={3} className="mb-0">
                    Recent Orders
                  </Heading>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const user = mockUsers.find((u) => u.id === order.user_id);
                      return (
                        <Link
                          key={order.id}
                          href={`/admin/orders/${order.id}`}
                          className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-bakery-amber-200 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-bakery-amber-100 flex items-center justify-center">
                              <ShoppingCart className="w-5 h-5 text-bakery-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-800 group-hover:text-bakery-amber-700 transition-colors">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm font-medium text-stone-600">
                                {user?.name || "Unknown Customer"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("en-GB", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="bg-white capitalize">
                              {order.status}
                            </Badge>
                            <span className="font-serif font-bold text-stone-800 min-w-[80px] text-right">
                              £{order.total.toFixed(2)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend - Full Width */}
            <div className="lg:col-span-2">
              <RevenueTrendChart />
            </div>

            {/* Top Products */}
            <TopProductsChart />

            {/* Top Vouchers */}
            <TopVouchersList />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
