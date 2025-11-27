"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ArrowLeft, Check, Package, X, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Define shapes matching what we get from getOrderById
interface OrderDetailContentProps {
  order: {
    id: string;
    created_at: number | string | Date;
    total: number;
    status: string;
    user_id: string;
    bake_sale_id?: string | null;
    user?: {
      name: string | null;
      email: string;
      phone?: string | null;
    } | null;
    bakeSale?: {
      date: string;
      location: {
        name: string;
      };
    } | null;
    items: Array<{
      id: string;
      product_id: string;
      quantity: number;
      unit_price: number;
      product?: {
        name: string;
      } | null;
      variant?: {
        name: string;
      } | null;
    }>;
  };
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  // State for managing item availability
  const [unavailableItems, setUnavailableItems] = useState<Set<string>>(new Set());

  // Helper function to get product name
  const getProductName = (item: OrderDetailContentProps["order"]["items"][0]) => {
    let name = item.product?.name || "Unknown Product";
    if (item.variant) {
      name += ` - ${item.variant.name}`;
    }
    return name;
  };

  // Calculate adjusted total
  const adjustedTotal = order.items.reduce((sum, item) => {
    if (unavailableItems.has(item.id)) return sum;
    return sum + item.unit_price * item.quantity;
  }, 0);

  const hasUnavailableItems = unavailableItems.size > 0;

  // Toggle item availability
  const toggleItemAvailability = (itemId: string, itemName: string) => {
    setUnavailableItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        toast.success(`${itemName} marked as available`);
      } else {
        newSet.add(itemId);
        toast.warning(`${itemName} marked as unavailable`, {
          description: "Customer will be notified via email",
          action: {
            label: "Undo",
            onClick: () => {
              setUnavailableItems((prev) => {
                const undoSet = new Set(prev);
                undoSet.delete(itemId);
                return undoSet;
              });
            },
          },
        });
      }
      return newSet;
    });
  };

  // Status update handlers
  const handleMarkReady = () => {
    toast.success(`Order #${order.id.slice(0, 8)} marked as Ready for Collection`, {
      description: "Customer has been notified via SMS",
    });
    // TODO: Implement server action
  };

  const handleMarkComplete = () => {
    toast.success(`Order #${order.id.slice(0, 8)} marked as Complete`, {
      description: "Order archived successfully",
    });
    // TODO: Implement server action
  };

  const handleSendEmail = () => {
    toast.success("Email sent to customer", {
      description: `Notification sent to ${order.user?.email || "customer"}`,
    });
    // TODO: Implement server action
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <PageHeader
          title={`Order #${order.id.slice(0, 8)}`}
          description={`Placed on ${new Date(order.created_at).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <Heading level={3} className="mb-0">
                Order Items
              </Heading>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => {
                  const isUnavailable = unavailableItems.has(item.id);
                  const productName = getProductName(item);
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-lg transition-all",
                        isUnavailable
                          ? "bg-red-50 border-red-200 opacity-60"
                          : "bg-white border-stone-200 hover:border-bakery-amber-200"
                      )}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isUnavailable ? "bg-red-100" : "bg-bakery-amber-100"
                          )}
                        >
                          {isUnavailable ? (
                            <X className="w-5 h-5 text-red-700" />
                          ) : (
                            <Check className="w-5 h-5 text-bakery-amber-700" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn("font-medium", isUnavailable && "line-through")}>
                            {productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × £{item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn("font-serif font-bold", isUnavailable && "line-through")}
                          >
                            £{(item.unit_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItemAvailability(item.id, productName)}
                        className={cn(
                          "ml-4",
                          isUnavailable
                            ? "text-emerald-700 hover:text-emerald-800"
                            : "text-red-700 hover:text-red-800"
                        )}
                      >
                        {isUnavailable ? "Mark Available" : "Mark Unavailable"}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-lg font-serif font-bold">
                  <span>Total:</span>
                  <div className="text-right">
                    {hasUnavailableItems && (
                      <p className="text-sm text-muted-foreground line-through font-normal mb-1">
                        £{order.total.toFixed(2)}
                      </p>
                    )}
                    <p className={cn(hasUnavailableItems && "text-bakery-amber-700")}>
                      £{adjustedTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                {hasUnavailableItems && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Customer will be notified of unavailable items and updated total
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <Heading level={3} className="mb-0">
                Customer
              </Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.user?.name || "Unknown"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{order.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm">{order.user?.phone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Bake Sale Info */}
          <Card>
            <CardHeader>
              <Heading level={3} className="mb-0">
                Collection Details
              </Heading>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Bake Sale Date</p>
                <p className="font-medium">
                  {order.bakeSale
                    ? new Date(order.bakeSale.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="text-sm">{order.bakeSale?.location?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    order.status.toLowerCase() === "pending" &&
                      "bg-amber-50 text-amber-700 border-amber-200",
                    order.status.toLowerCase() === "processing" &&
                      "bg-blue-50 text-blue-700 border-blue-200",
                    order.status.toLowerCase() === "ready" &&
                      "bg-indigo-50 text-indigo-700 border-indigo-200",
                    order.status.toLowerCase() === "completed" &&
                      "bg-emerald-50 text-emerald-700 border-emerald-200",
                    order.status.toLowerCase() === "cancelled" &&
                      "bg-red-50 text-red-700 border-red-200"
                  )}
                >
                  {order.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Footer with Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-lg lg:left-64">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {hasUnavailableItems && (
              <Button variant="outline" onClick={handleSendEmail} className="sm:w-auto">
                <Mail className="w-4 h-4 mr-2" />
                Send Update Email
              </Button>
            )}
            {(order.status.toLowerCase() === "pending" ||
              order.status.toLowerCase() === "processing") && (
              <Button
                onClick={handleMarkReady}
                className="bg-blue-600 hover:bg-blue-700 text-white sm:w-auto"
              >
                <Package className="w-4 h-4 mr-2" />
                Mark Ready for Collection
              </Button>
            )}
            {order.status.toLowerCase() === "ready" && (
              <Button
                onClick={handleMarkComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white sm:w-auto"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
