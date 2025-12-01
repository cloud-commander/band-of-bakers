"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { CheckCircle } from "lucide-react";
import { formatOrderReference } from "@/lib/utils/order";
import { getPaginatedUserOrders } from "@/actions/orders";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

interface OrderData {
  id: string;
  order_number: number;
  bakeSale?: {
    date: string;
    location?: {
      collection_hours?: string;
      address_line1?: string;
      postcode?: string;
    };
  };
}

export default function CheckoutSuccessPage() {
  const [latestOrder, setLatestOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const response = await getPaginatedUserOrders(1, 1);
        const order = response.orders[0] ?? null;
        setLatestOrder(order);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    }

    fetchOrderData();
  }, []);

  const formattedRef = latestOrder
    ? formatOrderReference(latestOrder.id, latestOrder.order_number)
    : null;
  const estimated =
    latestOrder?.bakeSale?.date &&
    new Date(latestOrder.bakeSale.date).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  const collectionHours = latestOrder?.bakeSale?.location?.collection_hours || "10:00 - 16:00";
  const icsLink =
    latestOrder?.bakeSale?.date && collectionHours
      ? `/api/calendar?date=${encodeURIComponent(latestOrder.bakeSale.date)}&hours=${encodeURIComponent(collectionHours)}&title=${encodeURIComponent(formattedRef || "Order pickup")}`
      : null;
  const mapLink =
    latestOrder?.bakeSale?.location?.address_line1 && latestOrder?.bakeSale?.location?.postcode
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${latestOrder.bakeSale.location.address_line1} ${latestOrder.bakeSale.location.postcode}`
        )}`
      : null;

  return (
    <div
      className={`min-h-screen ${DESIGN_TOKENS.sections.padding} flex items-center justify-center`}
    >
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className={`${DESIGN_TOKENS.typography.h2.size} mb-4`}>Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We&apos;ve sent a confirmation email with your order details.
        </p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
          <p className="text-xl font-mono font-bold tracking-wider">
            {formattedRef || "Check My Orders"}
          </p>
          {estimated && (
            <p className="text-sm text-muted-foreground mt-2">
              Estimated ready/pickup: {estimated} ({collectionHours})
            </p>
          )}
          {mapLink && (
            <p className="text-sm mt-2">
              <a
                className="underline text-bakery-amber-700"
                href={mapLink}
                target="_blank"
                rel="noreferrer"
              >
                View location on map
              </a>
            </p>
          )}
        </div>

        <div className="bg-white border rounded-lg p-4 text-left space-y-2 mb-8">
          <p className="text-sm font-medium">Next steps</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>We’re preparing your order for the selected bake sale date.</li>
            <li>You’ll get an email when it’s ready.</li>
            <li>View details or update your info in My Orders.</li>
            {collectionHours && <li>Collection hours: {collectionHours}</li>}
          </ul>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <NextLink href="/orders">View My Orders</NextLink>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <NextLink href="/menu">Continue Shopping</NextLink>
          </Button>
          {icsLink && (
            <Button asChild variant="ghost" className="w-full" title="Download calendar event">
              <a href={icsLink}>Save to Calendar</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
