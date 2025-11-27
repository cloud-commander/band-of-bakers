import Link from "next/link";
import Image from "next/image";
import { BUSINESS_INFO } from "@/lib/constants/frontend";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

export function NavbarLogo() {
  return (
    <div className="flex-shrink-0">
      <Link
        href="/"
        className="flex items-center gap-3 hover:bg-red-50 hover:text-red-700 px-3 py-2 rounded-md transition-colors"
      >
        <Image
          src="/images_logos/bandofbakers-256.png"
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
  );
}
