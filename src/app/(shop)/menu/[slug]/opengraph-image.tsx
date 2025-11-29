import { ImageResponse } from "next/og";
import { productRepository } from "@/lib/repositories/product.repository";

export const runtime = "edge";

export const alt = "Band of Bakers Product";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await productRepository.findBySlug(slug);

  // Fonts
  const dmSerif = await fetch(
    new URL("/fonts/dmserifdisplay.ttf", "https://bandofbakers.co.uk")
  ).then((res) => res.arrayBuffer());

  const inter = await fetch(new URL("/fonts/inter.ttf", "https://bandofbakers.co.uk")).then((res) =>
    res.arrayBuffer()
  );

  if (!product) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: "#fafaf9", // stone-50
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"DM Serif Display"',
          color: "#1c1917", // stone-900
        }}
      >
        Band of Bakers
      </div>,
      {
        ...size,
        fonts: [
          {
            name: "DM Serif Display",
            data: dmSerif,
            style: "normal",
          },
        ],
      }
    );
  }

  return new ImageResponse(
    <div
      style={{
        background: "#fafaf9", // stone-50
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "48px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: product.image_url ? "50%" : "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontFamily: '"Inter"',
            color: "#d97706", // amber-600
            marginBottom: 16,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Band of Bakers
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: '"DM Serif Display"',
            color: "#1c1917", // stone-900
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: '"Inter"',
            color: "#57534e", // stone-600
          }}
        >
          £{product.base_price.toFixed(2)}
        </div>
      </div>

      {product.image_url && (
        <div
          style={{
            display: "flex",
            width: "45%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 24,
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          />
        </div>
      )}
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "DM Serif Display",
          data: dmSerif,
          style: "normal",
        },
        {
          name: "Inter",
          data: inter,
          style: "normal",
        },
      ],
    }
  );
}
