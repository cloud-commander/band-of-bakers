"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { ArrowLeft, Check, Package, X, Mail, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatOrderReference } from "@/lib/utils/order";

// Define shapes matching what we get from getOrderById
interface OrderDetailContentProps {
  order: {
    id: string;
    order_number: number;
    created_at: number | string | Date;
    total: number;
    status: string;
    fulfillment_method: string;
    payment_method: string;
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
        address_line1?: string | null;
        city?: string | null;
        postcode?: string | null;
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  markOrderReady,
  markOrderComplete,
  updateOrderItems,
  updateOrderStatus,
} from "@/actions/admin/orders";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const router = useRouter();
  // State for managing item availability (quantity)
  // undefined means full quantity available
  const [availableQuantities, setAvailableQuantities] = useState<Record<string, number>>({});
  const [itemToMarkUnavailable, setItemToMarkUnavailable] = useState<{
    id: string;
    name: string;
    qty: number;
  } | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [changeType, setChangeType] = useState<"bakery" | "customer">("bakery");

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
    const availableQty = availableQuantities[item.id] ?? item.quantity;
    return sum + item.unit_price * availableQty;
  }, 0);

  const hasUnavailableItems = Object.values(availableQuantities).some(
    (qty) => qty !== undefined // This check might need to be more specific if we allow setting to full qty explicitly
  );

  // Actually, let's check if any item has availableQty < item.quantity
  const isOrderModified = order.items.some((item) => {
    const availableQty = availableQuantities[item.id];
    return availableQty !== undefined && availableQty < item.quantity;
  });

  // Toggle item availability (Full / None)
  const toggleItemAvailability = (itemId: string, itemName: string, maxQty: number) => {
    setAvailableQuantities((prev) => {
      const currentQty = prev[itemId] ?? maxQty;
      const newQuantities = { ...prev };

      if (currentQty > 0) {
        // Mark as fully unavailable
        newQuantities[itemId] = 0;
        toast.warning(`${itemName} marked as unavailable`, {
          description: "Don't forget to send the update email to the customer.",
          action: {
            label: "Undo",
            onClick: () => {
              setAvailableQuantities((prevUndo) => {
                const undoQuantities = { ...prevUndo };
                delete undoQuantities[itemId];
                return undoQuantities;
              });
            },
          },
        });
      } else {
        // Mark as fully available
        delete newQuantities[itemId];
        toast.success(`${itemName} marked as available`);
      }
      return newQuantities;
    });
  };

  const confirmMarkUnavailable = () => {
    if (itemToMarkUnavailable) {
      toggleItemAvailability(
        itemToMarkUnavailable.id,
        itemToMarkUnavailable.name,
        itemToMarkUnavailable.qty
      );
      setItemToMarkUnavailable(null);
    }
  };

  // Adjust quantity
  const adjustQuantity = (itemId: string, delta: number, maxQty: number) => {
    setAvailableQuantities((prev) => {
      const currentQty = prev[itemId] ?? maxQty;
      const newQty = Math.max(0, Math.min(maxQty, currentQty + delta));

      const newQuantities = { ...prev };
      if (newQty === maxQty) {
        delete newQuantities[itemId]; // Reset to default if full
      } else {
        newQuantities[itemId] = newQty;
      }
      return newQuantities;
    });
  };

  // Status update handlers
  const handleMarkReady = async () => {
    try {
      const result = await markOrderReady(order.id);
      if (result.success) {
        toast.success(
          `${formatOrderReference(order.id, order.order_number)} marked as Ready for Collection`,
          {
            description: "Customer has been notified via email",
          }
        );
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUndoReady = async () => {
    try {
      const result = await updateOrderStatus(order.id, "processing");
      if (result.success) {
        toast.success("Status reverted to Processing");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to revert status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleUndoFulfilled = async () => {
    try {
      const result = await updateOrderStatus(order.id, "ready");
      if (result.success) {
        toast.success("Status reverted to Ready");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to revert status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleMarkComplete = async () => {
    try {
      const result = await markOrderComplete(order.id);
      if (result.success) {
        toast.success(`${formatOrderReference(order.id, order.order_number)} marked as Complete`, {
          description: "Order archived successfully",
        });
      } else {
        toast.error(result.error || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleSendEmail = async () => {
    if (!order.user?.email) {
      toast.error("Customer email not found");
      return;
    }

    setIsSendingEmail(true);
    try {
      // Build updated items list
      const updatedItems = order.items.map((item) => ({
        itemId: item.id,
        newQuantity: availableQuantities[item.id] ?? item.quantity,
      }));

      // Call the server action to update order and send email
      const result = await updateOrderItems({
        orderId: order.id,
        updatedItems,
        changeType,
      });

      if (result.success) {
        toast.success("Order updated and email sent", {
          description: `${changeType === "customer" ? "Confirmation" : "Update"} sent to ${order.user.email}`,
        });
        // Reset the available quantities state
        setAvailableQuantities({});
      } else {
        toast.error(result.error || "Failed to update order");
      }
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/orders">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <PageHeader
          title={`Order ${formatOrderReference(order.id, order.order_number)}`}
          description={`Placed on ${new Date(order.created_at).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        />
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <Badge className="uppercase">{order.status}</Badge>
          <Badge variant="outline" className="capitalize">
            {order.fulfillment_method}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {order.payment_method.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-4 bg-muted/50 border rounded-lg p-4">
        <p className="text-sm font-medium mb-2">Status Timeline</p>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-3">
          {["pending", "processing", "ready", "fulfilled"].map((stage, idx) => {
            const stagesOrder = ["pending", "processing", "ready", "fulfilled"];
            const currentIdx = stagesOrder.indexOf(order.status);
            const active = currentIdx >= idx;
            return (
              <div key={stage} className="flex items-center gap-2 min-w-[130px]">
                <div
                  className={cn(
                    "h-3 w-3 rounded-full border shrink-0",
                    active ? "bg-green-600 border-green-600" : "bg-white border-stone-300"
                  )}
                  aria-label={stage}
                />
                <span
                  className={cn(
                    "text-xs capitalize whitespace-nowrap",
                    active ? "text-green-700" : "text-muted-foreground"
                  )}
                >
                  {stage}
                </span>
                {idx < stagesOrder.length - 1 && (
                  <div
                    className={cn("h-[1px] w-8 shrink-0", active ? "bg-green-500" : "bg-stone-300")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Change Type Selection */}
      <Card className="mb-4">
        <CardContent className="pt-4 pb-4">
          <RadioGroup
            value={changeType}
            onValueChange={(value) => setChangeType(value as "bakery" | "customer")}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bakery" id="bakery" />
              <Label htmlFor="bakery" className="cursor-pointer font-medium text-sm">
                Bakery Initiated
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="customer" id="customer" />
              <Label htmlFor="customer" className="cursor-pointer font-medium text-sm">
                Customer Requested
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3 pt-4 px-4">
              <Heading level={4} className="mb-0 text-base">
                Order Items
              </Heading>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-2">
                {order.items.map((item) => {
                  const availableQty = availableQuantities[item.id] ?? item.quantity;
                  const isUnavailable = availableQty === 0;
                  const isPartiallyAvailable = availableQty > 0 && availableQty < item.quantity;
                  const productName = getProductName(item);

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "flex flex-col p-2.5 border rounded-lg transition-all gap-2.5",
                        isUnavailable
                          ? "bg-red-50 border-red-200 opacity-60"
                          : isPartiallyAvailable
                            ? "bg-amber-50 border-amber-200"
                            : "bg-white border-stone-200 hover:border-bakery-amber-200"
                      )}
                    >
                      {/* Top Row: Info */}
                      <div className="flex justify-between items-start w-full gap-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              isUnavailable
                                ? "bg-red-100"
                                : isPartiallyAvailable
                                  ? "bg-amber-100"
                                  : "bg-bakery-amber-100"
                            )}
                          >
                            {isUnavailable ? (
                              <X className="w-4 h-4 text-red-700" />
                            ) : isPartiallyAvailable ? (
                              <span className="font-bold text-sm text-amber-700">
                                {availableQty}
                              </span>
                            ) : (
                              <Check className="w-4 h-4 text-bakery-amber-700" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p
                              className={cn("font-medium text-sm", isUnavailable && "line-through")}
                            >
                              {productName}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>Ordered: {item.quantity}</span>
                              <span>×</span>
                              <span>£{item.unit_price.toFixed(2)}</span>
                              {isPartiallyAvailable && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-[10px] px-1.5 py-0"
                                >
                                  {availableQty} Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right min-w-[80px]">
                          <p
                            className={cn(
                              "font-serif font-bold text-sm",
                              isUnavailable && "line-through"
                            )}
                          >
                            £{(item.unit_price * availableQty).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Row: Quantity Controls & Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:pl-11">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          {/* Quantity Controls */}
                          {!isUnavailable && (
                            <div className="flex items-center border rounded-md bg-white">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-r-none"
                                onClick={() => adjustQuantity(item.id, -1, item.quantity)}
                                disabled={availableQty <= 0}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </Button>
                              <div className="px-2 sm:px-3 min-w-[40px] text-center border-x">
                                <span className="text-sm font-medium">{availableQty}</span>
                                <span className="text-xs text-muted-foreground ml-1">
                                  / {item.quantity}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-l-none"
                                onClick={() => adjustQuantity(item.id, 1, item.quantity)}
                                disabled={availableQty >= item.quantity}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}

                          {/* Mark Available/Unavailable Button */}
                          <Button
                            variant={isUnavailable ? "outline" : "destructive"}
                            size="sm"
                            onClick={() => {
                              if (isUnavailable) {
                                toggleItemAvailability(item.id, productName, item.quantity);
                              } else {
                                setItemToMarkUnavailable({
                                  id: item.id,
                                  name: productName,
                                  qty: item.quantity,
                                });
                              }
                            }}
                            className={cn(
                              "h-8 text-xs px-3 whitespace-nowrap",
                              isUnavailable &&
                                "text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                            )}
                          >
                            {isUnavailable ? "Mark Available" : "Mark Unavailable"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-base font-serif font-bold">
                  <span>Total:</span>
                  <div className="text-right">
                    {isOrderModified && (
                      <p className="text-xs text-muted-foreground line-through font-normal mb-0.5">
                        £{order.total.toFixed(2)}
                      </p>
                    )}
                    <p className={cn(isOrderModified && "text-bakery-amber-700")}>
                      £{adjustedTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                {isOrderModified && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
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
                <p className="font-medium">
                  {order.user?.name || order.user?.email || "Guest Customer"}
                </p>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 p-4 shadow-lg lg:left-64 z-40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {hasUnavailableItems && (
              <Button
                variant="outline"
                onClick={handleSendEmail}
                className="w-full sm:w-auto order-1 sm:order-none"
                disabled={isSendingEmail}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSendingEmail ? "Sending..." : "Send Update Email"}
              </Button>
            )}
            {(order.status.toLowerCase() === "pending" ||
              order.status.toLowerCase() === "processing") && (
              <Button
                onClick={handleMarkReady}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white order-2 sm:order-none"
              >
                <Package className="w-4 h-4 mr-2" />
                Mark Ready for Collection
              </Button>
            )}
            {order.status.toLowerCase() === "ready" && (
              <>
                <Button
                  onClick={handleMarkComplete}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white order-2 sm:order-none"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUndoReady}
                  className="w-full sm:w-auto order-1 sm:order-none"
                >
                  Undo Ready
                </Button>
              </>
            )}
            {order.status.toLowerCase() === "fulfilled" && (
              <Button variant="outline" onClick={handleUndoFulfilled} className="w-full sm:w-auto">
                Undo Fulfilled
              </Button>
            )}
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!itemToMarkUnavailable}
        onOpenChange={(open) => !open && setItemToMarkUnavailable(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Item as Unavailable?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark <strong>{itemToMarkUnavailable?.name}</strong> as
              unavailable? This will set the quantity to 0 and notify the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMarkUnavailable}
              className="bg-red-600 hover:bg-red-700"
            >
              Mark Unavailable
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
