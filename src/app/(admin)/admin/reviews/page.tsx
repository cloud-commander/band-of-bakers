import { PageHeader } from "@/components/state/page-header";
import { getPaginatedReviews } from "@/actions/reviews";
import { ReviewsTable } from "./reviews-table";

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 20;
  const {
    data,
    total,
    page: currentPage,
    pageSize: limit,
  } = await getPaginatedReviews(page, pageSize);

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate customer reviews for your products" />
      <ReviewsTable
        initialReviews={data}
        totalCount={total}
        currentPage={currentPage}
        pageSize={limit}
      />
    </div>
  );
}
