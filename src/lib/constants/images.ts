// ============================================================================
// CLOUDFLARE IMAGES CONFIGURATION
// ============================================================================

/**
 * Cloudflare Images Configuration
 *
 * This file defines custom variants for Cloudflare Images when uploading to R2.
 * Variants allow automatic image transformations and optimizations.
 *
 * @see https://developers.cloudflare.com/images/cloudflare-images/transform/resize-images/
 */

// ============================================================================
// IMAGE VARIANTS
// ============================================================================

/**
 * Avatar Variant Configuration
 *
 * Optimized for user profile avatars:
 * - Square aspect ratio (1:1)
 * - Multiple sizes for different use cases
 * - WebP format for optimal compression
 * - Quality optimized for faces
 */
export const AVATAR_VARIANTS = {
  /**
   * Thumbnail - Small avatar for lists and comments
   * 64x64px, WebP, Quality 85
   */
  thumbnail: {
    width: 64,
    height: 64,
    fit: "cover" as const,
    format: "webp" as const,
    quality: 85,
    metadata: "none" as const,
  },

  /**
   * Small - Standard avatar for UI elements
   * 128x128px, WebP, Quality 85
   */
  small: {
    width: 128,
    height: 128,
    fit: "cover" as const,
    format: "webp" as const,
    quality: 85,
    metadata: "none" as const,
  },

  /**
   * Medium - Profile page avatar
   * 256x256px, WebP, Quality 90
   */
  medium: {
    width: 256,
    height: 256,
    fit: "cover" as const,
    format: "webp" as const,
    quality: 90,
    metadata: "none" as const,
  },

  /**
   * Large - High-resolution avatar for modals/zoom
   * 512x512px, WebP, Quality 90
   */
  large: {
    width: 512,
    height: 512,
    fit: "cover" as const,
    format: "webp" as const,
    quality: 90,
    metadata: "none" as const,
  },
} as const;

/**
 * Product Image Variant Configuration
 *
 * Optimized for product photos:
 * - Maintains aspect ratio
 * - Multiple sizes for responsive images
 * - WebP format with fallback support
 */
export const PRODUCT_IMAGE_VARIANTS = {
  /**
   * Thumbnail - Product grid/list view
   * 300px width, maintains aspect ratio
   */
  thumbnail: {
    width: 300,
    fit: "scale-down" as const,
    format: "webp" as const,
    quality: 85,
    metadata: "none" as const,
  },

  /**
   * Card - Product card images
   * 600px width, maintains aspect ratio
   */
  card: {
    width: 600,
    fit: "scale-down" as const,
    format: "webp" as const,
    quality: 90,
    metadata: "none" as const,
  },

  /**
   * Detail - Product detail page
   * 1200px width, maintains aspect ratio
   */
  detail: {
    width: 1200,
    fit: "scale-down" as const,
    format: "webp" as const,
    quality: 90,
    metadata: "copyright" as const,
  },

  /**
   * Hero - Large hero images
   * 1920px width, maintains aspect ratio
   */
  hero: {
    width: 1920,
    fit: "scale-down" as const,
    format: "webp" as const,
    quality: 90,
    metadata: "copyright" as const,
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build Cloudflare Images URL with variant
 *
 * @param imageId - The Cloudflare Images ID
 * @param variant - The variant name (e.g., "thumbnail", "medium")
 * @param accountHash - Your Cloudflare account hash
 * @returns Full URL to the transformed image
 *
 * @example
 * ```ts
 * const url = buildImageUrl("abc123", "medium", "your-account-hash");
 * // Returns: https://imagedelivery.net/your-account-hash/abc123/medium
 * ```
 */
export function buildImageUrl(
  imageId: string,
  variant: keyof typeof AVATAR_VARIANTS | keyof typeof PRODUCT_IMAGE_VARIANTS,
  accountHash: string
): string {
  return `https://imagedelivery.net/${accountHash}/${imageId}/${variant}`;
}

/**
 * Build avatar URL with specific variant
 *
 * @param imageId - The Cloudflare Images ID
 * @param variant - Avatar variant size
 * @returns Full URL to the avatar image
 */
export function buildAvatarUrl(
  imageId: string,
  variant: keyof typeof AVATAR_VARIANTS = "medium"
): string {
  const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  if (!accountHash) {
    console.warn("NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH not set");
    return "";
  }
  return buildImageUrl(imageId, variant, accountHash);
}

/**
 * Build product image URL with specific variant
 *
 * @param imageId - The Cloudflare Images ID
 * @param variant - Product image variant size
 * @returns Full URL to the product image
 */
export function buildProductImageUrl(
  imageId: string,
  variant: keyof typeof PRODUCT_IMAGE_VARIANTS = "card"
): string {
  const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH;
  if (!accountHash) {
    console.warn("NEXT_PUBLIC_CLOUDFLARE_IMAGES_ACCOUNT_HASH not set");
    return "";
  }
  return buildImageUrl(imageId, variant, accountHash);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AvatarVariant = keyof typeof AVATAR_VARIANTS;
export type ProductImageVariant = keyof typeof PRODUCT_IMAGE_VARIANTS;
export type ImageVariant = AvatarVariant | ProductImageVariant;

// ============================================================================
// UPLOAD CONFIGURATION
// ============================================================================

/**
 * Maximum file sizes for uploads
 */
export const MAX_FILE_SIZES = {
  avatar: 5 * 1024 * 1024, // 5MB
  product: 10 * 1024 * 1024, // 10MB
} as const;

/**
 * Allowed MIME types for uploads
 */
export const ALLOWED_IMAGE_TYPES = {
  avatar: ["image/jpeg", "image/png", "image/webp"],
  product: ["image/jpeg", "image/png", "image/webp"],
} as const;

/**
 * Image upload validation
 */
export function validateImageUpload(
  file: File,
  type: "avatar" | "product"
): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZES[type]) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZES[type] / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  const allowedTypes = ALLOWED_IMAGE_TYPES[type];
  if (!allowedTypes.includes(file.type as (typeof allowedTypes)[number])) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}
