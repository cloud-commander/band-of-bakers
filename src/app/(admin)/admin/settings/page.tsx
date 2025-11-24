"use client";

import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [deliveryFee, setDeliveryFee] = useState("5.00");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    alert("Settings saved!");
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your store settings"
      />

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="delivery-fee">Delivery Fee (£)</Label>
                <Input
                  id="delivery-fee"
                  type="number"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                />
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                • Payment on Collection (Always enabled)
              </p>
              <p className="text-sm text-muted-foreground">• Stripe</p>
              <p className="text-sm text-muted-foreground">• PayPal</p>
              <p className="text-sm text-muted-foreground">• Bank Transfer</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
