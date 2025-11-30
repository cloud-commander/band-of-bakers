import { PageHeader } from "@/components/state/page-header";
import { getFaqs } from "@/actions/faqs";
import { FaqsTable } from "./faqs-table";

export default async function AdminFaqsPage() {
  const result = await getFaqs();
  const faqs = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions displayed on the website."
      />
      <FaqsTable initialFaqs={faqs} />
    </div>
  );
}
