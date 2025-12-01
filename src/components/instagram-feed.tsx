"use client";

import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import { DESIGN_TOKENS } from "@/lib/design-tokens";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

export function InstagramFeed({ embedHtml }: { embedHtml?: string | null }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !embedHtml) return;

    // Ensure Instagram embed script is loaded and processed
    const processEmbed = () => window.instgrm?.Embeds?.process?.();

    if (window.instgrm?.Embeds) {
      processEmbed();
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", processEmbed, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = processEmbed;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [isMounted, embedHtml]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Instagram className="h-6 w-6 text-primary" />
          <h2
            className={`${DESIGN_TOKENS.typography.h3.size} ${DESIGN_TOKENS.typography.h3.weight}`}
            style={{
              fontFamily: DESIGN_TOKENS.typography.h3.family,
              color: DESIGN_TOKENS.colors.text.main,
            }}
          >
            Follow Us on Instagram
          </h2>
        </div>
        <p
          className={`${DESIGN_TOKENS.typography.body.base.size} max-w-2xl mx-auto`}
          style={{
            color: DESIGN_TOKENS.colors.text.muted,
          }}
        >
          See what&apos;s fresh from our ovens @band_of_bakers
        </p>
      </div>

      {/* Embedded post or placeholder */}
      <div className="max-w-3xl mx-auto">
        {isMounted && embedHtml ? (
          <>
            <div className="flex justify-center">
              <div
                className="instagram-embed-wrapper bg-background border rounded-xl overflow-hidden shadow-sm"
                // Instagram embed HTML provided by admin (trusted input)
                dangerouslySetInnerHTML={{ __html: embedHtml }}
              />
            </div>
            <style jsx global>{`
              .instagram-embed-wrapper .instagram-media {
                margin: 0 auto !important;
                max-width: 420px !important;
                width: 100% !important;
              }

              @media (min-width: 1024px) {
                .instagram-embed-wrapper .instagram-media {
                  transform: scale(0.9);
                  transform-origin: top center;
                  overflow: hidden !important;
                }
              }
            `}</style>
            <div className="text-center mt-4">
              <a
                href="https://www.instagram.com/band_of_bakers/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                View on Instagram
              </a>
            </div>
          </>
        ) : (
          <div className="max-w-xl mx-auto">
            <div className="animate-pulse bg-muted/50 h-72 rounded-xl border" />
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Instagram embed not configured yet.
            </p>
          </div>
        )}
      </div>

      {/* Follow Button */}
      <div className="text-center mt-8">
        <a
          href="https://www.instagram.com/band_of_bakers/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Instagram className="h-5 w-5" />
          Follow @band_of_bakers
        </a>
      </div>
    </div>
  );
}
