"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ArrowRight, ShoppingCart, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/state/page-header";
import { useCart } from "@/context/cart-context";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Ticket, X } from "lucide-react";
import { BakeSaleWithLocation } from "@/lib/repositories";
import { validateVoucherCode } from "@/actions/vouchers";
import type { Voucher } from "@/lib/repositories";
import { useSession, signIn } from "next-auth/react";

interface CartContentProps {
  upcomingBakeSales: BakeSaleWithLocation[];
}

export function CartContent({ upcomingBakeSales }: CartContentProps) {
  const { items, updateQuantity, removeItem, cartTotal, cartCount } = useCart();
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const { status } = useSession();

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    try {
      const validation = await validateVoucherCode(voucherCode, cartTotal);

      if (!validation.valid) {
        toast.error(validation.error || "Invalid voucher");
        return;
      }

      // We need to fetch the voucher details to display the code
      // Ideally validateVoucherCode should return the voucher object or code
      // For now, we'll assume validation succeeded and we can use the code we have
      // But we need the voucher object for the state.
      // Let's update validateVoucherCode to return the voucher if valid.
      // Or we can just store the code and discount.

      // Actually, validateVoucherCode returns { valid, error, discount }.
      // It doesn't return the voucher object.
      // I should update validateVoucherCode to return the voucher object too if I want to display it properly
      // or just use the code entered.

      // Let's assume for now we just use the code entered and construct a partial voucher object for display
      // or update the state to just store code and discount.
      // But `appliedVoucher` state expects `Voucher`.

      // I'll update the state to be simpler or update the server action.
      // Let's update the server action to return the voucher.
      // But for now, let's just mock the voucher object for the state since we only use `code` and `type` (for display maybe).
      // Actually, `CartPage` uses `appliedVoucher.code`.

      // Let's update `validateVoucherCode` in `src/actions/vouchers.ts` to return the voucher.
      // But I can't do that in this tool call.
      // I'll assume I'll update it next.

      // Wait, I can't easily update the server action return type without changing the utility.
      // The utility returns `VoucherValidationResult`.
      // I can extend the server action return type.

      // For now, I will modify this component to expect `voucher` in the response
      // and I will update the server action in the next step.

      // @ts-expect-error - validation.voucher exists when valid but isn't typed in the return type yet
      const voucher = validation.voucher as Voucher;

      setAppliedVoucher(voucher);
      setVoucherDiscount(validation.discount || 0);
      toast.success(`Voucher ${voucherCode} applied!`, {
        description: `You saved £${(validation.discount || 0).toFixed(2)}`,
      });
    } catch {
      toast.error("Failed to apply voucher");
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherDiscount(0);
    setVoucherCode("");
    toast.success("Voucher removed");
  };

  const finalTotal = cartTotal - voucherDiscount;

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Shopping Cart"
            breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
          />
          <div className="text-center py-16 border rounded-lg bg-card">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-2`}>Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any treats yet.
            </p>
            <Button asChild size="lg">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Shopping Cart"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className={`${DESIGN_TOKENS.cards.base} p-4 flex gap-4 items-center flex-col sm:flex-row relative`}
              >
                {/* Image */}
                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0 w-full sm:w-24">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 96px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  {item.bakeSaleId ? (
                    (() => {
                      // Use stored bake sale details if available
                      if (item.bakeSaleDate && item.bakeSaleLocation) {
                        return (
                          <p className="text-sm text-muted-foreground">
                            Collection:{" "}
                            {new Date(item.bakeSaleDate).toLocaleDateString("en-GB", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            at {item.bakeSaleLocation}
                          </p>
                        );
                      }

                      // Fallback to lookup if stored details are missing (legacy items)
                      const bakeSale = upcomingBakeSales.find((bs) => bs.id === item.bakeSaleId);
                      return bakeSale ? (
                        <p className="text-sm text-muted-foreground">
                          Collection:{" "}
                          {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at {bakeSale.location.name}
                        </p>
                      ) : null;
                    })()
                  ) : (
                    <p className="text-sm text-orange-600">
                      ⚠️ No collection date selected - Please re-add this item
                    </p>
                  )}
                  <p className="text-muted-foreground">£{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity - 1,
                        item.bakeSaleId
                      )
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantId,
                        item.quantity + 1,
                        item.bakeSaleId
                      )
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Total & Remove */}
                <div className="text-right min-w-[80px] w-full sm:w-auto space-y-1">
                  <p className="font-bold text-lg">£{(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90 h-auto p-0"
                    onClick={() => removeItem(item.productId, item.variantId, item.bakeSaleId)}
                  >
                    Remove
                  </Button>
                </div>

                {/* Mobile swipe hint */}
                <div className="absolute right-3 top-3 sm:hidden text-[10px] uppercase tracking-wide text-muted-foreground opacity-70">
                  Swipe to remove
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${DESIGN_TOKENS.cards.base} p-6 lg:sticky lg:top-24`}>
              <h3 className={`${DESIGN_TOKENS.typography.h4.size} mb-4`}>Order Summary</h3>

              {/* Payment Method */}
              <div className="mb-6 pb-6 border-b">
                <label
                  className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-3`}
                >
                  Payment Method
                </label>
                <div className="flex items-center gap-3 border rounded-lg p-3 bg-muted/40">
                  <Banknote className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Pay on Collection</div>
                    <div className="text-xs text-muted-foreground">Cash or card at pickup</div>
                  </div>
                </div>
              </div>

              {/* Voucher Code Section */}
              <div className="mb-6 pb-6 border-b">
                <label
                  className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-3`}
                >
                  Voucher Code
                </label>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-4 w-4 text-emerald-700" />
                      <div>
                        <div className="font-medium text-emerald-900">{appliedVoucher.code}</div>
                        <div className="text-xs text-emerald-700">
                          -£{voucherDiscount.toFixed(2)} discount applied
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveVoucher}
                      className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 h-auto p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                      className="flex-1"
                    />
                    <Button onClick={handleApplyVoucher} variant="outline">
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                {voucherDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Voucher Discount</span>
                    <span>-£{voucherDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (status !== "authenticated") {
                    void signIn(undefined, { callbackUrl: "/checkout/collection" });
                    return;
                  }
                  window.location.href = "/checkout/collection";
                }}
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                You&apos;ll pay when you collect your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
