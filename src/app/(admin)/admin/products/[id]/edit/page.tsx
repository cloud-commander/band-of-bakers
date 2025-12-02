import { getCategories } from "@/actions/categories";
import { getProductAvailabilityForBakeSales, getProductById } from "@/actions/products";
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

  const upcomingBakeSaleIds = upcomingBakeSales.map((bs) => bs.id);
  const availabilities = await getProductAvailabilityForBakeSales(id, upcomingBakeSaleIds);

  return (
    <EditProductForm
      productId={id}
      categories={categories}
      initialProduct={product}
      upcomingBakeSales={upcomingBakeSales}
      initialAvailabilities={availabilities}
    />
  );
}
