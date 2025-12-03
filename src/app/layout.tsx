import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://bandofbakers.co.uk"),
  title: {
    default: "Band of Bakers | Artisan Bakery in Shropshire",
    template: "%s | Band of Bakers",
  },
  description:
    "Award-winning artisan bakery in Shropshire. Fresh-baked sourdough bread, pastries, and baked goods. Visit our bake sales at Cressage Village Hall every Saturday.",
  keywords: [
    "artisan bakery",
    "sourdough bread",
    "Shropshire bakery",
    "fresh baked goods",
    "Cressage",
    "bake sale",
    "handmade bread",
    "local bakery",
  ],
  authors: [{ name: "Band of Bakers" }],
  creator: "Band of Bakers",
  publisher: "Band of Bakers",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "https://bandofbakers.co.uk/logo.ico",
    apple: "https://bandofbakers.co.uk/images/logos/bandofbakers-256.png",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://bandofbakers.co.uk",
    siteName: "Band of Bakers",
    title: "Band of Bakers | Artisan Bakery in Shropshire",
    description:
      "Award-winning artisan bakery in Shropshire. Fresh-baked sourdough bread, pastries, and baked goods.",
    images: [
      {
        url: "https://bandofbakers.co.uk/images/logos/bandofbakers-256.png",
        width: 1200,
        height: 630,
        alt: "Band of Bakers - Artisan Bakery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Band of Bakers | Artisan Bakery in Shropshire",
    description:
      "Award-winning artisan bakery in Shropshire. Fresh-baked sourdough bread, pastries, and baked goods.",
    images: ["https://bandofbakers.co.uk/images/logos/bandofbakers-256.png"],
    creator: "@bandofbakers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

import { CartProvider } from "@/context/cart-context";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import {
  LazyRollbarProvider,
  LazyLogflareProvider,
  LazyWebVitalsProvider,
} from "@/components/analytics/lazy-providers";
import { LazyMotionProvider } from "@/components/providers/lazy-motion-provider";

import { StructuredData } from "@/components/seo/structured-data";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;700&family=DM+Serif+Display&display=swap"
        />
        <link rel="preconnect" href="https://pub-e6068271bc7f407fa2c8d76686fe9cfe.r2.dev" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* PWA manifest removed (not in use) */}
        <StructuredData />
      </head>
      <body className={cn("min-h-screen antialiased font-sans bg-stone-50 relative")}>
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <SessionProvider>
          <CartProvider>
            <LazyMotionProvider>
              <LazyRollbarProvider />
              <LazyLogflareProvider />
              <LazyWebVitalsProvider />
              <Navbar />
              {children}
              <Footer />
              <Toaster position="top-center" />
            </LazyMotionProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
