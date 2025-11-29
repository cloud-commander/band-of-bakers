"use client";

import { useEffect, useState } from "react";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Define a type that includes relations
type ReviewWithRelations = Review & {
  product?: Product | null;
  user?: User | null;
};

interface ReviewsTableProps {
  initialReviews: ReviewWithRelations[];
  totalCount: number;
  currentPage: number;
  pageSize?: number;
}

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_ORDERS_ITEMS_PER_PAGE;

export function ReviewsTable({
  initialReviews,
  totalCount,
  currentPage,
  pageSize = ITEMS_PER_PAGE,
}: ReviewsTableProps) {
  const [reviews, setReviews] = useState<ReviewWithRelations[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageState, setPageState] = useState(currentPage);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  useEffect(() => {
    setPageState(currentPage);
  }, [currentPage]);

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

  const hasClientFilters = Boolean(searchQuery || statusFilter !== "all");
  const totalPages = hasClientFilters
    ? Math.max(1, Math.ceil(filteredReviews.length / pageSize))
    : Math.max(1, Math.ceil(totalCount / pageSize));
  const startIndex = hasClientFilters ? (pageState - 1) * pageSize : 0;
  const endIndex = hasClientFilters ? startIndex + pageSize : filteredReviews.length;
  const paginatedReviews = hasClientFilters
    ? filteredReviews.slice(startIndex, endIndex)
    : filteredReviews;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    router.push(`${pathname}?${params.toString()}`);
    setPageState(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusUpdate = async (reviewId: string, newStatus: "approved" | "rejected") => {
    try {
      await updateReviewStatus(reviewId, newStatus);
      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
      toast.success(`Review ${newStatus} successfully`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setReviews(reviews.filter((r) => r.id !== reviewId));
        toast.success("Review deleted successfully");
      } catch {
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
                  setPageState(1);
                }}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPageState(1);
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
            currentPage={pageState}
            pageSize={pageSize}
            totalItems={hasClientFilters ? filteredReviews.length : totalCount}
          />
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-md border border-stone-200">
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

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {paginatedReviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg border">
              No reviews found matching your filters.
            </div>
          ) : (
            paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
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
                    <div>
                      <p className="font-medium text-sm">
                        {review.product?.name || "Unknown Product"}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs">{review.rating}</span>
                        <Star className="w-3 h-3 fill-bakery-amber-400 text-bakery-amber-400" />
                      </div>
                    </div>
                  </div>
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
                </div>

                <div className="mb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 pb-3 border-b">
                  <span>{review.user?.name || "Unknown User"}</span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {review.status !== "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(review.id, "approved")}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(review.id, "rejected")}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    className="text-stone-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
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
      </CardContent>
    </Card>
  );
}
