import { PageHeader } from "@/components/state/page-header";
import { mockNewsPosts } from "@/lib/mocks/news";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";

export default function NewsPage() {
  // Sort by published date, newest first
  const publishedNews = mockNewsPosts
    .filter((post) => post.is_published)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime());

  return (
    <div className="min-h-screen">
      <div className={`max-w-7xl mx-auto ${DESIGN_TOKENS.sections.padding}`}>
        <PageHeader
          title="News & Updates"
          description="Stay up to date with the latest from Band of Bakers"
        />

        <div className={`grid md:grid-cols-2 lg:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
          {publishedNews.map((post) => (
            <article
              key={post.id}
              className={`${DESIGN_TOKENS.cards.base} overflow-hidden group`}
              style={{
                backgroundColor: DESIGN_TOKENS.colors.card,
                border: `1px solid ${DESIGN_TOKENS.colors.border}`,
              }}
            >
              {/* Featured Image */}
              {post.featured_image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={post.featured_image}
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
                    <span>{post.author}</span>
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

        {publishedNews.length === 0 && (
          <div className="text-center py-16">
            <p className={`${DESIGN_TOKENS.typography.body.lg.size} text-muted-foreground`}>
              No news articles published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
