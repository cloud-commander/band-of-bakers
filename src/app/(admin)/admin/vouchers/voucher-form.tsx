"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Voucher } from "@/db/schema";
import { createVoucher, updateVoucher } from "@/actions/vouchers";
import { ArrowLeft, Save } from "lucide-react";

const voucherFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["percentage", "fixed_amount"]),
  value: z.number().positive("Value must be greater than 0"),
  min_order_value: z.number().min(0, "Min order must be 0 or more"),
  max_uses: z.number().int().min(0, "Max uses cannot be negative").nullable(),
  current_uses: z.number().int().min(0, "Current uses cannot be negative"),
  max_uses_per_customer: z.number().int().min(1, "Minimum 1 per customer"),
  valid_from: z.string().min(1, "Valid from is required"),
  valid_until: z.string().min(1, "Valid until is required"),
  is_active: z.boolean(),
  notes: z.string().trim().max(1000).optional(),
});

type VoucherFormValues = z.infer<typeof voucherFormSchema>;

interface VoucherFormProps {
  mode: "create" | "edit";
  voucher?: Voucher;
}

function toDatetimeLocal(value: string) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => `${n}`.padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}`;
  } catch {
    return "";
  }
}

export function VoucherForm({ mode, voucher }: VoucherFormProps) {
  const router = useRouter();

  const defaultValidFrom = useMemo(
    () => (voucher ? toDatetimeLocal(voucher.valid_from) : toDatetimeLocal(new Date().toISOString())),
    [voucher]
  );
  const defaultValidUntil = useMemo(() => {
    if (voucher) return toDatetimeLocal(voucher.valid_until);
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toDatetimeLocal(d.toISOString());
  }, [voucher]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherFormSchema),
    defaultValues: {
      code: voucher?.code ?? "",
      type: (voucher?.type as "percentage" | "fixed_amount") ?? "percentage",
      value: voucher?.value ?? 0,
      min_order_value: voucher?.min_order_value ?? 0,
      max_uses: voucher?.max_uses ?? null,
      current_uses: voucher?.current_uses ?? 0,
      max_uses_per_customer: voucher?.max_uses_per_customer ?? 1,
      valid_from: defaultValidFrom,
      valid_until: defaultValidUntil,
      is_active: Boolean(voucher?.is_active ?? true),
      notes: voucher?.notes ?? "",
    },
  });

  const onSubmit = async (data: VoucherFormValues) => {
    try {
      const formData = new FormData();
      formData.append("code", data.code);
      formData.append("type", data.type);
      formData.append("value", data.value.toString());
      formData.append("min_order_value", data.min_order_value.toString());
      if (data.max_uses !== null && data.max_uses !== undefined) {
        formData.append("max_uses", data.max_uses.toString());
      }
      formData.append("current_uses", data.current_uses.toString());
      formData.append("max_uses_per_customer", data.max_uses_per_customer.toString());
      formData.append("valid_from", new Date(data.valid_from).toISOString());
      formData.append("valid_until", new Date(data.valid_until).toISOString());
      formData.append("is_active", data.is_active ? "true" : "false");
      formData.append("notes", data.notes || "");

      const result =
        mode === "edit" && voucher
          ? await updateVoucher(voucher.id, formData)
          : await createVoucher(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(mode === "edit" ? "Voucher updated" : "Voucher created");
      router.push("/admin/vouchers");
    } catch (error) {
      toast.error("Failed to save voucher", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    }
  };

  const pageTitle = mode === "edit" ? `Edit Voucher ${voucher?.code ?? ""}` : "Create Voucher";
  const pageDescription =
    mode === "edit"
      ? "Update voucher details, usage limits, and validity."
      : "Create a new voucher for promotions and discounts.";
  const backHref = "/admin/vouchers";

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        actions={
          <Link href={backHref}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Vouchers
            </Button>
          </Link>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-stone-200">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" {...register("code")} className="font-mono" />
                    {errors.code && <p className="text-sm text-red-600">{errors.code.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="value">Value</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      {...register("value", { valueAsNumber: true })}
                    />
                    {errors.value && <p className="text-sm text-red-600">{errors.value.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_order_value">Minimum Order (£)</Label>
                    <Input
                      id="min_order_value"
                      type="number"
                      step="0.01"
                      {...register("min_order_value", { valueAsNumber: true })}
                    />
                    {errors.min_order_value && (
                      <p className="text-sm text-red-600">{errors.min_order_value.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_uses">Max Uses (leave blank for unlimited)</Label>
                    <Input
                      id="max_uses"
                      type="number"
                      min={0}
                      {...register("max_uses", {
                        setValueAs: (val) => (val === "" || val === null ? null : Number(val)),
                      })}
                    />
                    {errors.max_uses && (
                      <p className="text-sm text-red-600">{errors.max_uses.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_uses_per_customer">Max Uses per Customer</Label>
                    <Input
                      id="max_uses_per_customer"
                      type="number"
                      min={1}
                      {...register("max_uses_per_customer", { valueAsNumber: true })}
                    />
                    {errors.max_uses_per_customer && (
                      <p className="text-sm text-red-600">
                        {errors.max_uses_per_customer.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_uses">Current Uses</Label>
                    <Input
                      id="current_uses"
                      type="number"
                      min={0}
                      {...register("current_uses", { valueAsNumber: true })}
                    />
                    {errors.current_uses && (
                      <p className="text-sm text-red-600">{errors.current_uses.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">Status</Label>
                    <Controller
                      name="is_active"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ? "true" : "false"}
                          onValueChange={(val) => field.onChange(val === "true")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.is_active && (
                      <p className="text-sm text-red-600">{errors.is_active.message as string}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valid_from">Valid From</Label>
                    <Input id="valid_from" type="datetime-local" {...register("valid_from")} />
                    {errors.valid_from && (
                      <p className="text-sm text-red-600">{errors.valid_from.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valid_until">Valid Until</Label>
                    <Input id="valid_until" type="datetime-local" {...register("valid_until")} />
                    {errors.valid_until && (
                      <p className="text-sm text-red-600">{errors.valid_until.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Internal Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    rows={4}
                    placeholder="Add internal context for this voucher"
                    disabled={false}
                    {...register("notes")}
                  />
                  {errors.notes && <p className="text-sm text-red-600">{errors.notes.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
