import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Band of Bakers",
  description: "Artisan baked goods, delivered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --bg-warm: #F9F8F6;
            --text-main: #2C2825;
            --accent: #A65D57;
            --card-bg: #FFFFFF;
          }
          
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
              repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.03) 0px,
                rgba(0, 0, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(0, 0, 0, 0.03) 0px,
                rgba(0, 0, 0, 0.03) 1px,
                transparent 1px,
                transparent 2px
              );
            pointer-events: none;
            z-index: -1;
            opacity: 0.03;
          }
        `}</style>
      </head>
      <body
        className={cn(
          "min-h-screen antialiased",
          dmSerifDisplay.variable,
          inter.variable
        )}
        style={{
          backgroundColor: "var(--bg-warm)",
          color: "var(--text-main)",
          fontFamily: "var(--font-geist-sans)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
