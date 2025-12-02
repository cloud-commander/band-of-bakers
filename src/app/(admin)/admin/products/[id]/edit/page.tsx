import { getCategories } from "@/actions/categories";
import { getProductAvailabilityForBakeSale, getProductById } from "@/actions/products";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import { notFound } from "next/navigation";
import EditProductForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product, upcomingBakeSales] = await Promise.all([
    getCategories(),
    getProductById(id),
    getUpcomingBakeSales(),
  ]);

  if (!product) {
    notFound();
  }

  const latestBakeSale = upcomingBakeSales.at(-1) ?? null;
  const latestAvailability = latestBakeSale
    ? await getProductAvailabilityForBakeSale(id, latestBakeSale.id)
    : true;

  return (
    <EditProductForm
      productId={id}
      categories={categories}
      initialProduct={product}
      latestBakeSale={latestBakeSale}
      initialAvailability={latestAvailability}
    />
  );
}
