import { memo } from "react";
import Link from "next/link";
import { Home, ShoppingBag, Info, Newspaper, HelpCircle, UserCircle, Mail } from "lucide-react";
import { FlourIcon } from "@/components/ui/flour-icon";
import type { Session } from "next-auth";

interface DesktopNavProps {
  session: Session | null;
}

export const DesktopNav = memo(function DesktopNav({ session }: DesktopNavProps) {
  const isAdmin = session?.user?.role && ["owner", "manager", "staff"].includes(session.user.role);

  return (
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

      {/* Admin Link */}
      {isAdmin && (
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group text-red-700"
          >
            <FlourIcon
              icon={UserCircle}
              size="sm"
              variant="award"
              className="group-hover:scale-110 transition-transform"
            />
            Admin
          </Link>
          <Link
            href="/admin/settings/email-templates"
            className="font-sans text-sm font-medium transition-colors hover:text-bakery-amber-700 flex items-center gap-2 group text-red-700"
          >
            <FlourIcon
              icon={Mail}
              size="sm"
              variant="default"
              className="group-hover:scale-110 transition-transform"
            />
            Email Templates
          </Link>
        </div>
      )}
    </div>
  );
});
