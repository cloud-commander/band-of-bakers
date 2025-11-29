"use client";

import { ImageLoaderProps } from "next/image";

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const cloudflareDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DOMAIN;
  // If in development, return the src directly (or use Next.js default optimization if not using loaderFile)
  // But since we are setting loaderFile, we are responsible for the URL.
  // If we just return src, it points to the public folder or API route.
  // Our images are served via /images/... (which is handled by our route.ts) or direct R2 if configured.
  // Our route.ts serves raw images.

  // In production (Cloudflare), we want to use Image Resizing.
  // Format: /cdn-cgi/image/width=...,quality=.../image-path

  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  // Add format=auto for WebP/AVIF support
  params.push("format=auto");

  const paramsString = params.join(",");

  if (process.env.NODE_ENV === "development") {
    // In dev, we can't easily use Cloudflare Image Resizing unless we proxy.
    // Just return the original src, but append width to satisfy Next.js loader requirement
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }

  // If Cloudflare Images custom domain is provided, construct absolute URL; otherwise use relative path
  const base = cloudflareDomain ? `https://${cloudflareDomain}` : "";
  return `${base}/cdn-cgi/image/${paramsString}${src}`;
}
