import React from "react";

type FindUsProps = {
  address?: string;
  lat?: number;
  lng?: number;
  title?: string;
  description?: string;
  zoom?: number; // Google maps zoom level
  className?: string;
};

export function FindUs({
  address,
  lat,
  lng,
  title = "Find Us",
  description,
  zoom = 15,
  className = "w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden border",
}: FindUsProps) {
  // Build the maps query: prefer coordinates if both provided, otherwise URL-encode the address
  const src = React.useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      return `https://maps.google.com/maps?q=${encodeURIComponent(
        `${lat},${lng}`
      )}&z=${zoom}&output=embed`;
    }

    if (address) {
      const encoded = encodeURIComponent(address);
      return `https://maps.google.com/maps?q=${encoded}&z=${zoom}&output=embed`;
    }

    // default to a blank map centered at 0,0
    return `https://maps.google.com/maps?q=0,0&z=${zoom}&output=embed`;
  }, [address, lat, lng, zoom]);

  const iframeTitle = title ? `Google Map - ${title}` : "Google Map";

  return (
    <section className="bg-card py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl sm:text-5xl">{title}</h1>
            {description ? (
              <p className="text-muted-foreground max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl">
          <div className="flex justify-center">
            <div className={"w-full max-w-6xl " + className}>
              <iframe
                src={src}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title={iframeTitle}
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FindUs;
