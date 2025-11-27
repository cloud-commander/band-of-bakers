import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionDivider } from "@/components/section-divider";
import { FindUs } from "@/components/find-us";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { BUSINESS_INFO } from "@/lib/constants";
import Link from "next/link";
import {
  ABOUT_HERO_SECTION,
  ABOUT_STORY_SECTION,
  ABOUT_TEAM_SECTION,
  ABOUT_VALUES_SECTION,
  ABOUT_HOW_WE_WORK_SECTION,
} from "@/constants/about";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={ABOUT_HERO_SECTION.backgroundImage}
            alt={ABOUT_HERO_SECTION.backgroundAlt}
            fill
            className="object-cover object-top"
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
            {ABOUT_HERO_SECTION.heading}
          </h1>
          <p
            className={`${DESIGN_TOKENS.typography.body.lg.size} ${DESIGN_TOKENS.typography.body.lg.lineHeight} max-w-2xl mx-auto`}
            style={{ opacity: DESIGN_TOKENS.opacity.high }}
          >
            {ABOUT_HERO_SECTION.description}
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
              {ABOUT_STORY_SECTION.heading}
            </h2>
            <div className="prose prose-lg max-w-none">
              {ABOUT_STORY_SECTION.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`${DESIGN_TOKENS.typography.body.lg.size} mb-4 leading-relaxed`}
                >
                  {paragraph}
                </p>
              ))}
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
          <h2
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-8 text-center`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h3.family }}
          >
            {ABOUT_TEAM_SECTION.heading}
          </h2>
          <div className={`grid md:grid-cols-2 ${DESIGN_TOKENS.sections.gap}`}>
            {ABOUT_TEAM_SECTION.members.map((member) => (
              <div
                key={member.id}
                className={`${DESIGN_TOKENS.cards.base} overflow-hidden group`}
                style={{
                  backgroundColor: DESIGN_TOKENS.colors.card,
                  border: `1px solid ${DESIGN_TOKENS.colors.border}`,
                }}
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className={DESIGN_TOKENS.cards.padding}>
                  <h3
                    className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-1`}
                    style={{ fontFamily: DESIGN_TOKENS.typography.h4.family }}
                  >
                    {member.name}
                  </h3>
                  <p
                    className={`${DESIGN_TOKENS.typography.body.sm.size} mb-3 uppercase tracking-wider`}
                    style={{ color: DESIGN_TOKENS.colors.accent }}
                  >
                    {member.role}
                  </p>
                  <p
                    className={`${DESIGN_TOKENS.typography.body.base.size} mb-4 leading-relaxed`}
                    style={{ color: DESIGN_TOKENS.colors.text.muted }}
                  >
                    {member.bio}
                  </p>
                  <p
                    className={DESIGN_TOKENS.typography.body.base.size}
                    style={{ color: DESIGN_TOKENS.colors.text.muted }}
                  >
                    <span className="font-medium text-foreground">Favorite Bake:</span>{" "}
                    {member.favorite}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Stand For */}
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
              {ABOUT_VALUES_SECTION.heading}
            </h2>
            <div className={`grid md:grid-cols-3 ${DESIGN_TOKENS.sections.gap}`}>
              {ABOUT_VALUES_SECTION.values.map((value) => (
                <div
                  key={value.id}
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
              {ABOUT_HOW_WE_WORK_SECTION.heading}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className={`${DESIGN_TOKENS.typography.body.base.size} mb-4 leading-relaxed`}>
                {ABOUT_HOW_WE_WORK_SECTION.introText}
              </p>
              <ol className="space-y-3 ml-6">
                {ABOUT_HOW_WE_WORK_SECTION.steps.map((step) => (
                  <li key={step.id} className={DESIGN_TOKENS.typography.body.base.size}>
                    <strong>{step.title}</strong> {step.description}
                  </li>
                ))}
              </ol>
              <p
                className={`${DESIGN_TOKENS.typography.body.base.size} mt-6 leading-relaxed`}
                style={{ color: DESIGN_TOKENS.colors.text.muted }}
              >
                {ABOUT_HOW_WE_WORK_SECTION.closingText}
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
    </div>
  );
}
