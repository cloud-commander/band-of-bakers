"use client";

/**
 * Footer Component
 *
 * Reusable footer used across the site.
 * Uses design system as the source of truth.
 *
 * Features:
 * - Company information with branding
 * - Social media links (Instagram, Facebook, Twitter)
 * - Quick links (Shop, My Account, Contact Us)
 * - Legal links (Privacy Policy, Terms of Service, Cookies)
 * - Copyright information with design credit
 */

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { STORE, PAYMENT_METHOD_LOGOS, SOCIAL_MEDIA_LOGOS } from "@/lib/constants";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { Heading } from "@/components/ui/heading";

export function Footer() {
  return (
    <footer className={`bg-card border-t border-opacity-20 py-16`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/Bandofbakers-logo-removebg-preview.png"
              alt="Band of Bakers Logo"
              width={120}
              height={120}
              className="object-contain"
            />
          </div>

          {/* Address */}
          <div className="text-center">
            <Heading level={4} className="mb-4">
              Address
            </Heading>
            <ul className="space-y-2">
              <li className="text-stone-600 font-sans text-sm">Station Road</li>
              <li className="text-stone-600 font-sans text-sm">Cressage</li>
              <li className="text-stone-600 font-sans text-sm">SY5 6AD</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <Heading level={4} className="mb-4">
              Quick Links
            </Heading>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  My Account
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center">
            <Heading level={4} className="mb-4">
              Legal
            </Heading>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-stone-600 hover:text-bakery-amber-700 transition-colors font-sans text-sm"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center">
            <Heading level={4} className="mb-4">
              Social Media
            </Heading>
            {STORE.social.enabled && (
              <div className="flex gap-3 justify-center">
                {STORE.social.instagram && (
                  <a
                    href={STORE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-bakery-amber-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {STORE.social.facebook && (
                  <a
                    href={STORE.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-bakery-amber-700 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {STORE.social.twitter && (
                  <a
                    href={STORE.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-bakery-amber-700 transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {STORE.social.mixcloud && (
                  <a
                    href={STORE.social.mixcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-bakery-amber-700 transition-colors"
                    aria-label="Mixcloud"
                  >
                    <Image
                      src={SOCIAL_MEDIA_LOGOS.MIXCLOUD}
                      alt="Mixcloud"
                      width={20}
                      height={20}
                      unoptimized
                      className="transition-opacity hover:opacity-75"
                      title="Mixcloud"
                    />
                  </a>
                )}
                {STORE.social.soundcloud && (
                  <a
                    href={STORE.social.soundcloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 hover:text-bakery-amber-700 transition-colors"
                    aria-label="Soundcloud"
                  >
                    <Image
                      src={SOCIAL_MEDIA_LOGOS.SOUNDCLOUD}
                      alt="Soundcloud"
                      width={20}
                      height={20}
                      unoptimized
                      className="transition-opacity hover:opacity-75"
                      title="Soundcloud"
                    />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="text-center">
            <Heading level={4} className="mb-4">
              We Accept
            </Heading>
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <Image
                src={PAYMENT_METHOD_LOGOS.VISA}
                alt="Visa"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="Visa"
              />
              <Image
                src={PAYMENT_METHOD_LOGOS.MASTERCARD}
                alt="Mastercard"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="Mastercard"
              />
              <Image
                src={PAYMENT_METHOD_LOGOS.PAYPAL}
                alt="PayPal"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="PayPal"
              />
              <Image
                src={PAYMENT_METHOD_LOGOS.APPLE_PAY}
                alt="Apple Pay"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="Apple Pay"
              />
              <Image
                src={PAYMENT_METHOD_LOGOS.GOOGLE_PAY}
                alt="Google Pay"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="Google Pay"
              />
              <Image
                src="/sterling.svg"
                alt="Cash (GBP)"
                width={24}
                height={24}
                unoptimized
                className="transition-opacity hover:opacity-75"
                title="Cash (GBP)"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`text-muted-foreground border-t border-opacity-20 pt-8 text-center ${DESIGN_TOKENS.typography.body.sm.size}`}
        >
          <p>
            © {new Date().getFullYear()} {STORE.name}. All rights reserved.
            {STORE.designCredit && (
              <>
                {" "}
                <span className="text-muted-foreground">•</span>{" "}
                <span className="text-muted-foreground">Design By</span>{" "}
                <a
                  href={STORE.designCredit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  {STORE.designCredit.name}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
