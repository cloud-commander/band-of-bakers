"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (!embedHtml) return;

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
  }, [embedHtml]);

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
        {embedHtml ? (
          <div
            className="bg-background border rounded-xl overflow-hidden shadow-sm"
            // Instagram embed HTML provided by admin (trusted input)
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-xl bg-muted/30">
            Instagram embed not configured yet.
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
