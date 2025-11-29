import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserReviews } from "@/actions/reviews";
import { getUserTestimonials } from "@/actions/testimonials";
import { ProfileClient } from "./profile-client";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/profile");
  }

  const [reviews, testimonials] = await Promise.all([
    getUserReviews(session.user.id),
    getUserTestimonials(session.user.id),
  ]);

  return <ProfileClient initialReviews={reviews} initialTestimonials={testimonials} />;
}
