"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  const [orderNumber] = useState(() => `ORD-${Math.floor(100000 + Math.random() * 900000)}`);

  return (
    <div
      className={`min-h-screen ${DESIGN_TOKENS.sections.padding} flex items-center justify-center`}
    >
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className={`${DESIGN_TOKENS.typography.h2.size} mb-4`}>Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order. We&apos;ve sent a confirmation email with your order details.
        </p>

        <div className="bg-muted p-6 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground mb-1">Order Reference</p>
          <p className="text-xl font-mono font-bold tracking-wider">{orderNumber}</p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/orders">View My Orders</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/menu">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
