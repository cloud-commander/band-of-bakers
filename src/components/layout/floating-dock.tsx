"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, ShoppingCart, Package, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Menu", href: "/menu", icon: ShoppingBag },
  { name: "Orders", href: "/orders", icon: Package },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Profile", href: "/profile", icon: User },
];

export function FloatingDock() {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 backdrop-blur-xl border border-white/20 shadow-lg">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "p-3 rounded-full text-foreground/80 hover:text-foreground hover:bg-white/40 transition-colors",
                "flex items-center justify-center"
              )}
              title={item.name}
            >
              <item.icon className="w-5 h-5" strokeWidth={2} />
              <span className="sr-only">{item.name}</span>
            </motion.div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
