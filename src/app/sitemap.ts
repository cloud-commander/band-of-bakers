import { MetadataRoute } from "next";
import { getProducts } from "@/actions/products";
import { getBakeSales } from "@/actions/bake-sales";
import type { Product, ProductVariant } from "@/db/schema";
import type { BakeSaleWithLocation } from "@/lib/repositories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bandofbakers.com";

  // Static routes
  const routes = ["", "/about", "/contact", "/faq", "/checkout", "/checkout/collection"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    })
  );

  // Dynamic routes: Products
  const products = await getProducts();
  const productRoutes = products.map((product: Product & { variants: ProductVariant[] }) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic routes: Bake Sales
  const bakeSalesData = await getBakeSales();
  const allBakeSales = [...bakeSalesData.upcoming, ...bakeSalesData.archived];
  const bakeSaleRoutes = allBakeSales.map((sale: BakeSaleWithLocation) => ({
    url: `${baseUrl}/bake-sales/${sale.id}`, // Assuming you have a detail page for bake sales
    lastModified: new Date(sale.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...routes, ...productRoutes, ...bakeSaleRoutes];
}
