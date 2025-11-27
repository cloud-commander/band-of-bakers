import { Suspense } from "react";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { CartContent } from "./cart-content";
import { PageHeader } from "@/components/state/page-header";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const upcomingBakeSales = await getUpcomingBakeSales();

  return (
    <Suspense
      fallback={
        <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Shopping Cart"
              breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
            />
            <div className="py-12 text-center">Loading cart...</div>
          </div>
        </div>
      }
    >
      <CartContent upcomingBakeSales={upcomingBakeSales} />
    </Suspense>
  );
}
