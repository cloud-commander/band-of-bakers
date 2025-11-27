import { PageHeader } from "@/components/state/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllTestimonials } from "@/actions/testimonials";
import { TestimonialsTable } from "./testimonials-table";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage customer testimonials displayed on the homepage"
        actions={
          <Link href="/admin/testimonials/new">
            <Button className="bg-bakery-amber-600 hover:bg-bakery-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </Link>
        }
      />

      <TestimonialsTable initialTestimonials={testimonials} />
    </div>
  );
}
