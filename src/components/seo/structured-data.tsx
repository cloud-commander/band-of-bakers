export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "@id": "https://bandofbakers.co.uk/#bakery",
    name: "Band of Bakers",
    description:
      "Artisan bakery in Shropshire specializing in fresh-baked bread, pastries, and baked goods",
    url: "https://bandofbakers.co.uk",
    logo: "https://bandofbakers.co.uk/images_logos/bandofbakers-256.png",
    image: "https://bandofbakers.co.uk/images_logos/bandofbakers-256.png",
    telephone: "+44-1234-567890",
    email: "hello@bandofbakers.co.uk",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cressage Village Hall",
      addressLocality: "Cressage",
      addressRegion: "Shropshire",
      postalCode: "SY5 6AF",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.6369,
      longitude: -2.6031,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
    priceRange: "££",
    servesCuisine: "Bakery",
    acceptsReservations: "False",
    paymentAccepted: "Cash, Credit Card, Debit Card",
    currenciesAccepted: "GBP",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 52.6369,
        longitude: -2.6031,
      },
      geoRadius: "50000",
    },
    sameAs: ["https://www.facebook.com/bandofbakers", "https://www.instagram.com/bandofbakers"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
