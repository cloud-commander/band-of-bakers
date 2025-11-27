"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Check, X, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import Image from "next/image";
import { deleteReview, updateReviewStatus } from "@/actions/reviews";
import { Review, Product, User } from "@/db/schema";

// Define a type that includes relations
type ReviewWithRelations = Review & {
  product?: Product | null;
  user?: User | null;
};

interface ReviewsTableProps {
  initialReviews: ReviewWithRelations[];
}

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE;

export function ReviewsTable({ initialReviews }: ReviewsTableProps) {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = reviews.filter((review) => {
    const productName = review.product?.name.toLowerCase() || "";
    const userName = review.user?.name.toLowerCase() || "";
    const matchesSearch =
      productName.includes(searchQuery.toLowerCase()) ||
      userName.includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusUpdate = async (reviewId: string, newStatus: "approved" | "rejected") => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
      toast.success(`Review ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((r) => r.id !== reviewId));
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  return (
    <Card className="border border-stone-200">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Heading level={3} className="mb-0">
            All Reviews
          </Heading>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Pagination Info */}
        <div className="mb-6">
          <PaginationInfo
            currentPage={currentPage}
            pageSize={ITEMS_PER_PAGE}
            totalItems={filteredReviews.length}
          />
        </div>

        <div className="rounded-md border border-stone-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50">
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[300px]">Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No reviews found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReviews.map((review) => {
                  return (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {review.product?.image_url && (
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-stone-100">
                              <Image
                                src={review.product.image_url}
                                alt={review.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <span className="font-medium text-stone-800">
                            {review.product?.name || "Unknown Product"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-stone-800">
                            {review.user?.name || "Unknown User"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {review.user?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-stone-800">{review.rating}</span>
                          <Star className="w-4 h-4 fill-bakery-amber-400 text-bakery-amber-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-stone-600 line-clamp-2" title={review.comment}>
                          {review.comment}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            review.status === "approved"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : review.status === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        >
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status !== "approved" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusUpdate(review.id, "approved")}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusUpdate(review.id, "rejected")}
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                            className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
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
  );
}
