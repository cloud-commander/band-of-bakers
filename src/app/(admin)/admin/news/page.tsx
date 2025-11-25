"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import { mockNewsPosts } from "@/lib/mocks/news";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { Calendar, User, Eye, EyeOff } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_NEWS_ITEMS_PER_PAGE;

export default function AdminNewsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort by created date, newest first
  const newsPosts = mockNewsPosts.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(newsPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = newsPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (newsPosts.length === 0) {
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
        <div className="text-center py-16 border rounded-lg">
          <p className={`${DESIGN_TOKENS.typography.body.lg.size} text-muted-foreground mb-4`}>
            No news posts yet
          </p>
          <Button asChild>
            <Link href="/admin/news/new">Create Your First Post</Link>
          </Button>
        </div>
      </div>
    );
  }

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

      {/* Pagination Info */}
      <div>
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={newsPosts.length}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-4 text-left font-semibold">Title</th>
              <th className="p-4 text-left font-semibold">Author</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Published</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPosts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-muted/30">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p
                      className={`${DESIGN_TOKENS.typography.body.sm.size} text-muted-foreground line-clamp-1`}
                    >
                      {post.excerpt}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className={DESIGN_TOKENS.typography.body.sm.size}>
                      {post.author || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {post.is_published ? (
                    <Badge variant="default" className="flex items-center gap-1 w-fit">
                      <Eye className="h-3 w-3" />
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <EyeOff className="h-3 w-3" />
                      Draft
                    </Badge>
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {post.published_at ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.published_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                    {post.is_published ? (
                      <Button size="sm" variant="ghost">
                        Unpublish
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost">
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6">
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
