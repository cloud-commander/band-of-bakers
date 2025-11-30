import { notFound } from "next/navigation";
import { getTestimonialById } from "@/actions/testimonials";
import { EditTestimonialForm } from "./edit-testimonial-form";

interface EditTestimonialPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const testimonial = await getTestimonialById(params.id);

  if (!testimonial) {
    notFound();
  }

  return <EditTestimonialForm testimonial={testimonial} />;
}
