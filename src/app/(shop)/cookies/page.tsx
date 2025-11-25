import { COOKIES_POLICY } from "@/lib/mocks/legal";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { SectionDivider } from "@/components/section-divider";

export const metadata = {
  title: "Cookies Policy | Band of Bakers",
  description: "Cookies Policy for Band of Bakers - Information about cookies and your privacy",
};

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <SectionDivider variant="subtle" />
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <h1
            className={`${DESIGN_TOKENS.typography.h1.size} ${DESIGN_TOKENS.typography.h1.weight} mb-4`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h1.family }}
          >
            {COOKIES_POLICY.title}
          </h1>
          <p
            className={`${DESIGN_TOKENS.typography.body.base.size}`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            Last updated: {COOKIES_POLICY.lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        className={DESIGN_TOKENS.sections.padding}
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          {COOKIES_POLICY.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h2
                className={`${DESIGN_TOKENS.typography.h2.size} ${DESIGN_TOKENS.typography.h2.weight} mb-4`}
                style={{ fontFamily: DESIGN_TOKENS.typography.h2.family }}
              >
                {section.heading}
              </h2>
              <div
                className={`${DESIGN_TOKENS.typography.body.base.size} leading-relaxed whitespace-pre-wrap`}
                style={{ color: DESIGN_TOKENS.colors.text.muted }}
              >
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
