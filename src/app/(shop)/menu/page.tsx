import { Suspense } from "react";
import { getActiveProducts, getCategories } from "@/actions/products";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { MenuContent } from "./menu-content";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function MenuPage() {
  // Fetch data in parallel
  const [products, categories, upcomingBakeSales] = await Promise.all([
    getActiveProducts(),
    getCategories(),
    getUpcomingBakeSales(),
  ]);

  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <MenuContent
        initialProducts={products}
        categories={categories}
        upcomingBakeSales={upcomingBakeSales}
      />
    </Suspense>
  );
}
