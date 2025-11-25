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
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { mockCurrentUser } from "@/lib/mocks/users";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowRight,
  MapPin,
  Calendar,
  ShoppingBag,
  User,
  CreditCard,
  Banknote,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function CheckoutCollectionPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    note: "",
  });

  // Group items by bake sale for collection info
  const collectionGroups = items.reduce((groups, item) => {
    if (!item.bakeSaleId) return groups;
    if (!groups[item.bakeSaleId]) {
      const bakeSale = mockBakeSalesWithLocation.find((bs) => bs.id === item.bakeSaleId);
      if (bakeSale) {
        groups[item.bakeSaleId] = {
          bakeSale,
          items: [],
        };
      }
    }
    if (groups[item.bakeSaleId]) {
      groups[item.bakeSaleId].items.push(item);
    }
    return groups;
  }, {} as Record<string, { bakeSale: (typeof mockBakeSalesWithLocation)[0]; items: typeof items }>);

  const handlePrepopulate = () => {
    const [firstName, ...lastNameParts] = mockCurrentUser.name.split(" ");
    setFormData({
      ...formData,
      firstName: firstName || "",
      lastName: lastNameParts.join(" ") || "",
      email: mockCurrentUser.email,
      phone: mockCurrentUser.phone || "",
    });
    toast.success("Details filled from profile");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearCart();
    toast.success("Order placed successfully!");
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
          title="Checkout - Collection"
          breadcrumbs={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Collection" },
          ]}
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Customer Details */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-0`}>Contact Information</h2>
                <Button variant="outline" size="sm" onClick={handlePrepopulate}>
                  <User className="w-4 h-4 mr-2" />
                  Use Profile Details
                </Button>
              </div>
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="note">Order Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Any special requests or notes for collection?"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </form>
            </div>

            {/* Collection Details */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-6`}>Collection Details</h2>
              <div className="space-y-6">
                {Object.values(collectionGroups).map(({ bakeSale, items }) => (
                  <div key={bakeSale.id} className="border rounded-lg p-4 bg-muted/30">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-2 bg-white rounded-full border">
                        <MapPin className="w-5 h-5 text-bakery-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{bakeSale.location.name}</h3>
                        <p className="text-muted-foreground">
                          {bakeSale.location.address_line1}, {bakeSale.location.city},{" "}
                          {bakeSale.location.postcode}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-stone-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            • {bakeSale.location.collection_hours || "10:00 - 16:00"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-14">
                      <p className="text-sm font-medium mb-2 text-muted-foreground">
                        Items to collect here:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {items.map((item) => (
                          <li key={`${item.productId}-${item.variantId}`}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Payment Methods */}
            <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
              <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-4`}>Payment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <Banknote className="w-6 h-6 mr-3 text-bakery-amber-600" />
                  <div>
                    <p className="font-medium">Cash on Collection</p>
                    <p className="text-sm text-muted-foreground">Pay when you pick up your order</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg bg-muted/50">
                  <CreditCard className="w-6 h-6 mr-3 text-bakery-amber-600" />
                  <div>
                    <p className="font-medium">Card on Collection</p>
                    <p className="text-sm text-muted-foreground">We accept all major cards</p>
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
                  <span>Collection</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total to Pay</span>
                  <span>£{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6 bg-stone-50 p-3 rounded border">
                By placing this order, you agree to pay the total amount upon collection.
              </p>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
