import { auth } from "@/auth";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { CheckoutCollectionForm } from "./checkout-collection-form";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutCollectionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/checkout/collection");
  }
  const upcomingBakeSales = await getUpcomingBakeSales();

  return (
    <CheckoutCollectionForm upcomingBakeSales={upcomingBakeSales} currentUser={session?.user} />
  );
}
