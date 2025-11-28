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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { rescheduleBakeSale } from "@/actions/bake-sale-management";
import { toast } from "sonner";
import { Loader2, CalendarClock } from "lucide-react";

interface RescheduleBakeSaleDialogProps {
  bakeSaleId: string;
  currentDate: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function RescheduleBakeSaleDialog({
  bakeSaleId,
  currentDate,
  trigger,
  onSuccess,
}: RescheduleBakeSaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReschedule = async () => {
    if (!newDate) {
      toast.error("Please select a new date");
      return;
    }
    if (!reason.trim()) {
      toast.error("Please provide a reason for rescheduling");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await rescheduleBakeSale(bakeSaleId, newDate, reason);
      if (result.success) {
        toast.success(`Bake sale rescheduled. ${result.data.affectedOrders} orders notified.`);
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to reschedule bake sale");
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
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Reschedule Bake Sale
          </DialogTitle>
          <DialogDescription>
            Change the date for the bake sale currently scheduled on{" "}
            <span className="font-medium text-foreground">
              {new Date(currentDate).toLocaleDateString("en-GB")}
            </span>
            . This will notify all customers and update their orders.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-date">New Date</Label>
            <Input
              id="new-date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reschedule-reason">Reason for Change</Label>
            <Textarea
              id="reschedule-reason"
              placeholder="e.g., Scheduling conflict, venue unavailable..."
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
            Cancel
          </Button>
          <Button onClick={handleReschedule} disabled={isSubmitting || !newDate || !reason.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rescheduling...
              </>
            ) : (
              "Confirm Reschedule"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
