"use client";

import { useState } from "react";
import type { NewsPost } from "@/db/schema";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { PAGINATION_CONFIG } from "@/lib/constants/pagination";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { Pagination, PaginationInfo } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = PAGINATION_CONFIG.NEWS_ITEMS_PER_PAGE;

interface NewsGridProps {
  posts: NewsPost[];
}

export function NewsGrid({ posts }: NewsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNews = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className={`${DESIGN_TOKENS.typography.body.lg.size} text-muted-foreground`}>
          No news articles published yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Pagination Info */}
      <div className="mb-6">
        <PaginationInfo
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalItems={posts.length}
        />
      </div>

      <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
        {paginatedNews.map((post) => (
          <article
            key={post.id}
            className={`${DESIGN_TOKENS.cards.base} overflow-hidden group`}
            style={{
              backgroundColor: DESIGN_TOKENS.colors.card,
              border: `1px solid ${DESIGN_TOKENS.colors.border}`,
            }}
          >
            {/* Featured Image */}
            {post.image_url && (
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={post.image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}

            {/* Content */}
            <div className={DESIGN_TOKENS.cards.padding}>
              <h2
                className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-3 group-hover:text-primary transition-colors`}
                style={{ fontFamily: DESIGN_TOKENS.typography.h4.family }}
              >
                {post.title}
              </h2>

              <p
                className={`${DESIGN_TOKENS.typography.body.sm.size} mb-4 line-clamp-3`}
                style={{ color: DESIGN_TOKENS.colors.text.muted }}
              >
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className={`flex items-center gap-4 ${DESIGN_TOKENS.typography.body.sm.size}`}>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time>
                    {new Date(post.published_at!).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{post.author_id || "Unknown"}</span>
                </div>
              </div>

              {/* Read More Link */}
              <Link
                href={`/news/${post.slug}`}
                className="inline-block mt-4 text-sm font-medium hover:underline"
                style={{ color: DESIGN_TOKENS.colors.accent }}
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-6">
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
