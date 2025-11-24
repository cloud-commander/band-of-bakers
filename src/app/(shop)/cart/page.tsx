"use client";

import Link from "next/link";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { Minus, Plus, ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/state/page-header";
import { useCart } from "@/context/cart-context";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export default function CartPage() {
  const { items, updateQuantity, removeItem, cartTotal, cartCount } = useCart();

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
                  <p className="text-muted-foreground">£{item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.variantId, item.quantity - 1)
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
                      updateQuantity(item.productId, item.variantId, item.quantity + 1)
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
                    onClick={() => removeItem(item.productId, item.variantId)}
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

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button asChild className="w-full" size="lg">
                <Link href="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
