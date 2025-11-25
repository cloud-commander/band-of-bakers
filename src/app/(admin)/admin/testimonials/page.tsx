"use client";

import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { mockTestimonials } from "@/lib/mocks/testimonials";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Plus, Pencil, Trash2, Quote } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE; // Reusing similar page size

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTestimonials = testimonials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast.success("Testimonial deleted successfully");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage customer testimonials displayed on the homepage"
        actions={
          <Link href="/admin/testimonials/new">
            <Button className="bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </Link>
        }
      />

      <Card className="border border-stone-200">
        <CardHeader>
          <Heading level={3} className="mb-0">
            All Testimonials
          </Heading>
        </CardHeader>
        <CardContent>
          {/* Pagination Info */}
          <div className="mb-6">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalItems={testimonials.length}
            />
          </div>

          <div className="rounded-md border border-stone-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-[400px]">Content</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTestimonials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No testimonials found. Add one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-stone-800">{testimonial.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-stone-600">{testimonial.role}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-stone-800">{testimonial.rating}</span>
                          <Star className="w-4 h-4 fill-bakery-amber-400 text-bakery-amber-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Quote className="w-4 h-4 text-bakery-amber-400 shrink-0 mt-1" />
                          <p className="text-sm text-stone-600 line-clamp-2 italic">
                            {testimonial.quote}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-400 hover:text-bakery-amber-700 hover:bg-bakery-amber-50"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(testimonial.id)}
                            className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
