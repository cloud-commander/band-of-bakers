"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { ArrowRight, CreditCard, ShoppingBag, Truck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const shippingCost = 4.99;
  const totalToPay = cartTotal + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address1",
      "city",
      "postcode",
      "cardNumber",
      "expiry",
      "cvc",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearCart();
    toast.success("Payment successful! Order placed.");
    router.push("/checkout/success");
  };

  if (items.length === 0) {
    return (
      <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
        <div className="max-w-3xl mx-auto text-center">
          <PageHeader
            title="Checkout"
            breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
          />
          <div className={`${DESIGN_TOKENS.cards.base} p-8`}>
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className={`${DESIGN_TOKENS.typography.h3.size} mb-4`}>Your cart is empty</h2>
            <Button asChild>
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
          title="Checkout - Delivery"
          breadcrumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-6`}>Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-5 h-5 text-bakery-amber-600" />
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-0`}>Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address1">Address Line 1</Label>
                  <Input
                    id="address1"
                    value={formData.address1}
                    onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-5 h-5 text-bakery-amber-600" />
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-0`}>Payment Details</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`${DESIGN_TOKENS.cards.base} p-6 sticky top-24`}>
              <h3 className={`${DESIGN_TOKENS.typography.h4.size} mb-4`}>Order Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>£{shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total to Pay</span>
                  <span>£{totalToPay.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay £${totalToPay.toFixed(2)}`}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment powered by Stripe (Mock)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
