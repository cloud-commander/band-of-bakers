"use server";

import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";

const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

/**
 * Get dashboard statistics with caching
 * Cached for 5 minutes to reduce D1 query load (15 queries per call)
 */
export async function getDashboardStats() {
  return unstable_cache(
    async () => {
      try {
        const { orderRepository } = await import("@/lib/repositories/order.repository");
        const { productRepository } = await import("@/lib/repositories/product.repository");
        const { userRepository } = await import("@/lib/repositories/user.repository");
        const { bakeSaleRepository } = await import("@/lib/repositories/bake-sale.repository");

        const [
          totalOrders,
          totalRevenue,
          totalProducts,
          totalUsers,
          recentOrders,
          upcomingBakeSales,
          revenueSeries,
          statusCounts,
          topProducts,
        ] = await Promise.all([
          orderRepository.count(),
          orderRepository.sumTotal(),
          productRepository.countActive(),
          userRepository.countCustomers(),
          orderRepository.findRecent(5),
          bakeSaleRepository.findUpcoming(),
          orderRepository.revenueLastNDays(30),
          orderRepository.statusCounts(),
          orderRepository.topProducts(5),
        ]);
        const todayIso = new Date().toISOString().slice(0, 10);
        const overdue = await orderRepository.overdueCountsByStatus(
          ["processing", "ready"],
          todayIso
        );

        // Fill missing days with zero so charts are consistent
        const today = new Date();
        const revenueMap = new Map<string, number>(
          revenueSeries.map((r: { day: string; revenue: number | null }) => [
            r.day,
            Number(r.revenue || 0),
          ])
        );
        const filledRevenueSeries: Array<{ date: string; revenue: number }> = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          filledRevenueSeries.push({ date: key, revenue: revenueMap.get(key) ?? 0 });
        }

        // Trends vs previous 30 days (percentage change)
        const currentWindowStart = daysAgo(30);
        const previousWindowStart = daysAgo(60);
        const previousWindowEnd = daysAgo(30);

        const [ordersCurrent, ordersPrevious, revenueCurrent, revenuePrevious] = await Promise.all([
          orderRepository.countSince(currentWindowStart),
          orderRepository.countBetween(previousWindowStart, previousWindowEnd),
          orderRepository.sumTotalSince(currentWindowStart),
          orderRepository.sumTotalBetween(previousWindowStart, previousWindowEnd),
        ]);

        const pctChange = (current: number, prev: number) => {
          if (prev === 0) return current === 0 ? 0 : 100;
          return ((current - prev) / prev) * 100;
        };

        const trends = {
          orders: pctChange(ordersCurrent, ordersPrevious),
          revenue: pctChange(revenueCurrent, revenuePrevious),
          products: 0,
          customers: 0,
        };

        return {
          totalOrders,
          totalRevenue,
          totalProducts,
          totalUsers,
          recentOrders,
          upcomingBakeSalesCount: upcomingBakeSales.length,
          nextBakeSale: upcomingBakeSales[0] || null,
          revenueSeries: filledRevenueSeries,
          statusCounts,
          topProducts,
          trends,
          overdue,
        };
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
          totalOrders: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalUsers: 0,
          recentOrders: [],
          upcomingBakeSalesCount: 0,
          nextBakeSale: null,
          revenueSeries: [],
          statusCounts: [],
          topProducts: [],
          trends: {
            orders: 0,
            revenue: 0,
            products: 0,
            customers: 0,
          },
        };
      }
    },
    ["dashboard-stats"],
    {
      revalidate: 300, // 5 minutes
      tags: [CACHE_TAGS.dashboard, CACHE_TAGS.orders, CACHE_TAGS.products],
    }
  )();
}
