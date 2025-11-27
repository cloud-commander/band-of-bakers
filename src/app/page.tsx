import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentNews } from "@/components/recent-news";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { InstagramFeed } from "@/components/instagram-feed";
import { SectionDivider } from "@/components/section-divider";
import { Heading } from "@/components/ui/heading";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  HERO_SECTION,
  SIGNATURE_BAKES_SECTION,
  STORY_SECTION,
  CTA_SECTION,
} from "@/constants/homepage";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import { mockProductCategories } from "@/lib/mocks/products";
import { getActiveTestimonials } from "@/actions/testimonials";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categories = mockProductCategories;
  const testimonials = await getActiveTestimonials();

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
                className="bg-bakery-amber-700 hover:bg-bakery-amber-800 text-white font-sans"
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
            {categories.map((category, index) => (
              <FadeIn key={category.id} delay={index * 0.1}>
                <Link href={`/menu?category=${category.slug}`}>
                  <div
                    className={`${DESIGN_TOKENS.cards.base} cursor-pointer hover:shadow-lg transition-shadow`}
                    style={{
                      backgroundColor: DESIGN_TOKENS.colors.card,
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {/* Image - 60% of card */}
                    <div
                      className="relative w-full"
                      style={{
                        paddingBottom: "60%",
                      }}
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Text - 40% of card */}
                    <div className={DESIGN_TOKENS.cards.padding}>
                      <h3
                        className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-2 text-center`}
                        style={{
                          fontFamily: DESIGN_TOKENS.typography.h4.family,
                          color: DESIGN_TOKENS.colors.text.main,
                        }}
                      >
                        {category.name}
                      </h3>
                      <p
                        className={`${DESIGN_TOKENS.typography.body.sm.size} text-center`}
                        style={{
                          color: DESIGN_TOKENS.colors.text.main,
                          opacity: DESIGN_TOKENS.opacity.low,
                        }}
                      >
                        {category.description}
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
            {/* Upcoming Bake Sales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {mockBakeSalesWithLocation.slice(0, 3).map((bakeSale, index) => (
                <FadeIn key={bakeSale.id} delay={index * 0.1}>
                  <Link href={`/menu?bakeSale=${bakeSale.id}`}>
                    <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {bakeSale.location.name}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </FadeIn>
              ))}
            </div>
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
            <TestimonialsCarousel testimonials={testimonials} />
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
        <RecentNews />
      </section>

      {/* Instagram Feed */}
      <SectionDivider variant="subtle" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.background,
        }}
      >
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <InstagramFeed />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
