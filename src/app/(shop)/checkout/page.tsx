"use client";

import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProducts } from "@/lib/mocks/products";
import { mockBakeSales } from "@/lib/mocks/bake-sales";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Mock cart items (same as cart page)
const mockCartItems = [
  {
    id: "cart-1",
    product: mockProducts[0],
    variant: null as { name: string; priceAdjustment: number } | null,
    bakeSaleDate: mockBakeSales[0].date,
    quantity: 2,
  },
  {
    id: "cart-2",
    product: mockProducts[4],
    variant: null as { name: string; priceAdjustment: number } | null,
    bakeSaleDate: mockBakeSales[0].date,
    quantity: 3,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [fulfillmentMethod, setFulfillmentMethod] = useState<
    "collection" | "delivery"
  >("collection");
  const [paymentMethod, setPaymentMethod] = useState<
    "stripe" | "payment_on_collection"
  >("payment_on_collection");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateItemPrice = (item: (typeof mockCartItems)[0]) => {
    const basePrice = item.product.base_price;
    const variantPrice = item.variant ? item.variant.priceAdjustment : 0;
    return (basePrice + variantPrice) * item.quantity;
  };

  const subtotal = mockCartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item),
    0
  );
  const deliveryFee = fulfillmentMethod === "delivery" ? 5.0 : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/orders/ord-mock-123");
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Checkout"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Fulfillment Method */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Fulfillment Method
                </h2>
                <Select
                  value={fulfillmentMethod}
                  onValueChange={(value) =>
                    setFulfillmentMethod(value as typeof fulfillmentMethod)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection">
                      Collection (Free)
                    </SelectItem>
                    <SelectItem value="delivery">Delivery (£5.00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Billing Address */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="billing-address-1">Address Line 1</Label>
                    <Input id="billing-address-1" required />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="billing-address-2">
                      Address Line 2 (Optional)
                    </Label>
                    <Input id="billing-address-2" />
                  </div>
                  <div>
                    <Label htmlFor="billing-city">City</Label>
                    <Input id="billing-city" required />
                  </div>
                  <div>
                    <Label htmlFor="billing-postcode">Postcode</Label>
                    <Input id="billing-postcode" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address (if delivery) */}
              {fulfillmentMethod === "delivery" && (
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <Button type="button" variant="ghost" size="sm">
                      Same as billing
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="shipping-address-1">Address Line 1</Label>
                      <Input id="shipping-address-1" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="shipping-address-2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input id="shipping-address-2" />
                    </div>
                    <div>
                      <Label htmlFor="shipping-city">City</Label>
                      <Input id="shipping-city" required />
                    </div>
                    <div>
                      <Label htmlFor="shipping-postcode">Postcode</Label>
                      <Input id="shipping-postcode" required />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as typeof paymentMethod)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment_on_collection">
                      Payment on Collection
                    </SelectItem>
                    <SelectItem value="stripe">
                      Credit/Debit Card (Stripe)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {mockCartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{item.product.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          x{item.quantity}
                        </span>
                      </div>
                      <span>£{calculateItemPrice(item).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>
                      {deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : "Free"}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  className="w-full mt-6"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
