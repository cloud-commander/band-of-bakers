"use server";

import { revalidateTag } from "next/cache";
import { orderRepository } from "@/lib/repositories/order.repository";
import { sendEmail } from "@/lib/email/service";
import { formatOrderReference } from "@/lib/utils/order";
import { CACHE_TAGS } from "@/lib/cache";
import { logger } from "@/lib/logger";

type RunOptions = {
  dryRun?: boolean;
  /**
   * Auto-close unpaid orders after this many overdue days. If null/undefined, auto-close is disabled.
   */
  autoCloseAfterDays?: number | null;
};

const OVERDUE_STATUSES = ["pending", "processing", "ready"] as const;

const msInDay = 1000 * 60 * 60 * 24;

function getBaseAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL ||
    process.env.APP_URL ||
    "https://bandofbakers.co.uk"
  );
}

export async function runOverdueOrderSweep(options: RunOptions = {}) {
  const dryRun = options.dryRun ?? false;
  const autoCloseAfterDays = options.autoCloseAfterDays ?? null;

  const todayIso = new Date().toISOString().slice(0, 10);
  const overdueOrders = await orderRepository.findOverdueOrders(OVERDUE_STATUSES, todayIso);

  const results: Array<{ id: string; status: string; nextStatus: string; bake_sale_date: string | null }> = [];
  let updated = 0;
  let cancelled = 0;

  for (const order of overdueOrders) {
    const bakeSaleDate = order.bake_sale_date;
    const overdueDays = bakeSaleDate
      ? Math.max(0, Math.floor((Date.parse(todayIso) - Date.parse(bakeSaleDate)) / msInDay))
      : 0;

    const shouldAutoClose =
      autoCloseAfterDays !== null && autoCloseAfterDays !== undefined && overdueDays >= autoCloseAfterDays;

    const nextStatus = shouldAutoClose && order.payment_status !== "completed" ? "cancelled" : "action_required";

    results.push({ id: order.id, status: order.status, nextStatus, bake_sale_date: bakeSaleDate });

    if (dryRun) continue;

    const updatedOrder = await orderRepository.update(order.id, { status: nextStatus });
    if (updatedOrder) {
      updated += 1;
      if (nextStatus === "cancelled") {
        cancelled += 1;
      }
    }

    // Notify customer for action_required
    if (nextStatus === "action_required" && order.user_email) {
      const resolutionLink = `${getBaseAppUrl()}/orders/${order.id}/resolution`;
      void sendEmail(order.user_email, "action_required", {
        customer_name: order.user_name || "Customer",
        date: bakeSaleDate ? new Date(bakeSaleDate).toLocaleDateString("en-GB") : "the bake sale date",
        resolution_link: resolutionLink,
        order_reference: formatOrderReference(order.id, order.order_number),
      });
    }

    // Notify customer for auto-cancelled (unpaid) overdue orders
    if (nextStatus === "cancelled" && order.user_email) {
      const supportEmail = process.env.RESEND_REPLY_TO_EMAIL || "support@bandofbakers.co.uk";
      void sendEmail(order.user_email, "order_auto_cancelled", {
        customer_name: order.user_name || "Customer",
        order_reference: formatOrderReference(order.id, order.order_number),
        bake_sale_date: bakeSaleDate ? new Date(bakeSaleDate).toLocaleDateString("en-GB") : "the bake sale date",
        support_email: supportEmail,
      });
    }
  }

  if (!dryRun) {
    await Promise.allSettled([
      revalidateTag(CACHE_TAGS.orders),
      revalidateTag(CACHE_TAGS.dashboard),
      revalidateTag(CACHE_TAGS.bakeSales),
    ]);
  }

  void logger.info("overdue-order-sweep", {
    dryRun,
    found: overdueOrders.length,
    updated,
    cancelled,
    autoCloseAfterDays,
  });

  return {
    dryRun,
    found: overdueOrders.length,
    updated,
    cancelled,
    autoCloseAfterDays,
    results,
  };
}
