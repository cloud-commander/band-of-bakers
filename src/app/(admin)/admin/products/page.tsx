import { PageHeader } from "@/components/state/page-header";
import {
  mockProductsWithVariants,
  mockProductCategories,
} from "@/lib/mocks/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const products = mockProductsWithVariants;
  const categories = mockProductCategories;

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

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const category = categories.find(
                (c) => c.id === product.category_id
              );
              return (
                <tr key={product.id} className="border-t hover:bg-muted/30">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-sm">{category?.name}</td>
                  <td className="p-4 font-medium">
                    £{product.base_price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
