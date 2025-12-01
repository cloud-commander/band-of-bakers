import { getPublicFaqs } from "@/actions/faqs";
import { FAQ_CATEGORIES, FAQS } from "@/constants/faq";
import { FaqContent } from "./faq-content";
import { addCacheControl } from "@/lib/edge-cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function FAQPage() {
  const result = await getPublicFaqs();
  const faqs = result.success && result.data.length > 0 ? result.data : FAQS;

  return <FaqContent faqs={faqs} categories={FAQ_CATEGORIES} />;
}
