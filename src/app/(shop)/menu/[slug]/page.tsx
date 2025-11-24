import { PageHeader } from "@/components/state/page-header";
import { mockProductsWithVariants } from "@/lib/mocks/products";
import { mockBakeSales } from "@/lib/mocks/bake-sales";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const upcomingBakeSales = mockBakeSales.filter((bs) => bs.is_active);

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
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-3xl font-semibold text-primary">
                £{product.base_price.toFixed(2)}
              </p>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Select Size</label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base">
                      Standard - £{product.base_price.toFixed(2)}
                    </SelectItem>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} - £
                        {(product.base_price + variant.price_adjustment).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Bake Sale Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Collection Date</label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a bake sale date" />
                </SelectTrigger>
                <SelectContent>
                  {upcomingBakeSales.map((bakeSale) => (
                    <SelectItem key={bakeSale.id} value={bakeSale.id}>
                      {new Date(bakeSale.date).toLocaleDateString("en-GB", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {" - Order by "}
                      {new Date(bakeSale.cutoff_datetime).toLocaleDateString("en-GB")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Orders must be placed before the cutoff date
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <Select defaultValue="1">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Add to Cart */}
            <div className="pt-4">
              <Button size="lg" className="w-full md:w-auto px-12">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
