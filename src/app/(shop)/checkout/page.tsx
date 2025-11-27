"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { ArrowRight, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { SHIPPING_COST, MOCK_API_DELAY_MS } from "@/lib/constants/app";
import { createOrder } from "@/actions/orders";

export const dynamic = "force-dynamic";

// Delivery checkout validation schema
const checkoutDeliverySchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name is too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name is too long"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^(\+44|0)\s?[0-9]{10}$/, "Please enter a valid UK phone number"),
  address1: z.string().min(1, "Address is required").max(100, "Address is too long"),
  address2: z.string().max(100, "Address is too long").optional(),
  city: z.string().min(1, "City is required").max(50, "City is too long"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .regex(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i, "Please enter a valid UK postcode"),
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^[0-9]{13,19}$/, "Please enter a valid card number"),
  expiry: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Format: MM/YY"),
  cvc: z
    .string()
    .min(1, "CVC is required")
    .regex(/^[0-9]{3,4}$/, "Please enter a valid CVC"),
});

type CheckoutDeliveryForm = z.infer<typeof checkoutDeliverySchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutDeliveryForm>({
    resolver: zodResolver(checkoutDeliverySchema),
    defaultValues: {
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
    },
  });

  const totalToPay = cartTotal + SHIPPING_COST;

  const onSubmit = async (data: CheckoutDeliveryForm) => {
    try {
      const orderData = {
        ...data,
        fulfillment_method: "delivery" as const,
        payment_method: "stripe",
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderData);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY_MS));

      clearCart();
      toast.success("Payment successful! Order placed.");
      router.push("/checkout/success");
    } catch (error) {
      toast.error("Payment failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
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
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Info */}
              <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-6`}>Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && (
                      <p className="text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && (
                      <p className="text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="07700 900000"
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-6`}>Shipping Address</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input id="address1" {...register("address1")} placeholder="Street address" />
                    {errors.address1 && (
                      <p className="text-sm text-red-600">{errors.address1.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input
                      id="address2"
                      {...register("address2")}
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input id="postcode" {...register("postcode")} placeholder="SW1A 1AA" />
                      {errors.postcode && (
                        <p className="text-sm text-red-600">{errors.postcode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
                <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-6`}>Payment Details</h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      {...register("cardNumber")}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        {...register("expiry")}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.expiry && (
                        <p className="text-sm text-red-600">{errors.expiry.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" {...register("cvc")} placeholder="123" maxLength={4} />
                      {errors.cvc && <p className="text-sm text-red-600">{errors.cvc.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </form>
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
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    <span>Delivery</span>
                  </div>
                  <span>£{SHIPPING_COST.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total to Pay</span>
                  <span>£{totalToPay.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6 bg-stone-50 p-3 rounded border">
                Your payment is secure and encrypted. We accept all major credit and debit cards.
              </p>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Processing Payment..."
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay £{totalToPay.toFixed(2)}
                  </>
                )}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                By placing this order, you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms & Conditions
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
