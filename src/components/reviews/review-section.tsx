import { mockReviews } from "@/lib/mocks/reviews";
import { ReviewCard } from "@/components/reviews/review-card";
import { StarRating } from "@/components/ui/star-rating";
import { WriteReviewDialog } from "@/components/reviews/write-review-dialog";

interface ReviewSectionProps {
  productId: string;
}

export function ReviewSection({ productId }: ReviewSectionProps) {
  const reviews = mockReviews.filter((r) => r.product_id === productId);
  const averageRating =
    reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div className="space-y-8 pt-12 border-t mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
        <WriteReviewDialog />
      </div>

      <div className="flex items-center gap-4 bg-muted/30 p-6 rounded-lg">
        <div className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</div>
        <div>
          <StarRating rating={averageRating} size={24} />
          <p className="text-sm text-muted-foreground mt-1">
            Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-muted-foreground text-center py-8 border rounded-lg border-dashed">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
}
