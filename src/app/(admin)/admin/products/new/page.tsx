import { getCategories } from "@/actions/categories";
import NewProductForm from "./product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  return <NewProductForm categories={categories} />;
}
