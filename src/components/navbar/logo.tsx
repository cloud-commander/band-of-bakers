import Link from "next/link";
import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export function NavbarLogo() {
  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        className="flex items-center gap-2 sm:gap-3 hover:bg-red-50 hover:text-red-700 px-2 sm:px-3 py-2 rounded-md transition-colors"
      >
        <Image
          src="/images/logos/logo-transparent-256.png"
          alt="Band of Bakers Logo"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
        <span
          className="text-lg sm:text-xl font-bold"
          style={{
            fontFamily: DESIGN_TOKENS.typography.h4.family,
            color: DESIGN_TOKENS.colors.text.main,
          }}
        >
          {BUSINESS_INFO.shortName}
        </span>
      </Link>
    </div>
  );
}
