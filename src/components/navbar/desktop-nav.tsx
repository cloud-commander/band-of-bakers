 "use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Info, Newspaper, HelpCircle, UserCircle } from "lucide-react";
import { FlourIcon } from "@/components/ui/flour-icon";
import type { Session } from "next-auth";

interface DesktopNavProps {
  session: Session | null;
}

const links = [
  { href: "/", label: "Home", icon: Home, variant: "default" },
  { href: "/menu", label: "Shop", icon: ShoppingBag, variant: "wheat" },
  { href: "/about", label: "About", icon: Info, variant: "award" },
  { href: "/news", label: "News", icon: Newspaper, variant: "time" },
  { href: "/faq", label: "FAQ", icon: HelpCircle, variant: "default" },
];

export const DesktopNav = memo(function DesktopNav({ session }: DesktopNavProps) {
  const pathname = usePathname();
  const isAdmin = session?.user?.role && ["owner", "manager", "staff"].includes(session.user.role);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div className="hidden lg:flex items-center gap-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`group font-sans text-sm font-medium transition-all duration-150 ease-out px-2 py-1 rounded-md hover:text-bakery-amber-700 hover:bg-bakery-amber-50 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-bakery-amber-400 focus-visible:outline-offset-2 ${
            isActive(link.href) ? "text-bakery-amber-800 bg-bakery-amber-50" : ""
          }`}
        >
          <span className="flex items-center gap-2">
            <FlourIcon
              icon={link.icon}
              size="sm"
              variant={link.variant as never}
              className="group-hover:scale-110 transition-transform"
            />
            {link.label}
          </span>
          <span
            className={`block h-0.5 ${
              isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
            } bg-bakery-amber-600 transition-all duration-200 rounded-full`}
          />
        </Link>
      ))}

      {isAdmin && (
        <Link
          href="/admin"
          className={`group font-sans text-sm font-semibold px-2 py-1 rounded-md flex items-center gap-2 text-red-700 hover:bg-red-50 transition-all duration-150 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-300 focus-visible:outline-offset-2 ${
            pathname?.startsWith("/admin") ? "bg-red-50" : ""
          }`}
        >
          <FlourIcon
            icon={UserCircle}
            size="sm"
            variant="award"
            className="group-hover:scale-110 transition-transform"
          />
          Admin
          <span className="ml-1 rounded-full bg-red-100 text-red-700 text-[11px] px-2 py-0.5">
            Staff
          </span>
        </Link>
      )}
    </div>
  );
});
