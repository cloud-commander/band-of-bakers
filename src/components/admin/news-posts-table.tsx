"use client";

import { useState } from "react";
import type { NewsPost } from "@/db/schema";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { Calendar, User, Eye, EyeOff } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.ADMIN_NEWS_ITEMS_PER_PAGE;

interface NewsPostsTableProps {
  posts: NewsPost[];
}

export function NewsPostsTable({ posts }: NewsPostsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort by created date, newest first
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate pagination
  const totalPages = Math.ceil(sortedPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg">
        <p className={`${DESIGN_TOKENS.typography.body.lg.size} text-muted-foreground mb-4`}>
          No news posts yet
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Pagination Info */}
      <div>
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={sortedPosts.length}
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
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
                      {post.author_id || "Unknown"}
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {paginatedPosts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {post.author_id || "Unknown"}
                  </span>
                </div>
              </div>
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
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                {post.published_at ? (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                ) : (
                  <span>Unpublished</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 px-2">
                  Edit
                </Button>
                {post.is_published ? (
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    Unpublish
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" className="h-8 px-2">
                    Publish
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 text-destructive hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
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
    </>
  );
}
