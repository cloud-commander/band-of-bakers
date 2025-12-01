import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { SectionDivider } from "@/components/section-divider";
import { Heading } from "@/components/ui/heading";
import { RecentNews } from "@/components/recent-news";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { MESSAGES } from "@/lib/constants/frontend";
import {
  HERO_SECTION,
  SIGNATURE_BAKES_SECTION,
  STORY_SECTION,
  CTA_SECTION,
} from "@/constants/homepage";
import { getActiveTestimonials } from "@/actions/testimonials";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { getRecentNewsPosts } from "@/actions/news";
import { getRandomProducts } from "@/actions/products";
import { getInstagramSettings } from "@/actions/instagram";
import nextDynamic from "next/dynamic";
import { BakeSaleCarousel } from "@/components/bake-sale-carousel";

export const dynamic = "force-dynamic";
export const runtime = "edge";

const LazyTestimonialsCarousel = nextDynamic(
  () => import("@/components/testimonials-carousel").then((mod) => mod.TestimonialsCarousel),
  { loading: () => <div className="h-48" /> }
);
const LazyInstagramFeed = nextDynamic(
  () => import("@/components/instagram-feed").then((mod) => mod.InstagramFeed),
  { loading: () => <div className="h-32" /> }
);

export default async function Home() {
  const [featuredProducts, testimonials, upcomingBakeSales, recentNews, instagramSettings] =
    await Promise.all([
      getRandomProducts(3),
      getActiveTestimonials(),
      getUpcomingBakeSales(),
      getRecentNewsPosts(3),
      getInstagramSettings(),
    ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-start overflow-hidden pt-32">
        {/* Full-width background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={HERO_SECTION.backgroundImage}
            alt={HERO_SECTION.backgroundAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
            }}
          />
        </div>

        {/* Text content overlaid on image */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <FadeIn>
            <div className="max-w-2xl backdrop-blur-sm bg-black/40 p-8 rounded-lg border border-white/20">
              <Heading level={1} className="text-white mb-6">
                {HERO_SECTION.heading}
              </Heading>
              <p className="text-lg md:text-xl text-stone-100 mb-8 font-sans leading-relaxed opacity-90">
                {HERO_SECTION.description}
              </p>
              <Button
                asChild
                className="bg-bakery-amber-700 hover:bg-bakery-amber-800 text-white font-sans transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
              >
                <a href={HERO_SECTION.ctaLink}>{HERO_SECTION.ctaText}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Signature Bakes Bento Grid */}
      <SectionDivider variant="subtle" />
      <section id="bakes" className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <Heading level={2}>{SIGNATURE_BAKES_SECTION.heading}</Heading>
              <p className="text-stone-600 text-lg font-sans max-w-2xl mx-auto">
                {SIGNATURE_BAKES_SECTION.subheading}
              </p>
            </div>
          </FadeIn>

          <div className={`grid grid-cols-1 md:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
            {featuredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.1}>
                <Link href={`/menu?product=${product.slug}`}>
                  <div
                    className={`${DESIGN_TOKENS.cards.base} cursor-pointer hover:shadow-lg transition-shadow overflow-hidden`}
                    style={{
                      backgroundColor: DESIGN_TOKENS.colors.card,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {/* Product image */}
                    {product.image_url && (
                      <div className="relative w-full h-48">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className={DESIGN_TOKENS.cards.padding}>
                      <h3
                        className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-2 text-center`}
                        style={{
                          fontFamily: DESIGN_TOKENS.typography.h4.family,
                          color: DESIGN_TOKENS.colors.text.main,
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className={`${DESIGN_TOKENS.typography.body.sm.size} text-center`}
                        style={{
                          color: DESIGN_TOKENS.colors.text.main,
                          opacity: DESIGN_TOKENS.opacity.low,
                        }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <SectionDivider variant="subtle" />
      <section id="story" className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-3xl mx-auto text-center px-4">
          <FadeIn>
            <Heading level={2} className="mb-10">
              {STORY_SECTION.heading}
            </Heading>
            <p className="text-lg md:text-xl text-stone-600 font-sans leading-relaxed mb-8">
              {STORY_SECTION.mainText}
            </p>
            <p className="text-xl font-medium text-bakery-amber-700 font-serif italic">
              {STORY_SECTION.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <SectionDivider variant="subtle" />
      <section id="order" className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto text-center px-4">
          <FadeIn>
            <Heading level={2} className="mb-8">
              {CTA_SECTION.heading}
            </Heading>
            {/* Upcoming Bake Sales or Bakers Away Message */}
            {upcomingBakeSales.length > 0 ? (
              <div className="mb-8">
                <BakeSaleCarousel bakeSales={upcomingBakeSales} maxVisible={3} />
                <div className="mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/menu">View Menu</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <FadeIn>
                <div className="flex flex-col items-center justify-center text-center mb-12">
                  <div className="relative w-64 h-64 mb-6 rounded-full overflow-hidden border-4 border-bakery-amber-100 shadow-lg">
                    <Image
                      src="/images/bakers-away.png"
                      alt="Bakers Away"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xl md:text-2xl font-serif text-bakery-amber-800 max-w-lg mx-auto leading-relaxed">
                    {MESSAGES.BAKERS_AWAY}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">Notify Me</Link>
                </Button>
              </FadeIn>
            )}
            <p
              className={`${DESIGN_TOKENS.typography.body.lg.size} mb-8`}
              style={{
                color: DESIGN_TOKENS.colors.text.main,
                opacity: DESIGN_TOKENS.opacity.medium,
              }}
            >
              Reserve your fresh loaves today. Available for collection.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Customer Testimonials */}
      <SectionDivider variant="subtle" />
      <section className="py-16 md:py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <Heading level={2} className="mb-4">
                What Our Customers Say
              </Heading>
              <p className="text-stone-600 font-sans max-w-2xl mx-auto">
                Don&apos;t just take our word for it - hear from our happy customers
              </p>
            </div>
            <LazyTestimonialsCarousel testimonials={testimonials} />
          </FadeIn>
        </div>
      </section>

      {/* Recent News */}
      <SectionDivider variant="subtle" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.background,
        }}
      >
        <RecentNews posts={recentNews} />
      </section>

      {/* Instagram Feed */}
      {instagramSettings.enabled && instagramSettings.embed && (
        <>
          <SectionDivider variant="subtle" />
          <section
            className={DESIGN_TOKENS.sections.padding}
            style={{
              backgroundColor: DESIGN_TOKENS.colors.background,
            }}
          >
            <div className="max-w-7xl mx-auto">
              <FadeIn>
                <LazyInstagramFeed embedHtml={instagramSettings.embed} />
              </FadeIn>
            </div>
          </section>
        </>
      )}
    </>
  );
}
