"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createBakeSale, updateBakeSale, getLocations } from "@/actions/bake-sales";
import { Loader2 } from "lucide-react";

const bakeSaleFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  location_id: z.string().min(1, "Location is required"),
  cutoff_datetime: z.string().min(1, "Cutoff time is required"),
  is_active: z.boolean(),
});

type BakeSaleFormData = z.infer<typeof bakeSaleFormSchema>;

interface Location {
  id: string;
  name: string;
}

interface BakeSaleDialogProps {
  mode: "create" | "edit";
  bakeSale?: {
    id: string;
    date: string;
    location_id: string;
    cutoff_datetime: string;
    is_active: boolean;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BakeSaleDialog({
  mode,
  bakeSale,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: BakeSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  const form = useForm<BakeSaleFormData>({
    resolver: zodResolver(bakeSaleFormSchema),
    defaultValues: {
      date: bakeSale?.date || "",
      location_id: bakeSale?.location_id || "",
      cutoff_datetime: bakeSale?.cutoff_datetime || "",
      is_active: bakeSale?.is_active ?? true,
    },
  });

  // Load locations when dialog opens
  useEffect(() => {
    if (isOpen) {
      async function loadLocations() {
        setLoadingLocations(true);
        try {
          const locs = await getLocations();
          setLocations(locs);
        } catch (error) {
          console.error("Failed to load locations:", error);
          toast.error("Failed to load locations");
        } finally {
          setLoadingLocations(false);
        }
      }
      loadLocations();
    }
  }, [isOpen]);

  // Reset form when bakeSale changes
  useEffect(() => {
    if (bakeSale) {
      form.reset({
        date: bakeSale.date,
        location_id: bakeSale.location_id,
        cutoff_datetime: bakeSale.cutoff_datetime,
        is_active: bakeSale.is_active,
      });
    } else {
      form.reset({
        date: "",
        location_id: "",
        cutoff_datetime: "",
        is_active: true,
      });
    }
  }, [bakeSale, form]);

  const onSubmit = async (data: BakeSaleFormData) => {
    try {
      const formData = new FormData();
      formData.append("date", data.date);
      formData.append("location_id", data.location_id);
      formData.append("cutoff_datetime", data.cutoff_datetime);
      formData.append("is_active", String(data.is_active));

      let result;
      if (mode === "create") {
        result = await createBakeSale(formData);
      } else {
        if (!bakeSale?.id) return;
        result = await updateBakeSale(bakeSale.id, formData);
      }

      if (result.success) {
        toast.success(
          mode === "create" ? "Bake sale created successfully" : "Bake sale updated successfully"
        );
        onOpenChange?.(false);
        if (mode === "create") {
          form.reset();
        }
      } else {
        toast.error(result.error || `Failed to ${mode} bake sale`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Bake Sale" : "Edit Bake Sale"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Schedule a new bake sale date and location."
              : "Update bake sale details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cutoff_datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Cutoff</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={loadingLocations ? "Loading..." : "Select location"}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Bake Sale" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
