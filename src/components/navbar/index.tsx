"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/context/cart-context";
import { MobileMenu } from "@/components/mobile-menu";
import { CartPreview } from "@/components/cart-preview";
import { NavbarLogo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const { cartCount } = useCart();
  const { data: session } = useSession();

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300 border-b shadow-md bg-white"
      style={{
        backgroundColor: "rgb(255, 255, 255)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(44, 40, 37, 0.2)",
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
            <UserMenu isLoggedIn={!!session?.user} />
          </div>

          {/* Mobile Menu */}
          <MobileMenu isLoggedIn={!!session?.user} cartItemCount={cartCount} session={session} />
        </div>
      </div>
    </nav>
  );
}
