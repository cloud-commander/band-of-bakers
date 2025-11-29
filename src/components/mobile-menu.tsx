"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
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
  Shield,
} from "lucide-react";
import { ZERO_TIMEOUT_MS } from "@/lib/constants/app";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { BUSINESS_INFO } from "@/lib/constants/frontend";

interface MobileMenuProps {
  isLoggedIn: boolean;
  cartItemCount: number;
  session: Session | null;
}

export function MobileMenu({ isLoggedIn, cartItemCount, session }: MobileMenuProps) {
  const isAdmin = session?.user?.role && ["owner", "manager", "staff"].includes(session.user.role);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin Panel", icon: Shield }]
      : []),
  ];

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setIsOpen(true)}
        className="relative z-50 h-12 w-12 [&_svg]:size-7"
        aria-label="Open menu"
      >
        <Menu className="h-7 w-7" />
        {cartItemCount > 0 && !isOpen && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] text-white font-bold border border-white bg-orange-600">
            {cartItemCount}
          </Badge>
        )}
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Backdrop */}
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                  onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <m.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background border-l shadow-2xl z-[101] flex flex-col h-full"
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
                      className="[&_svg]:size-6"
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
                          onClick={() => setIsOpen(false)}
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
                        onClick={() => setIsOpen(false)}
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
                              onClick={() => setIsOpen(false)}
                            >
                              <item.icon className="h-5 w-5 text-muted-foreground" />
                              <span>{item.label}</span>
                            </Link>
                          ))}
                          {isAdmin && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-red-700 font-medium"
                              onClick={() => setIsOpen(false)}
                            >
                              <Shield className="h-5 w-5" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          <button
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-destructive transition-colors text-left"
                            onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Log Out</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Button asChild className="w-full justify-center" size="lg">
                            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                              Log In
                            </Link>
                          </Button>
                          <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                              href="/auth/signup"
                              className="underline hover:text-foreground"
                              onClick={() => setIsOpen(false)}
                            >
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
                </m.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
