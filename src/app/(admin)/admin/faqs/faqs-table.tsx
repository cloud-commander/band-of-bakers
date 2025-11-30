"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Faq } from "@/db/schema";
import { deleteFaq, toggleFaqStatus } from "@/actions/faqs";
import { FaqDialog } from "./faq-dialog";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FaqsTableProps {
  initialFaqs: Faq[];
}

export function FaqsTable({ initialFaqs }: FaqsTableProps) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);

  const handleEdit = (faq: Faq) => {
    setSelectedFaq(faq);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedFaq(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (faq: Faq) => {
    setFaqToDelete(faq);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      const result = await deleteFaq(faqToDelete.id);
      if (result.success) {
        toast.success("FAQ deleted successfully");
        // Optimistic update or refresh
        window.location.reload(); // Simple refresh for now
      } else {
        toast.error(result.error || "Failed to delete FAQ");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await toggleFaqStatus(id, !currentStatus);
      if (result.success) {
        toast.success("FAQ status updated");
        // Optimistic update
        setFaqs(faqs.map((f) => (f.id === id ? { ...f, is_active: !currentStatus } : f)));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sort</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No FAQs found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>{faq.sort_order}</TableCell>
                  <TableCell className="font-medium">
                    <div>{faq.question}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {faq.answer}
                    </div>
                  </TableCell>
                  <TableCell>
                    {faq.category ? (
                      <Badge variant="outline">{faq.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={faq.is_active}
                        onCheckedChange={() => handleToggleStatus(faq.id, faq.is_active)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {faq.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(faq)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FaqDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        faq={selectedFaq}
        onSuccess={() => window.location.reload()}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FAQ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
