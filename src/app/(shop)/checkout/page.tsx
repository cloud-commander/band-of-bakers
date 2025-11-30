"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { ArrowRight, ShoppingBag, Truck } from "lucide-react";
import { SHIPPING_COST } from "@/lib/constants/app";
import { createOrder } from "@/actions/orders";
import { savePhoneFromCheckout } from "@/actions/profile";
import { TurnstileWidget } from "@/components/turnstile/turnstile-widget";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

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
});

type CheckoutDeliveryForm = z.infer<typeof checkoutDeliverySchema>;

export default function CheckoutPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_BANDOFBAKERS_TURNSTILE_SITEKEY);

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
    },
  });

  const totalToPay = cartTotal + SHIPPING_COST;

  const onSubmit = async (data: CheckoutDeliveryForm) => {
    if (status !== "authenticated") {
      await signIn(undefined, { callbackUrl: "/checkout" });
      return;
    }

    try {
      if (turnstileEnabled && !turnstileToken) {
        toast.error("Please complete the verification");
        return;
      }

      const orderData = {
        ...data,
        fulfillment_method: "delivery" as const,
        payment_method: "payment_on_collection" as const,
        turnstileToken: turnstileToken || undefined,
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

      clearCart();
      if (session?.user && !session.user.phone && data.phone) {
        const shouldSave = window.confirm(
          "Save this phone number to your profile for faster checkout next time?"
        );
        if (shouldSave) {
          const saveResult = await savePhoneFromCheckout(data.phone);
          if (saveResult.success && !saveResult.skipped) {
            toast.success("Phone saved to your profile");
          } else if (!saveResult.success) {
            toast.error(saveResult.error || "Could not save phone to profile");
          }
        }
      }
      toast.success("Order placed!", {
        action: {
          label: "View Orders",
          onClick: () => router.push("/orders"),
        },
        duration: 5000,
      });
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

              {/* Verification */}
              {turnstileEnabled && (
                <div className={`${DESIGN_TOKENS.cards.base} p-6`}>
                  <h2 className={`${DESIGN_TOKENS.typography.h4.size} mb-2`}>
                    Verify you’re human
                  </h2>
                  <TurnstileWidget
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => {
                      setTurnstileToken(null);
                      toast.error("Verification failed, please retry");
                    }}
                    onExpire={() => {
                      setTurnstileToken(null);
                      toast.error("Verification expired, please retry");
                    }}
                    theme="light"
                  />
                </div>
              )}
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
                Payment is taken on delivery or collection. No card details are needed online.
              </p>

              <Button
                type="submit"
                form="checkout-form"
                className="w-full"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : `Place Order (£${totalToPay.toFixed(2)})`}
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
