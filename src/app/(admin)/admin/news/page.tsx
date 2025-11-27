import Link from "next/link";
import { PageHeader } from "@/components/state/page-header";
import { getNewsPosts } from "@/actions/news";
import { Button } from "@/components/ui/button";
import { NewsPostsTable } from "@/components/admin/news-posts-table";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const newsPosts = await getNewsPosts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="News Posts"
        description="Manage news articles and announcements"
        actions={
          <Button asChild>
            <Link href="/admin/news/new">Create New Post</Link>
          </Button>
        }
      />

      <NewsPostsTable posts={newsPosts} />
    </div>
  );
}
