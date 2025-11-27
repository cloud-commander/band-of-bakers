"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { MOCK_API_DELAY_MS } from "@/lib/constants/app";
import { createBakeSale } from "@/actions/bake-sales";

// Simplified form schema for demo
// In production, use insertBakeSaleSchema and location_id from database
const bakeSaleFormSchema = z
  .object({
    date: z.string().min(1, "Date is required"),
    location: z.string().min(1, "Location name is required"),
    address: z.string().min(1, "Address is required"),
    cutoff_datetime: z.string().min(1, "Cutoff date/time is required"),
    is_active: z.boolean(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const saleDate = new Date(data.date);
      const cutoffDate = new Date(data.cutoff_datetime);
      return cutoffDate <= saleDate;
    },
    {
      message: "Cutoff time must be before bake sale date",
      path: ["cutoff_datetime"],
    }
  );

type BakeSaleForm = z.infer<typeof bakeSaleFormSchema>;

export default function NewBakeSalePage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BakeSaleForm>({
    resolver: zodResolver(bakeSaleFormSchema),
    defaultValues: {
      date: "",
      location: "Cressage Village Hall",
      address: "Cressage, Shropshire, SY5 6AF",
      cutoff_datetime: "",
      is_active: true,
      notes: "",
    },
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
    setValue("location", location.name);
    setValue("address", location.address);
  };

  const onSubmit = async (data: BakeSaleForm) => {
    try {
      const formData = new FormData();
      formData.append("date", data.date);
      formData.append("location", data.location);
      formData.append("address", data.address);
      formData.append("cutoff_datetime", data.cutoff_datetime);
      formData.append("is_active", data.is_active.toString());
      if (data.notes) {
        formData.append("notes", data.notes);
      }

      const result = await createBakeSale(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Bake sale created successfully!", {
        description: `${data.location} on ${new Date(data.date).toLocaleDateString("en-GB")}`,
      });

      router.push("/admin/bake-sales");
    } catch (error) {
      toast.error("Failed to create bake sale", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
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

      <form onSubmit={handleSubmit(onSubmit)}>
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
                      min={minDate}
                      {...register("date")}
                      className="pl-10"
                    />
                  </div>
                  {errors.date && (
                    <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Select a future date for your bake sale
                  </p>
                </div>

                <div>
                  <label htmlFor="cutoff_datetime" className="block text-sm font-medium mb-2">
                    Order Cutoff Date/Time <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="cutoff_datetime"
                    type="datetime-local"
                    {...register("cutoff_datetime")}
                  />
                  {errors.cutoff_datetime && (
                    <p className="text-sm text-red-600 mt-1">{errors.cutoff_datetime.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    When should orders close for this bake sale?
                  </p>
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
                    {...register("location")}
                    placeholder="e.g., Cressage Village Hall"
                  />
                  {errors.location && (
                    <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-2">
                    Address <span className="text-red-600">*</span>
                  </label>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Full address including postcode"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <Heading level={3} className="mb-0">
                  Additional Settings
                </Heading>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Any special notes or instructions for this bake sale..."
                    rows={3}
                    className="w-full px-3 py-2 border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bakery-amber-500"
                  />
                  {errors.notes && (
                    <p className="text-sm text-red-600 mt-1">{errors.notes.message}</p>
                  )}
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
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Active
                    </label>
                    <input
                      id="is_active"
                      type="checkbox"
                      {...register("is_active")}
                      className="w-4 h-4 text-bakery-amber-600 border-stone-300 rounded focus:ring-bakery-amber-500"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When active, customers can place orders for this bake sale
                  </p>
                </div>
              </CardContent>
            </Card>

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
