"use client";

import { PageHeader } from "@/components/state/page-header";
import { EmptyState } from "@/components/state/empty-state";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mocks/products";
import { mockBakeSales } from "@/lib/mocks/bake-sales";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock cart items (in a real app, this would come from state management or local storage)
const mockCartItems = [
  {
    id: "cart-1",
    product: mockProducts[0], // Sourdough
    variant: null,
    bakeSaleDate: mockBakeSales[0].date,
    quantity: 2,
  },
  {
    id: "cart-2",
    product: mockProducts[4], // Croissant
    variant: null,
    bakeSaleDate: mockBakeSales[0].date,
    quantity: 3,
  },
  {
    id: "cart-3",
    product: mockProducts[8], // Victoria Sponge
    variant: { name: "Medium (8 inches)", priceAdjustment: 6.0 },
    bakeSaleDate: mockBakeSales[1].date,
    quantity: 1,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  // Group items by bake sale date
  const itemsByDate = cartItems.reduce((acc, item) => {
    if (!acc[item.bakeSaleDate]) {
      acc[item.bakeSaleDate] = [];
    }
    acc[item.bakeSaleDate].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems>);

  const calculateItemPrice = (item: (typeof cartItems)[0]) => {
    const basePrice = item.product.base_price;
    const variantPrice = item.variant ? item.variant.priceAdjustment : 0;
    return (basePrice + variantPrice) * item.quantity;
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <PageHeader title="Shopping Cart" />
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Start shopping to add items to your cart"
            actionLabel="Browse Products"
            actionHref="/menu"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Shopping Cart"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
        />

        <div className="space-y-8">
          {Object.entries(itemsByDate).map(([date, items]) => {
            const bakeSale = mockBakeSales.find((bs) => bs.date === date);
            return (
              <div key={date} className="border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">
                  Collection Date:{" "}
                  {new Date(date).toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {bakeSale && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Order by{" "}
                    {new Date(bakeSale.cutoff_datetime).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                )}

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">
                            {item.variant.name}
                          </p>
                        )}
                        <p className="text-sm font-medium mt-1">
                          £{calculateItemPrice(item).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Order Summary */}
          <div className="border rounded-lg p-6 bg-muted/50">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery fee</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button asChild className="w-full mt-6" size="lg">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
