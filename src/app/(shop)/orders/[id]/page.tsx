import { PageHeader } from "@/components/state/page-header";
import { Badge } from "@/components/ui/badge";
import { notFound, redirect } from "next/navigation";
import { getOrderById } from "@/actions/orders";
import { auth } from "@/auth";
import { formatOrderReference } from "@/lib/utils/order";
import { cn } from "@/lib/utils";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  ready: "bg-purple-100 text-purple-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
} as const;

const stagesOrder = ["pending", "processing", "ready", "fulfilled"] as const;

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/orders/${id}`);
  }
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }
  if (order.user_id !== session.user.id) {
    notFound();
  }

  const bakeSale = order.bakeSale;
  const voucherDiscount = order.voucher_discount ?? 0;
  const hasVoucherDiscount = voucherDiscount > 0;
  const paymentLabel = order.payment_method
    ? order.payment_method.replace(/_/g, " ")
    : "payment";
  const fulfillmentDetails =
    order.fulfillment_method === "collection"
      ? bakeSale && bakeSale.location
        ? `${bakeSale.location.name}, ${bakeSale.location.address_line1 || ""} ${
            bakeSale.location.postcode || ""
          }`
      : "Collection"
      : order.shipping_address_line1
        ? `${order.shipping_address_line1}${
            order.shipping_address_line2 ? ", " + order.shipping_address_line2 : ""
          }, ${order.shipping_city || ""} ${order.shipping_postcode || ""}`
        : "Delivery";
  const currentStageIdx = stagesOrder.indexOf(order.status as (typeof stagesOrder)[number]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={`Order ${formatOrderReference(order.id, order.order_number)}`}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Orders", href: "/orders" },
            { label: formatOrderReference(order.id, order.order_number) },
          ]}
        />

        {/* Order Status */}
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Status</p>
              <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                {order.status}
              </Badge>
              <Badge variant="outline" className="ml-2 capitalize">
                {paymentLabel}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Placed on</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {stagesOrder.map((stage, idx) => {
                const active = currentStageIdx >= idx;
                return (
                  <div key={stage} className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full border",
                        active ? "bg-green-600 border-green-600" : "bg-white border-stone-300"
                      )}
                      aria-label={stage}
                    />
                    <span className={cn("text-xs capitalize", active ? "text-green-700" : "text-muted-foreground")}>
                      {stage}
                    </span>
                    {idx < stagesOrder.length - 1 && (
                      <div className={cn("h-[1px] w-10", active ? "bg-green-500" : "bg-stone-300")} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium text-stone-700">Fulfillment</p>
            <p className="capitalize">{order.fulfillment_method}</p>
            <p>{fulfillmentDetails}</p>
          </div>
        </div>

        {/* Collection/Delivery Info */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">
            {order.fulfillment_method === "collection" ? "Collection Details" : "Delivery Details"}
          </h2>
          {bakeSale && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Bake Sale Date</p>
              <p className="font-medium">
                {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
          {order.fulfillment_method === "delivery" && order.shipping_address_line1 && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>
                {order.shipping_city}, {order.shipping_postcode}
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: (typeof order.items)[number]) => (
              <div
                key={item.id}
                className="flex justify-between items-start pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.product?.name || "Unknown Product"}</p>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground">Variant: {item.variant.name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">£{item.total_price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    £{item.unit_price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>£{order.subtotal.toFixed(2)}</span>
            </div>
            {order.delivery_fee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>£{order.delivery_fee.toFixed(2)}</span>
              </div>
            )}
            {hasVoucherDiscount && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Discount</span>
                <span>-£{voucherDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Payment Method: Pay on Collection
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                Payment Status: {order.payment_status || "pending"}
              </p>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="border rounded-lg p-6 mt-6">
            <h2 className="font-semibold text-lg mb-2">Order Notes</h2>
            <p className="text-muted-foreground">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
