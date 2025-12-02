import { Suspense } from "react";
import { getActiveProducts, getCategories, getUnavailableProductsMap } from "@/actions/products";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { MenuContent } from "./menu-content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function MenuPage() {
  const upcomingBakeSales = await getUpcomingBakeSales();
  const upcomingBakeSaleIds = upcomingBakeSales.map((bs) => bs.id);

  // Fetch data in parallel
  const [products, categories, unavailableProductsMap] = await Promise.all([
    getActiveProducts(),
    getCategories(),
    getUnavailableProductsMap(upcomingBakeSaleIds),
  ]);

  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <MenuContent
        initialProducts={products}
        categories={categories}
        upcomingBakeSales={upcomingBakeSales}
        unavailableProductsMap={unavailableProductsMap}
      />
    </Suspense>
  );
}
