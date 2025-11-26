"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";
import { UI_THRESHOLDS } from "@/lib/constants/frontend";
import { useScrollNavbar } from "@/hooks/use-scroll-navbar";
import { MobileMenu } from "@/components/mobile-menu";
import { CartPreview } from "@/components/cart-preview";
import { NavbarLogo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const isScrolled = useScrollNavbar({ threshold: UI_THRESHOLDS.SCROLL_NAVBAR });
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300 border-b"
      style={{
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(249, 248, 246, 0.8)",
        backdropFilter: isScrolled ? "blur(12px)" : "blur(8px)",
        borderColor: "rgba(44, 40, 37, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <NavbarLogo />

          {/* Center: Main Navigation (Desktop) */}
          <DesktopNav session={session} />

          {/* Right: Cart + User Menu (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Preview Dropdown */}
            <CartPreview />

            {/* User Menu / Login */}
            <UserMenu isLoggedIn={isLoggedIn} />
          </div>

          {/* Mobile Menu */}
          <MobileMenu isLoggedIn={isLoggedIn} cartItemCount={cartCount} />
        </div>
      </div>
    </nav>
  );
}
