import { PageHeader } from "@/components/state/page-header";
import { mockProductsWithVariants } from "@/lib/mocks/products";
import { mockBakeSalesWithLocation } from "@/lib/mocks/bake-sales";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { ReviewSection } from "@/components/reviews/review-section";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = mockProductsWithVariants.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const upcomingBakeSales = mockBakeSalesWithLocation.filter((bs) => bs.is_active);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={product.name}
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Menu", href: "/menu" },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Product Details */}
          <ProductDetailForm product={product} upcomingBakeSales={upcomingBakeSales} />
        </div>

        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
