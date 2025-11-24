import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { FadeIn } from "@/components/fade-in";
import { Button } from "@/components/ui/button";
import { FindUs } from "@/components/find-us";
import { BUSINESS_INFO } from "@/lib/constants/frontend";
import {
  mockFeaturedBakes,
  HERO_SECTION,
  SIGNATURE_BAKES_SECTION,
  STORY_SECTION,
  CTA_SECTION,
  FOOTER,
} from "@/lib/mocks/homepage";

export default function Home() {
  const bakes = mockFeaturedBakes;

  return (
    <main style={{ backgroundColor: "var(--bg-warm)" }}>
      <Navbar />

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
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-white"
                style={{
                  fontFamily: "var(--font-dm-serif)",
                }}
              >
                {HERO_SECTION.heading}
              </h1>
              <p
                className="text-lg mb-8 leading-relaxed text-white"
                style={{
                  opacity: 0.95,
                }}
              >
                {HERO_SECTION.description}
              </p>
              <Button
                asChild
                className="rounded-full px-8 py-3 text-lg font-semibold text-white transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--accent)",
                }}
              >
                <a href={HERO_SECTION.ctaLink}>{HERO_SECTION.ctaText}</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Signature Bakes Bento Grid */}
      <section
        id="bakes"
        className="py-24 px-4"
        style={{
          backgroundColor: "var(--bg-warm)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2
              className="text-5xl md:text-6xl font-bold text-center mb-4"
              style={{
                fontFamily: "var(--font-dm-serif)",
                color: "var(--text-main)",
              }}
            >
              {SIGNATURE_BAKES_SECTION.heading}
            </h2>
            <p
              className="text-center text-lg mb-16"
              style={{
                color: "var(--text-main)",
                opacity: 0.75,
              }}
            >
              {SIGNATURE_BAKES_SECTION.subheading}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bakes.map((bake, index) => (
              <FadeIn key={bake.id} delay={index * 0.1}>
                <div
                  className="rounded-2xl overflow-hidden transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: "var(--card-bg)",
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
                  <div className="p-6">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{
                        fontFamily: "var(--font-dm-serif)",
                        color: "var(--text-main)",
                      }}
                    >
                      {bake.name}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        color: "var(--text-main)",
                        opacity: 0.7,
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
      <section
        id="story"
        className="py-24 px-4"
        style={{
          backgroundColor: "var(--bg-warm)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2
              className="text-5xl md:text-6xl font-bold mb-8"
              style={{
                fontFamily: "var(--font-dm-serif)",
                color: "var(--text-main)",
              }}
            >
              {STORY_SECTION.heading}
            </h2>
            <p
              className="text-xl leading-relaxed mb-8"
              style={{
                color: "var(--text-main)",
                opacity: 0.85,
              }}
            >
              {STORY_SECTION.mainText}
            </p>
            <p
              className="text-lg"
              style={{
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              {STORY_SECTION.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="order"
        className="py-24 px-4"
        style={{
          backgroundColor: "var(--card-bg)",
        }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                fontFamily: "var(--font-dm-serif)",
                color: "var(--text-main)",
              }}
            >
              {CTA_SECTION.heading}
            </h2>
            <p
              className="text-lg mb-8"
              style={{
                color: "var(--text-main)",
                opacity: 0.8,
              }}
            >
              {CTA_SECTION.description}
            </p>
            <Button
              asChild
              className="rounded-full px-8 py-3 text-lg font-semibold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--accent)",
              }}
            >
              <a href={CTA_SECTION.ctaLink}>{CTA_SECTION.ctaText}</a>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Find Us Section */}
      <FindUs
        title="Find Us"
        description="Visit our bakery in the heart of Cressage village. We're open daily, serving fresh bread and pastries to our community."
        address={BUSINESS_INFO.address.formatted}
        lat={BUSINESS_INFO.coordinates.latitude}
        lng={BUSINESS_INFO.coordinates.longitude}
        zoom={16}
      />

      {/* Footer */}
      <footer
        className="py-12 px-4 text-center border-t"
        style={{
          backgroundColor: "var(--bg-warm)",
          borderColor: "rgba(44, 40, 37, 0.1)",
          color: "var(--text-main)",
        }}
      >
        <p className="opacity-70">
          © {FOOTER.copyrightYear} {FOOTER.copyrightText}
        </p>
      </footer>
    </main>
  );
}
