"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionDivider } from "@/components/section-divider";
import { FindUs } from "@/components/find-us";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { BUSINESS_INFO } from "@/lib/constants";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072"
            alt="Artisan baker kneading dough"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1
            className={`${DESIGN_TOKENS.typography.h1.size} ${DESIGN_TOKENS.typography.h1.weight} ${DESIGN_TOKENS.typography.h1.lineHeight} mb-6`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h1.family }}
          >
            Our Story
          </h1>
          <p
            className={`${DESIGN_TOKENS.typography.body.lg.size} ${DESIGN_TOKENS.typography.body.lg.lineHeight} max-w-2xl mx-auto`}
            style={{ opacity: DESIGN_TOKENS.opacity.high }}
          >
            A family tradition of artisan baking, passed down through generations and baked with
            love in the heart of Shropshire.
          </p>
        </div>
      </section>

      {/* Story Content */}
      <SectionDivider variant="subtle" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div>
            <h2
              className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-6 text-center`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h2.family }}
            >
              Baking with Passion Since Day One
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className={`${DESIGN_TOKENS.typography.body.lg.size} mb-4 leading-relaxed`}>
                Band of Bakers started as a dream in our home kitchen—a vision to bring authentic,
                handcrafted bread to our local community. What began with a single sourdough starter
                has grown into a beloved bakery that serves fresh, artisan baked goods throughout
                Shropshire.
              </p>
              <p className={`${DESIGN_TOKENS.typography.body.lg.size} mb-4 leading-relaxed`}>
                We believe in the simple pleasures of real bread: the aroma of a fresh loaf, the
                satisfying crunch of a perfectly baked crust, and the soft, airy crumb that comes
                from time, patience, and traditional techniques. Every product we make is a labor of
                love, crafted by hand using the finest local ingredients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <SectionDivider variant="medium" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <div>
            <h2
              className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-8 text-center`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h3.family }}
            >
              What We Stand For
            </h2>
            <div className={`grid md:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
              {[
                {
                  title: "Traditional Methods",
                  description:
                    "We use time-honored baking techniques, including long fermentation and natural starters, to create bread with superior flavor and texture.",
                },
                {
                  title: "Local Ingredients",
                  description:
                    "We source our flour, dairy, and produce from trusted local suppliers, supporting our community and ensuring the freshest ingredients.",
                },
                {
                  title: "Made to Order",
                  description:
                    "Every bake sale features fresh batches made specifically for your order, ensuring you receive our products at their absolute best.",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className={`${DESIGN_TOKENS.cards.base} ${DESIGN_TOKENS.cards.padding} text-center`}
                  style={{
                    backgroundColor: DESIGN_TOKENS.colors.card,
                    border: `1px solid ${DESIGN_TOKENS.colors.border}`,
                  }}
                >
                  <h3
                    className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-3`}
                    style={{ fontFamily: DESIGN_TOKENS.typography.h4.family }}
                  >
                    {value.title}
                  </h3>
                  <p
                    className={DESIGN_TOKENS.typography.body.base.size}
                    style={{ color: DESIGN_TOKENS.colors.text.muted }}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <SectionDivider variant="medium" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <div>
            <h2
              className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-8 text-center`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h3.family }}
            >
              How Our Bake Sales Work
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className={`${DESIGN_TOKENS.typography.body.base.size} mb-4 leading-relaxed`}>
                We operate through a unique bake sale model that allows us to guarantee freshness
                and reduce waste. Here&apos;s how it works:
              </p>
              <ol className="space-y-3 ml-6">
                <li className={DESIGN_TOKENS.typography.body.base.size}>
                  <strong>Browse our menu</strong> and select your favorite baked goods
                </li>
                <li className={DESIGN_TOKENS.typography.body.base.size}>
                  <strong>Choose a bake sale date</strong> that works for you
                </li>
                <li className={DESIGN_TOKENS.typography.body.base.size}>
                  <strong>Place your order</strong> before the cutoff date (typically 2 days before)
                </li>
                <li className={DESIGN_TOKENS.typography.body.base.size}>
                  <strong>We bake fresh</strong> based on confirmed orders
                </li>
                <li className={DESIGN_TOKENS.typography.body.base.size}>
                  <strong>Collect or receive delivery</strong> on your chosen bake sale day
                </li>
              </ol>
              <p
                className={`${DESIGN_TOKENS.typography.body.base.size} mt-6 leading-relaxed`}
                style={{ color: DESIGN_TOKENS.colors.text.muted }}
              >
                This approach means every loaf, pastry, and cake is made specifically for you,
                ensuring maximum freshness and allowing us to minimize waste while supporting
                sustainable practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <SectionDivider variant="medium" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <FindUs
            title="Find Us in Shropshire"
            description="We serve the communities of Cressage and Shrewsbury, and Telford through our regular bake sales. Follow us on social media to stay updated on our schedule and special offerings."
            address={BUSINESS_INFO.address.formatted}
            lat={BUSINESS_INFO.coordinates.latitude}
            lng={BUSINESS_INFO.coordinates.longitude}
            zoom={17}
            className="w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden border"
          />
        </div>
      </section>

      {/* CTA Section */}
      <SectionDivider variant="strong" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.card }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-4`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h3.family }}
          >
            Ready to Try Our Bakes?
          </h2>
          <p
            className={`${DESIGN_TOKENS.typography.body.lg.size} mb-8`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Browse our menu and place your order for the next bake sale.
          </p>
          <Button
            asChild
            size="lg"
            className={DESIGN_TOKENS.buttons.primary}
            style={{ backgroundColor: DESIGN_TOKENS.colors.accent }}
          >
            <Link href="/menu">View Our Menu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
