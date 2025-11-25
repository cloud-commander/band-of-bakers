"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockVouchers } from "@/lib/mocks/vouchers";
import { Ticket } from "lucide-react";

export function TopVouchersList() {
  // Sort vouchers by usage and take top 5
  const topVouchers = [...mockVouchers].sort((a, b) => b.current_uses - a.current_uses).slice(0, 5);

  return (
    <Card className="col-span-1 border border-stone-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-serif text-stone-800 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-bakery-amber-600" />
          Top Vouchers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topVouchers.map((voucher, index) => (
            <div
              key={voucher.id}
              className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 hover:border-bakery-amber-200 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-stone-200 text-sm font-bold text-stone-600 group-hover:text-bakery-amber-700 group-hover:border-bakery-amber-200 transition-colors">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-stone-800">{voucher.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {voucher.type === "percentage"
                      ? `${voucher.value}% off`
                      : `£${voucher.value.toFixed(2)} off`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-bakery-amber-700">
                  {voucher.current_uses}
                </span>
                <p className="text-xs text-muted-foreground">uses</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
