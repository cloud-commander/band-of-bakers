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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createLocation, updateLocation } from "@/actions/locations";
import { Loader2 } from "lucide-react";

const locationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address_line1: z.string().min(1, "Address Line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postcode is required"),
  collection_hours: z.string().optional(),
  is_active: z.boolean(),
});

type LocationFormData = z.infer<typeof locationFormSchema>;

interface LocationDialogProps {
  mode: "create" | "edit";
  location?: {
    id: string;
    name: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    postcode: string;
    collection_hours: string | null;
    is_active: boolean;
  };
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LocationDialog({
  mode,
  location,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: LocationDialogProps) {
  const [open, setOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : open;
  const onOpenChange = isControlled ? setControlledOpen : setOpen;

  const form = useForm<LocationFormData>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: location?.name || "",
      address_line1: location?.address_line1 || "",
      address_line2: location?.address_line2 || "",
      city: location?.city || "",
      postcode: location?.postcode || "",
      collection_hours: location?.collection_hours || "",
      is_active: location?.is_active ?? true,
    },
  });

  // Reset form when location changes
  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        address_line1: location.address_line1,
        address_line2: location.address_line2 || "",
        city: location.city,
        postcode: location.postcode,
        collection_hours: location.collection_hours || "",
        is_active: location.is_active,
      });
    } else {
      form.reset({
        name: "",
        address_line1: "",
        address_line2: "",
        city: "",
        postcode: "",
        collection_hours: "",
        is_active: true,
      });
    }
  }, [location, form]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address_line1", data.address_line1);
      if (data.address_line2) formData.append("address_line2", data.address_line2);
      formData.append("city", data.city);
      formData.append("postcode", data.postcode);
      if (data.collection_hours) formData.append("collection_hours", data.collection_hours);
      formData.append("is_active", String(data.is_active));

      let result;
      if (mode === "create") {
        result = await createLocation(formData);
      } else {
        if (!location?.id) return;
        result = await updateLocation(location.id, formData);
      }

      if (result.success) {
        toast.success(
          mode === "create" ? "Location created successfully" : "Location updated successfully"
        );
        onOpenChange?.(false);
        if (mode === "create") {
          form.reset();
        }
      } else {
        toast.error(result.error || `Failed to ${mode} location`);
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
          <DialogTitle>{mode === "create" ? "Add Location" : "Edit Location"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new pickup location for bake sales."
              : "Update location details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Town Hall" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 123 High Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Suite 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Shrewsbury" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SY1 1AA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="collection_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 10:00 - 14:00" {...field} />
                  </FormControl>
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
                {mode === "create" ? "Create Location" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
