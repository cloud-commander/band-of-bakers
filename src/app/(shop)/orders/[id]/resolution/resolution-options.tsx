"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { resolveOrderIssue } from "@/actions/bake-sale-management";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BakeSale {
  id: string;
  date: string;
  location: {
    name: string;
  };
}

interface ResolutionOptionsProps {
  orderId: string;
  upcomingSales: BakeSale[];
}

export function ResolutionOptions({ orderId, upcomingSales }: ResolutionOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<"transfer" | "cancel" | null>(null);
  const [selectedBakeSaleId, setSelectedBakeSaleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedOption) return;
    if (selectedOption === "transfer" && !selectedBakeSaleId) {
      toast.error("Please select a new date");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await resolveOrderIssue(
        orderId,
        selectedOption,
        selectedOption === "transfer" ? selectedBakeSaleId! : undefined
      );

      if (result.success) {
        toast.success(
          selectedOption === "transfer"
            ? "Order transferred successfully!"
            : "Order cancelled and refund processed."
        );
        router.push(`/orders/${orderId}`);
      } else {
        toast.error(result.error || "Failed to process request");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {/* Option 1: Transfer */}
        <div
          className={cn(
            "border rounded-lg p-4 cursor-pointer transition-all",
            selectedOption === "transfer"
              ? "border-bakery-amber-500 bg-bakery-amber-50 ring-1 ring-bakery-amber-500"
              : "hover:border-stone-300 bg-white"
          )}
          onClick={() => setSelectedOption("transfer")}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={(v) => setSelectedOption(v as "transfer" | "cancel")}
              >
                <RadioGroupItem value="transfer" id="opt-transfer" />
              </RadioGroup>
            </div>
            <div className="flex-1">
              <Label htmlFor="opt-transfer" className="text-base font-semibold cursor-pointer">
                Transfer to another date
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Move your order to an upcoming bake sale. No extra charge.
              </p>

              {selectedOption === "transfer" && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                  {upcomingSales.length > 0 ? (
                    <RadioGroup
                      value={selectedBakeSaleId || ""}
                      onValueChange={setSelectedBakeSaleId}
                    >
                      {upcomingSales.map((sale) => (
                        <div
                          key={sale.id}
                          className="flex items-center space-x-2 border rounded p-3 bg-white"
                        >
                          <RadioGroupItem value={sale.id} id={sale.id} />
                          <Label htmlFor={sale.id} className="flex-1 cursor-pointer">
                            <div className="font-medium">
                              {new Date(sale.date).toLocaleDateString("en-GB", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {sale.location.name}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded">
                      No upcoming bake sales available. Please choose to cancel for a refund.
                    </p>
                  )}
                </div>
              )}
            </div>
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Option 2: Cancel */}
        <div
          className={cn(
            "border rounded-lg p-4 cursor-pointer transition-all",
            selectedOption === "cancel"
              ? "border-red-500 bg-red-50 ring-1 ring-red-500"
              : "hover:border-stone-300 bg-white"
          )}
          onClick={() => setSelectedOption("cancel")}
        >
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={(v) => setSelectedOption(v as "transfer" | "cancel")}
              >
                <RadioGroupItem value="cancel" id="opt-cancel" />
              </RadioGroup>
            </div>
            <div className="flex-1">
              <Label htmlFor="opt-cancel" className="text-base font-semibold cursor-pointer">
                Cancel for full refund
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Cancel your order and receive a full refund to your original payment method.
              </p>
            </div>
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={
          !selectedOption || isSubmitting || (selectedOption === "transfer" && !selectedBakeSaleId)
        }
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Confirm Selection"
        )}
      </Button>
    </div>
  );
}
