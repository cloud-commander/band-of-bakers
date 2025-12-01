import { newsRepository } from "@/lib/repositories/news.repository";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

interface NewsPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const runtime = "edge";

export async function generateMetadata({ params }: NewsPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await newsRepository.findBySlug(slug);

  if (!post) {
    return {
      title: "News Post Not Found",
    };
  }

  return {
    title: `${post.title} | Band of Bakers`,
    description: post.excerpt || post.title,
  };
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = await newsRepository.findBySlug(slug);

  if (!post || !post.is_published) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/news">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </Button>

      <article className="prose prose-stone lg:prose-lg mx-auto">
        <header className="mb-8 not-prose">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <time dateTime={post.published_at || post.created_at}>
              {new Date(post.published_at || post.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {post.category && (
              <>
                <span>•</span>
                <span className="font-medium text-bakery-amber-700">{post.category}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">
            {post.title}
          </h1>
          {post.excerpt && <p className="text-xl text-stone-600 leading-relaxed">{post.excerpt}</p>}
        </header>

        {post.image_url && (
          <div className="relative aspect-video w-full mb-8 rounded-xl overflow-hidden shadow-sm not-prose">
            <Image src={post.image_url} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        <div
          className="prose-headings:font-serif prose-headings:font-bold prose-a:text-bakery-amber-700 prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
