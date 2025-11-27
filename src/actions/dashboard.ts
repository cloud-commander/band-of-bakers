"use server";

import { orderRepository } from "@/lib/repositories/order.repository";
import { productRepository } from "@/lib/repositories/product.repository";
import { userRepository } from "@/lib/repositories/user.repository";

export async function getDashboardStats() {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalUsers, recentOrders] = await Promise.all([
      orderRepository.count(),
      orderRepository.sumTotal(),
      productRepository.countActive(),
      userRepository.countCustomers(),
      orderRepository.findRecent(5),
    ]);

    return {
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      // Trends are still hardcoded for now as we don't have historical data logic yet
      trends: {
        orders: 12.5,
        revenue: 8.3,
        products: -2.1,
        customers: 15.7,
      },
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalUsers: 0,
      recentOrders: [],
      trends: {
        orders: 0,
        revenue: 0,
        products: 0,
        customers: 0,
      },
    };
  }
}
