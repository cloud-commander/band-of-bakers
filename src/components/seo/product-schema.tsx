import { Product, ProductVariant } from "@/lib/repositories";

interface ProductSchemaProps {
  product: Product & { variants?: ProductVariant[] };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bandofbakers.co.uk";
  const productUrl = `${baseUrl}/menu/${product.slug}`;
  const imageUrl = product.image_url || `${baseUrl}/images/logos/bandofbakers-256.png`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: imageUrl,
    sku: product.id,
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: "Band of Bakers",
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GBP",
      price: product.base_price.toFixed(2),
      availability:
        product.stock_quantity === 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menu",
        item: `${baseUrl}/menu`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
