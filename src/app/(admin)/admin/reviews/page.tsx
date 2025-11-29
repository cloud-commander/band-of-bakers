import { PageHeader } from "@/components/state/page-header";
import { getPaginatedReviews } from "@/actions/reviews";
import { ReviewsTable } from "./reviews-table";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 20;
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
