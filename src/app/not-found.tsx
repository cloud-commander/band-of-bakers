import Image from "next/image";
import Link from "next/link";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-warm-flour to-warm-flour/80">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072"
            alt="Freshly baked artisan bread"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-warm-flour/90 to-warm-flour/70" />
        </div>

        {/* 404 Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Large 404 Typography */}
          <div className="mb-8">
            <h1
              className={`${DESIGN_TOKENS.typography.h1.size} ${DESIGN_TOKENS.typography.h1.weight} ${DESIGN_TOKENS.typography.h1.lineHeight} mb-4`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.h1.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              404
            </h1>
            <div
              className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} ${DESIGN_TOKENS.typography.h3.lineHeight} mb-6`}
              style={{
                fontFamily: DESIGN_TOKENS.typography.h3.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              Page Not Found
            </div>
          </div>

          {/* Content Card */}
          <div
            className={`${DESIGN_TOKENS.cards.base} ${DESIGN_TOKENS.cards.padding} mb-8 max-w-2xl mx-auto`}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              borderColor: DESIGN_TOKENS.colors.border,
            }}
          >
            <div className="mb-6">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${DESIGN_TOKENS.colors.accent}20` }}
              >
                <div className="text-2xl" style={{ color: DESIGN_TOKENS.colors.accent }}>
                  🔍
                </div>
              </div>
              <h2
                className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-4`}
                style={{
                  fontFamily: DESIGN_TOKENS.typography.h4.family,
                  color: DESIGN_TOKENS.colors.text.main,
                }}
              >
                This page has risen like a good loaf...
              </h2>
              <p
                className={`${DESIGN_TOKENS.typography.body.lg.size} mb-4 leading-relaxed`}
                style={{ color: DESIGN_TOKENS.colors.text.muted }}
              >
                ...but unfortunately, it&apos;s not in our oven! The page you&apos;re looking for
                seems to have disappeared like fresh croissants on a Sunday morning.
              </p>
              <p
                className={`${DESIGN_TOKENS.typography.body.base.size} leading-relaxed`}
                style={{ color: DESIGN_TOKENS.colors.text.light }}
              >
                Don&apos;t worry though – we&apos;ve got plenty of fresh content waiting for you
                back in our bakery.
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-lg font-semibold text-white rounded-full transition-all hover:opacity-90 min-w-[140px]"
              style={{ backgroundColor: DESIGN_TOKENS.colors.accent }}
            >
              🏠 Back to Home
            </Link>

            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-base rounded-lg transition-colors min-w-[140px]"
              style={{
                borderColor: DESIGN_TOKENS.colors.border,
                color: DESIGN_TOKENS.colors.text.main,
                border: "1px solid",
              }}
            >
              🧁 Browse Menu
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="pt-8 border-t" style={{ borderColor: DESIGN_TOKENS.colors.border }}>
            <p
              className={`${DESIGN_TOKENS.typography.body.sm.size} mb-4`}
              style={{ color: DESIGN_TOKENS.colors.text.light }}
            >
              Or perhaps you&apos;d like to explore:
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: "/menu", label: "Our Fresh Bakes" },
                { href: "/about", label: "Our Story" },
                { href: "/news", label: "Latest News" },
                { href: "/faq", label: "Help & FAQ" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${DESIGN_TOKENS.typography.body.base.size} font-medium transition-opacity hover:opacity-70`}
                  style={{ color: DESIGN_TOKENS.colors.accent }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Space */}
      <div className="h-16 bg-warm-flour/50" />
    </div>
  );
}
