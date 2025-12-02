import { PageHeader } from "@/components/state/page-header";
import { getProductAvailabilityForBakeSales, getProductBySlug } from "@/actions/products";
import { getUpcomingBakeSales } from "@/actions/bake-sales";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailForm } from "@/components/product/product-detail-form";
import { ReviewSection } from "@/components/reviews/review-section";
import type { Metadata } from "next";
import { ProductSchema } from "@/components/seo/product-schema";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const runtime = "nodejs";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Band of Bakers",
      description: "The product you're looking for could not be found.",
    };
  }

  const price = product.base_price.toFixed(2);
  const description =
    product.description ||
    `Fresh ${product.name} from our artisan bakery. Starting from £${price}. Order now for collection at our next bake sale.`;

  return {
    title: `${product.name} | Band of Bakers`,
    description: description.slice(0, 160), // SEO best practice: 150-160 chars
    alternates: {
      canonical: `/menu/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Fetch data in parallel
  const [product, upcomingBakeSales] = await Promise.all([
    getProductBySlug(slug),
    getUpcomingBakeSales(),
  ]);

  if (!product) {
    notFound();
  }

  const availabilityMap =
    product && upcomingBakeSales.length
      ? await getProductAvailabilityForBakeSales(
          product.id,
          upcomingBakeSales.map((bs) => bs.id)
        )
      : {};
  const availableBakeSales = upcomingBakeSales.filter((bs) => availabilityMap[bs.id] !== false);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <ProductSchema product={product} />
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
          <ProductDetailForm product={product} upcomingBakeSales={availableBakeSales} />
        </div>

        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
