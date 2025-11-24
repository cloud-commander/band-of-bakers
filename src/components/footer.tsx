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
import { Instagram, Facebook, Twitter } from "lucide-react";
import { STORE } from "@/constants/app";

export function Footer() {
  return (
    <footer className="bg-card border-t py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Branding Section */}
          <div>
            <h3 className="text-foreground mb-4 text-lg font-bold">🍞 {STORE.shortName}</h3>
            <p className="text-muted-foreground mb-4 text-sm whitespace-pre-line">
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
                    <Instagram size={20} />
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
                    <Facebook size={20} />
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
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Shop
                </Link>
              </li>
              <li>
                <a
                  href="/account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-foreground mb-4 font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Empty column for spacing on larger screens */}
          <div></div>
        </div>

        {/* Copyright */}
        <div className="text-muted-foreground border-t pt-8 text-center text-sm">
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
