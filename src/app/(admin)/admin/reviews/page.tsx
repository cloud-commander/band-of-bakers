import { PageHeader } from "@/components/state/page-header";
import { getAllReviews } from "@/actions/reviews";
import { ReviewsTable } from "./reviews-table";

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate customer reviews for your products" />
      <ReviewsTable initialReviews={reviews} />
    </div>
  );
}
