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

export function Footer() {
  return (
    <footer className={`bg-card border-t border-opacity-20 py-16`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Branding Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/Bandofbakers-logo-removebg-preview.png"
                alt="Band of Bakers Logo"
                width={30}
                height={30}
                className="object-contain"
              />
              <h3
                className={`text-foreground ${DESIGN_TOKENS.typography.h5.size} ${DESIGN_TOKENS.typography.h5.weight}`}
                style={{ fontFamily: DESIGN_TOKENS.typography.h5.family }}
              >
                {STORE.shortName}
              </h3>
            </div>
            <p
              className={`text-muted-foreground mb-4 ${DESIGN_TOKENS.typography.body.sm.size} whitespace-pre-line`}
            >
              {STORE.address.formatted}
            </p>
            {STORE.social.enabled && (
              <div className="flex gap-3">
                {STORE.social.instagram && (
                  <a
                    href={STORE.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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
                    className="text-muted-foreground hover:text-primary transition-colors"
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

          {/* Quick Links */}
          <div>
            <h4
              className={`text-foreground mb-4 ${DESIGN_TOKENS.typography.h5.size} ${DESIGN_TOKENS.typography.h5.weight}`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h5.family }}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/menu"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  My Account
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className={`text-foreground mb-4 ${DESIGN_TOKENS.typography.h5.size} ${DESIGN_TOKENS.typography.h5.weight}`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h5.family }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`text-muted-foreground hover:text-foreground transition-colors ${DESIGN_TOKENS.typography.body.sm.size}`}
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4
              className={`text-foreground mb-4 ${DESIGN_TOKENS.typography.h5.size} ${DESIGN_TOKENS.typography.h5.weight}`}
              style={{ fontFamily: DESIGN_TOKENS.typography.h5.family }}
            >
              We Accept
            </h4>
            <div className="flex flex-wrap gap-3 items-center">
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
