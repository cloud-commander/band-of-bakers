"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  Package,
  UserCircle,
  ChevronRight,
  Home,
  ShoppingBag,
  Info,
  Newspaper,
  HelpCircle,
} from "lucide-react";
import { ZERO_TIMEOUT_MS } from "@/lib/constants/app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { BUSINESS_INFO } from "@/lib/constants/frontend";

interface MobileMenuProps {
  isLoggedIn: boolean;
  cartItemCount: number;
}

export function MobileMenu({ isLoggedIn, cartItemCount }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), ZERO_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const menuItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/menu", label: "Shop", icon: ShoppingBag },
    { href: "/about", label: "About", icon: Info },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  const userItems = [
    { href: "/profile", label: "Profile", icon: UserCircle },
    { href: "/orders", label: "My Orders", icon: Package },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative z-50"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
        {cartItemCount > 0 && !isOpen && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-[10px] text-white font-bold border border-white bg-orange-600">
            {cartItemCount}
          </Badge>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background border-l shadow-2xl z-50 flex flex-col h-full"
              style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: DESIGN_TOKENS.typography.h4.family }}
                >
                  Menu
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                {/* Main Navigation */}
                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        pathname === item.href ? "bg-muted font-medium" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg">{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </nav>

                {/* Cart Link */}
                <div className="border-t pt-6">
                  <Link
                    href="/cart"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-muted p-2 rounded-full">
                        <ShoppingCart className="h-5 w-5" />
                      </div>
                      <span className="font-medium">Shopping Cart</span>
                    </div>
                    {cartItemCount > 0 && (
                      <Badge className="text-white font-bold bg-orange-600">
                        {cartItemCount} items
                      </Badge>
                    )}
                  </Link>
                </div>

                {/* User Section */}
                <div className="border-t pt-6">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <p className="px-3 text-sm font-medium text-muted-foreground mb-2">
                        My Account
                      </p>
                      {userItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-destructive transition-colors text-left">
                        <LogOut className="h-5 w-5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button asChild className="w-full justify-center" size="lg">
                        <Link href="/auth/login">Log In</Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/register" className="underline hover:text-foreground">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-muted/20">
                <p className="text-xs text-center text-muted-foreground">
                  {BUSINESS_INFO.phone}
                  <br />
                  {BUSINESS_INFO.email}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
