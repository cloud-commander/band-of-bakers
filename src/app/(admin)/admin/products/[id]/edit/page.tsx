import { getCategories } from "@/actions/categories";
import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import EditProductForm from "./edit-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([getCategories(), getProductById(id)]);

  if (!product) {
    notFound();
  }

  return <EditProductForm productId={id} categories={categories} initialProduct={product} />;
}
