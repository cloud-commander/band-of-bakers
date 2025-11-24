import Image from "next/image";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { FindUs } from "@/components/find-us";
import { RecentNews } from "@/components/recent-news";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { InstagramFeed } from "@/components/instagram-feed";
import { SectionDivider } from "@/components/section-divider";
import { BUSINESS_INFO } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  mockFeaturedBakes,
  HERO_SECTION,
  SIGNATURE_BAKES_SECTION,
  STORY_SECTION,
  CTA_SECTION,
} from "@/lib/mocks/homepage";

export default function Home() {
  const bakes = mockFeaturedBakes.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden">
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
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <FadeIn>
            <div className="max-w-2xl">
              <h1
                className={`${DESIGN_TOKENS.typography.h1.size} ${DESIGN_TOKENS.typography.h1.weight} mb-6 ${DESIGN_TOKENS.typography.h1.lineHeight} text-white`}
                style={{
                  fontFamily: DESIGN_TOKENS.typography.h1.family,
                }}
              >
                {HERO_SECTION.heading}
              </h1>
              <p
                className={`${DESIGN_TOKENS.typography.body.lg.size} mb-8 ${DESIGN_TOKENS.typography.body.lg.lineHeight} text-white`}
                style={{
                  opacity: DESIGN_TOKENS.opacity.high,
                }}
              >
                {HERO_SECTION.description}
              </p>
              <Button
                asChild
                className={DESIGN_TOKENS.buttons.primary}
                style={{
                  backgroundColor: DESIGN_TOKENS.colors.accent,
                }}
              >
                <a href={HERO_SECTION.ctaLink}>{HERO_SECTION.ctaText}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Signature Bakes Bento Grid */}
      <SectionDivider variant="subtle" />
      <section
        id="bakes"
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.background,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2
              className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} text-center mb-4`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.h2.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              {SIGNATURE_BAKES_SECTION.heading}
            </h2>
            <p
              className={`text-center ${DESIGN_TOKENS.typography.body.lg.size} mb-16`}
              style={{
                color: DESIGN_TOKENS.colors.text.main,
                opacity: DESIGN_TOKENS.opacity.medium,
              }}
            >
              {SIGNATURE_BAKES_SECTION.subheading}
            </p>
          </FadeIn>

          <div className={`grid grid-cols-1 md:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
            {bakes.map((bake, index) => (
              <FadeIn key={bake.id} delay={index * 0.1}>
                <div
                  className={DESIGN_TOKENS.cards.base}
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
                    <Image src={bake.image} alt={bake.name} fill className="object-cover" />
                  </div>

                  {/* Text - 40% of card */}
                  <div className={DESIGN_TOKENS.cards.padding}>
                    <h3
                      className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-2`}
                      style={{
                        fontFamily: DESIGN_TOKENS.typography.h4.family,
                        color: DESIGN_TOKENS.colors.text.main,
                      }}
                    >
                      {bake.name}
                    </h3>
                    <p
                      className={DESIGN_TOKENS.typography.body.sm.size}
                      style={{
                        color: DESIGN_TOKENS.colors.text.main,
                        opacity: DESIGN_TOKENS.opacity.low,
                      }}
                    >
                      {bake.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <SectionDivider variant="subtle" />
      <section
        id="story"
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.background,
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2
              className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-8`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.h2.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              {STORY_SECTION.heading}
            </h2>
            <p
              className={`${DESIGN_TOKENS.typography.body.lg.size} ${DESIGN_TOKENS.typography.body.lg.lineHeight} mb-8`}
              style={{
                color: DESIGN_TOKENS.colors.text.main,
                opacity: DESIGN_TOKENS.opacity.high,
              }}
            >
              {STORY_SECTION.mainText}
            </p>
            <p
              className={`${DESIGN_TOKENS.typography.body.lg.size} font-semibold`}
              style={{
                color: DESIGN_TOKENS.colors.accent,
              }}
            >
              {STORY_SECTION.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <SectionDivider variant="subtle" />
      <section
        id="order"
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.card,
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2
              className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-6`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.h3.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              {CTA_SECTION.heading}
            </h2>
            <p
              className={`${DESIGN_TOKENS.typography.body.lg.size} mb-8`}
              style={{
                color: DESIGN_TOKENS.colors.text.main,
                opacity: DESIGN_TOKENS.opacity.medium,
              }}
            >
              {CTA_SECTION.description}
            </p>
            <Button
              asChild
              className={DESIGN_TOKENS.buttons.primary}
              style={{
                backgroundColor: DESIGN_TOKENS.colors.accent,
              }}
            >
              <a href={CTA_SECTION.ctaLink}>{CTA_SECTION.ctaText}</a>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Customer Testimonials */}
      <SectionDivider variant="subtle" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{
          backgroundColor: DESIGN_TOKENS.colors.background,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <h2
                className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-4`}
                style={{
                  fontFamily: DESIGN_TOKENS.typography.h2.family,
                  color: DESIGN_TOKENS.colors.text.main,
                }}
              >
                What Our Customers Say
              </h2>
              <p
                className={`${DESIGN_TOKENS.typography.body.lg.size} max-w-2xl mx-auto`}
                style={{
                  color: DESIGN_TOKENS.colors.text.muted,
                }}
              >
                Don&apos;t just take our word for it - hear from our happy customers
              </p>
            </div>
            <TestimonialsCarousel />
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

      {/* Find Us Section */}
      <SectionDivider variant="subtle" />
      <FindUs
        title="Find Us"
        description="Visit our bakery in the heart of Cressage village. We're open daily, serving fresh bread and pastries to our community."
        address={BUSINESS_INFO.address.formatted}
        lat={BUSINESS_INFO.coordinates.latitude}
        lng={BUSINESS_INFO.coordinates.longitude}
        zoom={16}
      />
    </>
  );
}
