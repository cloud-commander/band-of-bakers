"use server";

import { PageHeader } from "@/components/state/page-header";
import { getPaginatedProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { Suspense } from "react";
import { AdminProductsTable } from "./products-table";
import { CategoriesManagement } from "./categories-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const pageSize = Number(params?.pageSize) || 20;

  const [{ data, total, page: currentPage, pageSize: limit }, categories] = await Promise.all([
    getPaginatedProducts(page, pageSize),
    getCategories(),
  ]);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        }
      />

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Suspense fallback={<div>Loading products...</div>}>
            <AdminProductsTable
              initialProducts={data}
              totalCount={total}
              currentPage={currentPage}
              pageSize={limit}
              categories={categories}
            />
          </Suspense>
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
