import type { Metadata } from "next";
import { DM_Serif_Display, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-dm-serif",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bandofbakers.co.uk"),
  title: {
    default: "Band of Bakers",
    template: "%s | Band of Bakers",
  },
  description: "Fresh-baked goodness every day - Artisan bread and bakes from Shropshire",
  icons: {
    icon: "/logo.ico",
  },
  openGraph: {
    title: "Band of Bakers",
    description: "Fresh-baked goodness every day - Artisan bread and bakes from Shropshire",
    images: ["/Bandofbakers-logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Band of Bakers",
    description: "Fresh-baked goodness every day - Artisan bread and bakes from Shropshire",
    images: ["/Bandofbakers-logo.png"],
  },
};

import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body
        className={cn(
          "min-h-screen antialiased font-sans bg-stone-50 relative",
          dmSerifDisplay.variable
        )}
      >
        <div
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster position="top-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
