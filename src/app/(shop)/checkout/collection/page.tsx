"use client";

import Link from "next/link";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useCart } from "@/context/cart-context";

export const dynamic = "force-dynamic";

export default function CheckoutCollectionPage() {
  const { cartTotal } = useCart();

  return (
    <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Checkout - Collection"
          breadcrumbs={[
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Collection" },
          ]}
        />

        <div className={`${DESIGN_TOKENS.cards.base} p-8 text-center`}>
          <h2 className={`${DESIGN_TOKENS.typography.h3.size} mb-4`}>
            Pay on Collection Coming Soon
          </h2>
          <p className="text-muted-foreground mb-8">
            We are currently finalizing our pay-on-collection workflow. In the meantime, please
            contact us directly to place an order for collection.
          </p>

          <div className="bg-muted p-4 rounded-lg mb-8 inline-block">
            <p className="font-medium">Order Total: £{cartTotal.toFixed(2)}</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/cart">Return to Cart</Link>
            </Button>
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
