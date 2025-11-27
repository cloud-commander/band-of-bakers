import { PageHeader } from "@/components/state/page-header";
import { getPublishedNewsPosts } from "@/actions/news";
import { NewsGrid } from "@/components/shop/news-grid";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const publishedNews = await getPublishedNewsPosts();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader
          title="News & Updates"
          description="Stay up to date with the latest from Band of Bakers"
        />

        <NewsGrid posts={publishedNews} />
      </div>
    </div>
  );
}
