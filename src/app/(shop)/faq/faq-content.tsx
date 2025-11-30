"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/state/page-header";
import {
  FAQ_CATEGORIES,
  FAQ_CTA_SECTION,
  FAQ_PAGE_HEADER,
  type FAQCategory,
} from "@/constants/faq";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  sort_order?: number | null;
};

interface FaqContentProps {
  faqs: FAQItem[];
  categories?: FAQCategory[];
}

export function FaqContent({ faqs, categories = FAQ_CATEGORIES }: FaqContentProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Normalise categories and sort order so UI always works
  const normalizedFaqs = useMemo(() => {
    return [...faqs].map((faq) => ({
      ...faq,
      category: faq.category || "general",
      sort_order: typeof faq.sort_order === "number" ? faq.sort_order : 0,
    }));
  }, [faqs]);

  const combinedCategories: FAQCategory[] = useMemo(() => {
    const known = new Map(categories.map((c) => [c.id, c]));
    for (const faq of normalizedFaqs) {
      if (faq.category && !known.has(faq.category)) {
        known.set(faq.category, {
          id: faq.category,
          label: faq.category.charAt(0).toUpperCase() + faq.category.slice(1),
          icon: "❓",
        });
      }
    }
    return Array.from(known.values());
  }, [categories, normalizedFaqs]);

  const displayFAQs =
    activeCategory === "all"
      ? normalizedFaqs
      : normalizedFaqs.filter((faq) => faq.category === activeCategory);

  return (
    <div className="min-h-screen">
      <div className={`max-w-4xl mx-auto ${DESIGN_TOKENS.sections.padding}`}>
        <PageHeader title={FAQ_PAGE_HEADER.title} description={FAQ_PAGE_HEADER.description} />

        {/* Category Filter */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-8 h-auto bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="w-full text-center data-[state=active]:bg-muted data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border"
            >
              All
            </TabsTrigger>
            {combinedCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="w-full text-center data-[state=active]:bg-muted data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border"
              >
                <span className="hidden sm:inline">{cat.icon} </span>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-4">
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
          className="mt-12 p-8 rounded-lg text-center"
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
