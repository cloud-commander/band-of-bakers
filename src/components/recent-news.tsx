import { DESIGN_TOKENS } from "@/lib/design-tokens";
import type { NewsPost } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentNewsProps {
  posts: NewsPost[];
}

export function RecentNews({ posts }: RecentNewsProps) {
  const recentPosts = posts;

  if (recentPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-4`}
            style={{
              fontFamily: DESIGN_TOKENS.typography.h2.family,
              color: DESIGN_TOKENS.colors.text.main,
            }}
          >
            Latest News
          </h2>
          <p
            className={`${DESIGN_TOKENS.typography.body.lg.size} mx-auto max-w-2xl`}
            style={{
              color: DESIGN_TOKENS.colors.text.muted,
            }}
          >
            Stay updated with our latest stories, new products, and baking news
          </p>
        </div>

        {/* News Grid */}
        <div className={`grid md:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
          {recentPosts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/news/${post.slug}`}>
                <div
                  className={`${DESIGN_TOKENS.cards.base} overflow-hidden h-full`}
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
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className={DESIGN_TOKENS.cards.padding}>
                    <h3
                      className={`${DESIGN_TOKENS.typography.h5.size} ${DESIGN_TOKENS.typography.h5.weight} mb-2 group-hover:text-primary transition-colors`}
                      style={{ fontFamily: DESIGN_TOKENS.typography.h5.family }}
                    >
                      {post.title}
                    </h3>

                    <p
                      className={`${DESIGN_TOKENS.typography.body.sm.size} mb-4 line-clamp-2`}
                      style={{ color: DESIGN_TOKENS.colors.text.muted }}
                    >
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <time className={DESIGN_TOKENS.typography.body.sm.size}>
                        {new Date(post.published_at!).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/news" className="flex items-center gap-2">
              View All News
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
