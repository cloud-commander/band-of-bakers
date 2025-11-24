"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UI_THRESHOLDS } from "@/lib/constants/frontend";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > UI_THRESHOLDS.SCROLL_NAVBAR);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.8)" : "rgba(249, 248, 246, 0)",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-dm-serif)",
                color: "var(--text-main)",
              }}
            >
              Band of Bakers
            </Link>
          </div>

          {/* Center: Links */}
          <div className="hidden md:flex gap-6">
            <Link
              href="/menu"
              className="text-sm font-medium transition-colors hover:text-opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              Menu
            </Link>
            <Link
              href="/orders"
              className="text-sm font-medium transition-colors hover:text-opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              Orders
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium transition-colors hover:text-opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              Profile
            </Link>
            <Link
              href="/admin"
              className="text-sm font-medium transition-colors hover:text-opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              Admin
            </Link>
            <Link
              href="#story"
              className="text-sm font-medium transition-colors hover:text-opacity-70"
              style={{ color: "var(--text-main)" }}
            >
              Story
            </Link>
          </div>

          {/* Right side: Auth & Cart */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="text-sm font-medium transition-colors hover:text-opacity-70 hidden sm:block"
              style={{ color: "var(--text-main)" }}
            >
              Cart
            </Link>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              asChild
              className="rounded-full px-6 py-2 font-semibold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: "var(--accent)",
              }}
            >
              <Link href="/menu">Order Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
