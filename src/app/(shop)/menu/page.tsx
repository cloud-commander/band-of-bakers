import { PageHeader } from "@/components/state/page-header";
import { mockProducts, mockProductCategories } from "@/lib/mocks/products";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MenuPage() {
  const products = mockProducts.filter((p) => p.is_active);
  const categories = mockProductCategories;

  return (
    <div className={`min-h-screen ${DESIGN_TOKENS.sections.padding}`}>
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Our Menu"
          description="Freshly baked goods, available for collection or delivery"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Menu" }]}
        />

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button variant="default" size="sm">
            All Products
          </Button>
          {categories.map((category) => (
            <Button key={category.id} variant="outline" size="sm">
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${DESIGN_TOKENS.sections.gap}`}
        >
          {products.map((product) => (
            <Link key={product.id} href={`/menu/${product.slug}`} className="group">
              <div className={`${DESIGN_TOKENS.cards.base} border border-opacity-20`}>
                {/* Product Image */}
                <div className="relative aspect-square bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className={DESIGN_TOKENS.cards.padding}>
                  <h3
                    className={`${DESIGN_TOKENS.typography.h4.size} font-semibold mb-1 group-hover:text-primary transition-colors`}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`${DESIGN_TOKENS.typography.body.sm.size} text-muted-foreground line-clamp-2 mb-3`}
                  >
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">£{product.base_price.toFixed(2)}</span>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
