"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export function CartPreview() {
  const { items, removeItem, cartTotal, cartCount } = useCart();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-6 w-6" />
          {cartCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              style={{ backgroundColor: DESIGN_TOKENS.colors.accent }}
            >
              {cartCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <h4 className="font-semibold text-lg">Shopping Cart</h4>
          <p className="text-sm text-muted-foreground">{cartCount} items</p>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/menu">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="font-medium text-sm line-clamp-2">{item.name}</h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(item.productId, item.variantId);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-muted/10 space-y-4">
              <div className="flex items-center justify-between font-semibold">
                <span>Subtotal</span>
                <span>£{cartTotal.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
