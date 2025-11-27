import { auth } from "@/auth";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { CheckoutCollectionForm } from "./checkout-collection-form";

export const dynamic = "force-dynamic";

export default async function CheckoutCollectionPage() {
  const session = await auth();
  const upcomingBakeSales = await getUpcomingBakeSales();

  return (
    <CheckoutCollectionForm upcomingBakeSales={upcomingBakeSales} currentUser={session?.user} />
  );
}
