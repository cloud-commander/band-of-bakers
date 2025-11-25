"use client";

import Link from "next/link";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { Minus, Plus, ArrowRight, ShoppingCart, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/state/page-header";
import { useCart } from "@/context/cart-context";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { mockVouchers } from "@/lib/mocks/vouchers";
import { validateVoucher } from "@/lib/utils/voucher";
import type { Voucher } from "@/lib/validators/voucher";
import { toast } from "sonner";
import { Ticket, X } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal, cartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "collection">("online");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) {
      toast.error("Please enter a voucher code");
      return;
    }

    // Find voucher in mock data
    const voucher = mockVouchers.find((v) => v.code.toUpperCase() === voucherCode.toUpperCase());

    // Validate voucher
    const validation = validateVoucher(voucher || null, cartTotal);

    if (!validation.valid) {
      toast.error(validation.error || "Invalid voucher");
      return;
    }

    // Apply voucher
    setAppliedVoucher(voucher || null);
    setVoucherDiscount(validation.discount || 0);
    toast.success(`Voucher ${voucher?.code} applied!`, {
      description: `You saved £${validation.discount?.toFixed(2)}`,
    });
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
                className={`${DESIGN_TOKENS.cards.base} p-4 flex gap-4 items-center`}
              >
                {/* Image */}
                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                      No img
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                  {item.bakeSaleId ? (
                    (() => {
                      const bakeSale = mockBakeSalesWithLocation.find(
                        (bs) => bs.id === item.bakeSaleId
                      );
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
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
                    size="icon"
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
                <div className="text-right min-w-[80px]">
                  <p className="font-bold text-lg">£{(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90 h-auto p-0 mt-1"
                    onClick={() => removeItem(item.productId, item.variantId, item.bakeSaleId)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${DESIGN_TOKENS.cards.base} p-6 sticky top-24`}>
              <h3 className={`${DESIGN_TOKENS.typography.h4.size} mb-4`}>Order Summary</h3>

              {/* Payment Method Selection */}
              <div className="mb-6 pb-6 border-b">
                <label
                  className={`block ${DESIGN_TOKENS.typography.label.size} ${DESIGN_TOKENS.typography.label.weight} mb-3`}
                >
                  Payment Method
                </label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "online" | "collection")}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="online" id="online" />
                      <Label
                        htmlFor="online"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <CreditCard className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Pay Online</div>
                          <div className="text-xs text-muted-foreground">
                            Secure payment via Stripe
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="collection" id="collection" />
                      <Label
                        htmlFor="collection"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Banknote className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Pay on Collection</div>
                          <div className="text-xs text-muted-foreground">
                            Cash or card at pickup
                          </div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
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
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href={paymentMethod === "online" ? "/checkout" : "/checkout/collection"}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {paymentMethod === "online"
                  ? "Secure checkout powered by Stripe"
                  : "You'll pay when you collect your order"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
