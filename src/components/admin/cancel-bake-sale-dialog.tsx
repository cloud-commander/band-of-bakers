"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cancelBakeSale } from "@/actions/bake-sale-management";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

interface CancelBakeSaleDialogProps {
  bakeSaleId: string;
  date: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CancelBakeSaleDialog({
  bakeSaleId,
  date,
  trigger,
  onSuccess,
}: CancelBakeSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await cancelBakeSale(bakeSaleId, reason);
      if (result.success) {
        toast.success(`Bake sale cancelled. ${result.data.affectedOrders} orders notified.`);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to cancel bake sale");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Bake Sale
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel the bake sale on{" "}
            <span className="font-medium text-foreground">
              {new Date(date).toLocaleDateString("en-GB")}
            </span>
            ? This will notify all customers with pending orders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation</Label>
            <Textarea
              id="reason"
              placeholder="e.g., Unforeseen circumstances, severe weather..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This reason will be included in the email sent to customers.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
            Keep Bake Sale
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isSubmitting || !reason.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
