import { getCategories } from "@/actions/categories";
import NewProductForm from "./product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();

  return <NewProductForm categories={categories} />;
}
