"use client";

import { PageHeader } from "@/components/state/page-header";
import {
  mockFAQs,
  mockFAQsByCategory,
  FAQ_CATEGORIES,
  FAQ_PAGE_HEADER,
  FAQ_CTA_SECTION,
} from "@/lib/mocks/faq";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const displayFAQs =
    activeCategory === "all"
      ? mockFAQs
      : mockFAQsByCategory[activeCategory as keyof typeof mockFAQsByCategory];

  return (
    <div className="min-h-screen">
      <div className={`max-w-4xl mx-auto ${DESIGN_TOKENS.sections.padding}`}>
        <PageHeader title={FAQ_PAGE_HEADER.title} description={FAQ_PAGE_HEADER.description} />

        {/* Category Filter */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            {FAQ_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                <span className="hidden sm:inline">{cat.icon} </span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            <Accordion type="single" collapsible className="w-full">
              {displayFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger
                    className={`text-left ${DESIGN_TOKENS.typography.body.base.size} font-semibold`}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className={`${DESIGN_TOKENS.typography.body.base.size} leading-relaxed`}
                      style={{ color: DESIGN_TOKENS.colors.text.muted }}
                    >
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Contact CTA */}
        <div
          className={`mt-12 p-8 rounded-lg text-center`}
          style={{
            backgroundColor: DESIGN_TOKENS.colors.card,
            border: `1px solid ${DESIGN_TOKENS.colors.border}`,
          }}
        >
          <h3
            className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight} mb-2`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h4.family }}
          >
            {FAQ_CTA_SECTION.heading}
          </h3>
          <p
            className={`${DESIGN_TOKENS.typography.body.base.size} mb-4`}
            style={{ color: DESIGN_TOKENS.colors.text.muted }}
          >
            {FAQ_CTA_SECTION.description}
          </p>
          <a
            href={`mailto:${FAQ_CTA_SECTION.ctaEmail}`}
            className="inline-block px-6 py-2 rounded-full font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: DESIGN_TOKENS.colors.accent }}
          >
            {FAQ_CTA_SECTION.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
