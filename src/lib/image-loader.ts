"use client";

import { ImageLoaderProps } from "next/image";

export default function cloudflareLoader({ src, width, quality }: ImageLoaderProps) {
  const cloudflareDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DOMAIN;
  const useImageResizing = process.env.NEXT_PUBLIC_USE_IMAGE_RESIZING === "true";

  // If in development, return the src directly with width param
  if (process.env.NODE_ENV === "development") {
    const separator = src.includes("?") ? "&" : "?";
    return `${src}${separator}w=${width}`;
  }

  // If Image Resizing is explicitly disabled or no custom domain configured,
  // serve images directly without transformation.
  // Cloudflare Image Resizing requires:
  // 1. A paid Cloudflare plan with Image Resizing enabled
  // 2. A custom domain (not workers.dev)
  if (!useImageResizing || !cloudflareDomain) {
    // Return the original src - images are already optimized WebP from R2
    return src;
  }

  // Use Cloudflare Image Resizing when properly configured
  // Format: /cdn-cgi/image/width=...,quality=.../image-path
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  params.push("format=auto");

  const paramsString = params.join(",");
  const base = `https://${cloudflareDomain}`;
  return `${base}/cdn-cgi/image/${paramsString}${src}`;
}
