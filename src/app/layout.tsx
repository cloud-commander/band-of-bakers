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
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Band of Bakers",
  description: "Fresh-baked goodness every day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen antialiased",
          dmSerifDisplay.variable,
          playfairDisplay.variable,
          inter.variable
        )}
        style={{
          fontFamily: "var(--font-geist-sans)",
          backgroundColor: "var(--bg-warm)",
        }}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
