"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  User,
  LogOut,
  Package,
  UserCircle,
  Home,
  ShoppingBag,
  Info,
  Newspaper,
  HelpCircle,
  LogIn,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UI_THRESHOLDS, BUSINESS_INFO } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useCart } from "@/context/cart-context";

import { MobileMenu } from "@/components/mobile-menu";
import { CartPreview } from "@/components/cart-preview";
import { SearchBar } from "@/components/search-bar";
import { FlourIcon } from "@/components/ui/flour-icon";
import { Suspense } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();

  // Mock user state - in Phase 4, this will come from auth context
  const isLoggedIn = false; // Change to true to see logged-in state

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
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors"
            >
              <Image
                src="/Bandofbakers-logo-removebg-preview.png"
                alt="Band of Bakers Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <span
                className="text-xl font-bold"
                style={{
                  fontFamily: DESIGN_TOKENS.typography.h4.family,
                  color: DESIGN_TOKENS.colors.text.main,
                }}
              >
                {BUSINESS_INFO.shortName}
              </span>
            </Link>
          </div>

          {/* Center: Main Navigation (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group"
            >
              <FlourIcon
                icon={Home}
                size="sm"
                variant="default"
                className="group-hover:scale-110 transition-transform"
              />
              Home
            </Link>
            <Link
              href="/menu"
              className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group"
            >
              <FlourIcon
                icon={ShoppingBag}
                size="sm"
                variant="wheat"
                className="group-hover:scale-110 transition-transform"
              />
              Shop
            </Link>
            <Link
              href="/about"
              className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group"
            >
              <FlourIcon
                icon={Info}
                size="sm"
                variant="award"
                className="group-hover:scale-110 transition-transform"
              />
              About
            </Link>
            <Link
              href="/news"
              className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group"
            >
              <FlourIcon
                icon={Newspaper}
                size="sm"
                variant="time"
                className="group-hover:scale-110 transition-transform"
              />
              News
            </Link>
            <Link
              href="/faq"
              className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group"
            >
              <FlourIcon
                icon={HelpCircle}
                size="sm"
                variant="default"
                className="group-hover:scale-110 transition-transform"
              />
              FAQ
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center justify-end">
            <div className="w-80">
              <Suspense
                fallback={<div className="w-full h-10 bg-gray-200 rounded animate-pulse" />}
              >
                <SearchBar />
              </Suspense>
            </div>
          </div>

          {/* Right: Cart + User Menu (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart Preview Dropdown */}
            <CartPreview />

            {/* User Menu / Login */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
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
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-sm font-medium flex items-center gap-2 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu isLoggedIn={isLoggedIn} cartItemCount={cartCount} />
        </div>
      </div>
    </nav>
  );
}
