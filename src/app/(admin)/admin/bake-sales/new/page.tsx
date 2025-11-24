"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewBakeSalePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "13:00",
    location: "Cressage Village Hall",
    address: "Cressage, Shropshire, SY5 6AF",
    maxOrders: "50",
    cutoffDays: "2",
    isActive: true,
    notes: "",
  });

  const commonLocations = [
    {
      name: "Cressage Village Hall",
      address: "Cressage, Shropshire, SY5 6AF",
    },
    {
      name: "Shrewsbury Market",
      address: "The Square, Shrewsbury, SY1 1LH",
    },
    {
      name: "Much Wenlock Guildhall",
      address: "High Street, Much Wenlock, TF13 6AA",
    },
  ];

  const handleLocationSelect = (location: (typeof commonLocations)[0]) => {
    setFormData({
      ...formData,
      location: location.name,
      address: location.address,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Bake sale date must be in the future");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Bake sale created successfully!", {
      description: `${formData.location} on ${new Date(formData.date).toLocaleDateString("en-GB")}`,
    });

    setIsSubmitting(false);
    router.push("/admin/bake-sales");
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/admin/bake-sales">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bake Sales
          </Link>
        </Button>
        <PageHeader
          title="Schedule New Bake Sale"
          description="Create a new bake sale event for customers to order from"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date & Time */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Date & Time
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Bake Sale Date <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="date"
                      type="date"
                      required
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a future date for your bake sale
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium mb-2">
                      Start Time <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium mb-2">
                      End Time <span className="text-red-600">*</span>
                    </label>
                    <Input
                      id="endTime"
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Location
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Quick Select</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {commonLocations.map((loc) => (
                      <Button
                        key={loc.name}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleLocationSelect(loc)}
                        className={
                          formData.location === loc.name
                            ? "bg-bakery-amber-50 border-bakery-amber-300"
                            : ""
                        }
                      >
                        {loc.name.split(" ")[0]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Location Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Cressage Village Hall"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address including postcode"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Order Settings
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxOrders" className="block text-sm font-medium mb-2">
                      Max Orders
                    </label>
                    <Input
                      id="maxOrders"
                      type="number"
                      min="1"
                      value={formData.maxOrders}
                      onChange={(e) => setFormData({ ...formData, maxOrders: e.target.value })}
                      placeholder="50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum number of orders accepted
                    </p>
                  </div>
                  <div>
                    <label htmlFor="cutoffDays" className="block text-sm font-medium mb-2">
                      Cutoff (days)
                    </label>
                    <Input
                      id="cutoffDays"
                      type="number"
                      min="0"
                      value={formData.cutoffDays}
                      onChange={(e) => setFormData({ ...formData, cutoffDays: e.target.value })}
                      placeholder="2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Days before event to close orders
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special notes or instructions for this bake sale..."
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Status
                </Heading>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="isActive" className="text-sm font-medium">
                      Active
                    </label>
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-bakery-amber-600 border-stone-300 rounded focus:ring-bakery-amber-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.isActive
                      ? "Customers can place orders for this bake sale"
                      : "Bake sale will be hidden from customers"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {formData.date && (
              <Card className="mt-6">
                <CardHeader>
                  <Heading level={3} className="mb-0">
                    Preview
                  </Heading>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(formData.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">
                      {formData.startTime} - {formData.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{formData.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Order Cutoff</p>
                    <p className="font-medium">{formData.cutoffDays} days before event</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white"
              >
                {isSubmitting ? "Creating..." : "Create Bake Sale"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/admin/bake-sales")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
