import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllTestimonials } from "@/actions/testimonials";
import { TestimonialsTable } from "./testimonials-table";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage customer testimonials displayed on the homepage"
        actions={
          <Button asChild>
            <Link href="/admin/testimonials/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Link>
          </Button>
        }
      />

      <TestimonialsTable initialTestimonials={testimonials} />
    </div>
  );
}
