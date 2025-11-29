import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import type { Metadata } from "next";
import { getDashboardStats } from "@/actions/dashboard";
import { getTopVouchers } from "@/actions/vouchers";

export const metadata: Metadata = {
  title: "Dashboard | Band of Bakers Admin",
  description: "Overview of store performance, orders, and analytics.",
};

export const dynamic = "force-dynamic";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DashboardOrder {
  id: string;
  created_at: string | number | Date;
  status: string;
  total: number;
  user: {
    name: string | null;
  } | null;
}

export default async function AdminDashboard() {
  const {
    totalOrders,
    totalRevenue,
    totalProducts,
    totalUsers,
    recentOrders,
    trends,
    upcomingBakeSalesCount,
    nextBakeSale,
    revenueSeries,
    statusCounts,
    topProducts,
  } = await getDashboardStats();
  const topVouchers = await getTopVouchers(5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your store performance and analytics"
      />

      {upcomingBakeSalesCount === 0 && (
        <Alert variant="destructive" className="mb-8 bg-red-50 border-red-200 text-red-800">
          <AlertTriangle className="h-4 w-4 text-red-800" />
          <AlertTitle>Action Required: No Upcoming Bake Sales</AlertTitle>
          <AlertDescription>
            There are no future bake sales scheduled. Customers will not be able to place orders.
            <Link
              href="/admin/bake-sales"
              className="font-medium underline ml-1 hover:text-red-900"
            >
              Schedule a bake sale now &rarr;
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/orders">
          <KPICard
            title="Total Orders"
            value={totalOrders}
            icon="ShoppingCart"
            variant="wheat"
            trend={{ value: trends.orders, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/orders">
          <KPICard
            title="Revenue"
            value={`£${totalRevenue.toFixed(2)}`}
            icon="ArrowUpRight"
            variant="award"
            trend={{ value: trends.revenue, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/products">
          <KPICard
            title="Active Products"
            value={totalProducts}
            icon="Package"
            variant="leaf"
            trend={{ value: trends.products, label: "vs last month" }}
          />
        </Link>
        <Link href="/admin/users">
          <KPICard
            title="Customers"
            value={totalUsers}
            icon="Users"
            variant="time"
            trend={{ value: trends.customers, label: "vs last month" }}
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
              <OrderStatusChart data={statusCounts} nextBakeSale={nextBakeSale} />
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
                    {recentOrders.map((order: DashboardOrder) => {
                      return (
                        <Link
                          key={order.id}
                          href={`/admin/orders/${order.id}`}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-bakery-amber-200 transition-all group gap-4 sm:gap-0"
                        >
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-10 h-10 rounded-full bg-bakery-amber-100 flex items-center justify-center shrink-0">
                              <ShoppingCart className="w-5 h-5 text-bakery-amber-700" />
                            </div>
                            <div>
                              <p className="font-medium text-stone-800 group-hover:text-bakery-amber-700 transition-colors">
                                Order #{order.id.slice(0, 8)}
                              </p>
                              <p className="text-sm font-medium text-stone-600">
                                {order.user?.name || "Unknown Customer"}
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
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-14 sm:pl-0">
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
              <RevenueTrendChart
                data={revenueSeries.map((r) => ({
                  date: new Date(r.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" }),
                  revenue: r.revenue,
                }))}
              />
            </div>

            {/* Top Products */}
            <TopProductsChart
              data={topProducts.map((p) => ({
                name: p.name,
                units: Number(p.units || 0),
                revenue: Number(p.revenue || 0),
              }))}
            />

            {/* Top Vouchers */}
            <TopVouchersList vouchers={topVouchers} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
