import React from "react";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

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
    <div className="w-full">
      <div className="mx-auto mb-12 max-w-4xl text-center">
        <div className="space-y-2">
          <h3
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight} mb-4`}
            style={{ fontFamily: DESIGN_TOKENS.typography.h3.family }}
          >
            {title}
          </h3>
          {description ? (
            <p
              className={`${DESIGN_TOKENS.typography.body.lg.size} max-w-[900px] mx-auto`}
              style={{ color: DESIGN_TOKENS.colors.text.muted }}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
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
  );
}

export default FindUs;
