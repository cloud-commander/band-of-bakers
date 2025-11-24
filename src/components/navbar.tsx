"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ShoppingCart, User, LogOut, Package, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UI_THRESHOLDS, BUSINESS_INFO } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Mock user state - in Phase 4, this will come from auth context
  const isLoggedIn = false; // Change to true to see logged-in state
  const cartItemCount = 0; // Mock cart count

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > UI_THRESHOLDS.SCROLL_NAVBAR);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-80 transition-opacity"
              style={{
                fontFamily: DESIGN_TOKENS.typography.h4.family,
                color: DESIGN_TOKENS.colors.text.main,
              }}
            >
              {BUSINESS_INFO.logo} {BUSINESS_INFO.shortName}
            </Link>
          </div>

          {/* Center: Main Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/menu"
              className={`${DESIGN_TOKENS.typography.nav.size} ${DESIGN_TOKENS.typography.nav.weight} transition-opacity hover:opacity-70`}
              style={{ color: DESIGN_TOKENS.colors.text.main }}
            >
              Shop
            </Link>
            <Link
              href="/about"
              className={`${DESIGN_TOKENS.typography.nav.size} ${DESIGN_TOKENS.typography.nav.weight} transition-opacity hover:opacity-70`}
              style={{ color: DESIGN_TOKENS.colors.text.main }}
            >
              About
            </Link>
            <Link
              href="/news"
              className={`${DESIGN_TOKENS.typography.nav.size} ${DESIGN_TOKENS.typography.nav.weight} transition-opacity hover:opacity-70`}
              style={{ color: DESIGN_TOKENS.colors.text.main }}
            >
              News
            </Link>
            <Link
              href="/faq"
              className={`${DESIGN_TOKENS.typography.nav.size} ${DESIGN_TOKENS.typography.nav.weight} transition-opacity hover:opacity-70`}
              style={{ color: DESIGN_TOKENS.colors.text.main }}
            >
              FAQ
            </Link>
          </div>

          {/* Right: Cart + User Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:opacity-70 transition-opacity">
              <ShoppingCart className="h-6 w-6" style={{ color: DESIGN_TOKENS.colors.text.main }} />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  style={{ backgroundColor: DESIGN_TOKENS.colors.accent }}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {/* User Menu / Login */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
