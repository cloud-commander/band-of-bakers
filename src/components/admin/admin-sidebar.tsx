"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Calendar,
  Users,
  Newspaper,
  Settings,
  Menu,
  X,
  Ticket,
  Star,
  MessageSquareQuote,
  Image,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Bake Sales", href: "/admin/bake-sales", icon: Calendar },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Vouchers", href: "/admin/vouchers", icon: Ticket },
  { name: "News", href: "/admin/news", icon: Newspaper },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { name: "Instagram", href: "/admin/settings/instagram", icon: Instagram },
  { name: "Email Templates", href: "/admin/settings/email-templates", icon: Settings },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-card shadow-lg"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-64 bg-card border-r min-h-screen p-6 border-opacity-20 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static",
          "fixed inset-y-0 left-0 z-40",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-8">
          <h2
            className={`${DESIGN_TOKENS.typography.h4.size} ${DESIGN_TOKENS.typography.h4.weight}`}
          >
            Admin Panel
          </h2>
          <p className={`${DESIGN_TOKENS.typography.body.sm.size} text-muted-foreground`}>
            Band of Bakers
          </p>
        </div>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`,
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
