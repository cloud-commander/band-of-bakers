"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Pencil, Trash2, Quote, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Testimonial } from "@/db/schema";
import { deleteTestimonial, updateTestimonialStatus } from "@/actions/testimonials";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestimonialsTableProps {
  initialTestimonials: Testimonial[];
}

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE;

export function TestimonialsTable({ initialTestimonials }: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Filter testimonials based on tab
  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTab === "active") return t.is_active;
    if (activeTab === "pending") return !t.is_active;
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTestimonials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTestimonials = filteredTestimonials.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      const result = await deleteTestimonial(id);
      if (result.success) {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete testimonial");
      }
    }
  };

  const handleStatusUpdate = async (id: string, isActive: boolean) => {
    const result = await updateTestimonialStatus(id, isActive);
    if (result.success) {
      setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, is_active: isActive } : t)));
      toast.success(isActive ? "Testimonial approved" : "Testimonial rejected/deactivated");
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  return (
    <div>
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={filteredTestimonials.length}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left p-4 font-medium">Customer</TableHead>
              <TableHead className="text-left p-4 font-medium">Role</TableHead>
              <TableHead className="text-left p-4 font-medium">Rating</TableHead>
              <TableHead className="text-left p-4 font-medium">Status</TableHead>
              <TableHead className="w-[300px] text-left p-4 font-medium">Content</TableHead>
              <TableHead className="text-right p-4 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No testimonials found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="border-t hover:bg-muted/30">
                  <TableCell className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatar_url || undefined}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{testimonial.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-muted-foreground">{testimonial.role}</span>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{testimonial.rating}</span>
                      <Star className="w-4 h-4 fill-bakery-amber-400 text-bakery-amber-400" />
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                      {testimonial.is_active ? "Active" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex gap-2">
                      <Quote className="w-4 h-4 text-bakery-amber-400 shrink-0 mt-1" />
                      <p className="text-sm text-muted-foreground line-clamp-2 italic">
                        {testimonial.content}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!testimonial.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(testimonial.id, true)}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      {testimonial.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusUpdate(testimonial.id, false)}
                          className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                          title="Deactivate"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                        <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                        className="h-8 w-8 p-0 hover:text-destructive"
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

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {paginatedTestimonials.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg border">
            No testimonials found.
          </div>
        ) : (
          paginatedTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="block border rounded-lg p-4 hover:bg-muted/30 transition-colors"
            >
              {/* Header: Avatar, Name, Role, Status */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar_url || undefined} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                  {testimonial.is_active ? "Active" : "Pending"}
                </Badge>
              </div>

              {/* Rating & Actions */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-bold">{testimonial.rating}</span>
                  <Star className="w-4 h-4 fill-bakery-amber-400 text-bakery-amber-400" />
                </div>
                <div className="flex items-center gap-1">
                  {!testimonial.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusUpdate(testimonial.id, true)}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {testimonial.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusUpdate(testimonial.id, false)}
                      className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      title="Deactivate"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                    <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    className="h-8 w-8 p-0 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="bg-muted/50 p-3 rounded-md text-sm text-muted-foreground italic relative">
                <Quote className="w-3 h-3 text-bakery-amber-400 absolute top-2 left-2" />
                <p className="pl-4">{testimonial.content}</p>
              </div>
            </div>
          ))
        )}
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
    </div>
  );
}
