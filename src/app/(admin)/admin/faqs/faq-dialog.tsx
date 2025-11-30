"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { createFaq, updateFaq } from "@/actions/faqs";
import { toast } from "sonner";
import type { Faq } from "@/db/schema";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

type FaqFormValues = z.infer<typeof faqSchema>;

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: Faq | null;
  onSuccess: () => void;
}

export function FaqDialog({ open, onOpenChange, faq, onSuccess }: FaqDialogProps) {
  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "",
      sort_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        category: faq.category || "",
        sort_order: faq.sort_order,
        is_active: faq.is_active,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
        category: "",
        sort_order: 0,
        is_active: true,
      });
    }
  }, [faq, form, open]);

  const onSubmit = async (data: FaqFormValues) => {
    try {
      if (faq) {
        const result = await updateFaq(faq.id, data);
        if (result.success) {
          toast.success("FAQ updated successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to update FAQ");
        }
      } else {
        const result = await createFaq(data);
        if (result.success) {
          toast.success("FAQ created successfully");
          onSuccess();
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to create FAQ");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Create FAQ"}</DialogTitle>
          <DialogDescription>
            {faq ? "Update the FAQ details below." : "Add a new FAQ to the system."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input id="question" {...form.register("question")} />
            {form.formState.errors.question && (
              <p className="text-sm text-red-500">{form.formState.errors.question.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea id="answer" {...form.register("answer")} rows={4} />
            {form.formState.errors.answer && (
              <p className="text-sm text-red-500">{form.formState.errors.answer.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...form.register("category")} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input id="sort_order" type="number" {...form.register("sort_order")} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={form.watch("is_active")}
              onCheckedChange={(checked) => form.setValue("is_active", checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
