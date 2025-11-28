import { getCategories } from "@/actions/categories";
import EditProductForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const categories = await getCategories();
  const { id } = await params;

  return <EditProductForm productId={id} categories={categories} />;
}
