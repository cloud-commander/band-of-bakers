import type { NextConfig } from "next";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const isProd = process.env.NODE_ENV === "production";
const cloudflareImagesDomain = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_DOMAIN;

const nextConfig: NextConfig = {
  images: {
    loader: isProd ? "custom" : undefined,
    loaderFile: isProd ? "./src/lib/image-loader.ts" : undefined,
    unoptimized: isProd && Boolean(cloudflareImagesDomain),
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.iconscout.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-e6068271bc7f407fa2c8d76686fe9cfe.r2.dev",
        port: "",
        pathname: "/**",
      },
      ...(cloudflareImagesDomain
        ? [
            {
              protocol: "https" as const,
              hostname: cloudflareImagesDomain,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  experimental: {
    reactCompiler: true,
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  serverExternalPackages: ["better-sqlite3"],
  webpack: (config) => {
    config.module.rules.push({
      test: /https:\/\/fonts\.gstatic\.com\/.*\.ttf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "static/fonts/",
          publicPath: "/_next/static/fonts/",
        },
      },
    });
    return config;
  },
};

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
