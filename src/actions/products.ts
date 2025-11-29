"use server";

import { auth } from "@/auth";
import { productRepository, categoryRepository } from "@/lib/repositories";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Product } from "@/db/schema";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };
type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

type ProductWithVariants = Product & {
  variants: Awaited<ReturnType<typeof productRepository.getVariants>>;
};

// Validation schema for product creation/update
const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  // base_price is now optional in input because it's calculated from variants if they exist
  base_price: z.number().min(0, "Price must be positive").optional(),
  is_active: z.boolean().default(true),
  variants: z
    .array(
      z.object({
        id: z.string().optional(), // Optional for new variants
        name: z.string().min(1, "Variant name is required"),
        price: z.number().min(0, "Price must be positive"),
      })
    )
    .optional(),
});

/**
 * Check if user has admin role
 */
async function checkAdminRole() {
  const session = await auth();
  if (!session?.user?.role || !["owner", "manager", "staff"].includes(session.user.role)) {
    return false;
  }
  return true;
}

/**
 * Upload image to R2
 */
async function uploadImageToR2(file: File): Promise<string | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      console.error("R2 binding not available");
      return null;
    }

    const fileName = `images/products/${Date.now()}-${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    return `/${fileName}`;
  } catch (error) {
    console.error("R2 upload error:", error);
    return null;
  }
}

/**
 * Delete image from R2
 */
async function deleteImageFromR2(imageUrl: string): Promise<void> {
  try {
    const { env } = await getCloudflareContext({ async: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(env as any).R2) {
      console.error("R2 binding not available");
      return;
    }

    // Extract R2 key from URL (remove leading slash)
    const r2Key = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (env as any).R2.delete(r2Key);
  } catch (error) {
    console.error("R2 delete error:", error);
  }
}

/**
 * Create a new product
 */
export async function createProduct(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Auth check
    if (!(await checkAdminRole())) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Extract and validate data
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      category_id: formData.get("category_id") as string,
      base_price: formData.get("base_price")
        ? parseFloat(formData.get("base_price") as string)
        : undefined,
      is_active: formData.get("is_active") === "true",
      variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
    };

    const validated = productSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 3. Calculate prices
    let finalBasePrice = validated.data.base_price || 0;
    const variantsToCreate = [];

    if (validated.data.variants && validated.data.variants.length > 0) {
      // Find lowest price among variants to set as base_price
      const prices = validated.data.variants.map((v) => v.price);
      finalBasePrice = Math.min(...prices);

      // Prepare variants with price_adjustment
      for (let i = 0; i < validated.data.variants.length; i++) {
        const variant = validated.data.variants[i];
        variantsToCreate.push({
          id: `var-${Date.now()}-${i}`,
          product_id: "", // Will be set in repository
          name: variant.name,
          price_adjustment: variant.price - finalBasePrice,
          sort_order: i,
          is_active: true,
        });
      }
    } else if (validated.data.base_price === undefined) {
      return { success: false, error: "Price is required if no variants are added" };
    }

    // 4. Handle image upload
    const imageFile = formData.get("image") as File | null;
    const imageUrlFromGallery = formData.get("image_url") as string | null;
    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImageToR2(imageFile);
      if (!uploadedUrl) {
        return { success: false, error: "Failed to upload image" };
      }
      imageUrl = uploadedUrl;
    } else if (imageUrlFromGallery) {
      // User selected an existing image from gallery
      imageUrl = imageUrlFromGallery;
    }

    // 5. Create product in database
    const productId = `prod-${Date.now()}`;
    const product = await productRepository.createWithVariants(
      {
        id: productId,
        name: validated.data.name,
        slug: validated.data.slug,
        description: validated.data.description,
        category_id: validated.data.category_id,
        base_price: finalBasePrice,
        is_active: validated.data.is_active,
        image_url: imageUrl,
      },
      variantsToCreate
    );

    // 6. Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/menu");

    return { success: true, data: { id: product.id } };
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, error: "Failed to create product" };
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    // 1. Auth check
    if (!(await checkAdminRole())) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Get existing product
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return { success: false, error: "Product not found" };
    }

    // 3. Extract and validate data
    const rawData = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      category_id: formData.get("category_id") as string,
      base_price: formData.get("base_price")
        ? parseFloat(formData.get("base_price") as string)
        : undefined,
      is_active: formData.get("is_active") === "true",
      variants: formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [],
    };

    const validated = productSchema.safeParse(rawData);
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0].message };
    }

    // 4. Calculate prices & Prepare variants
    let finalBasePrice = validated.data.base_price || 0;
    const variantsCreate = [];
    const variantsUpdate = [];
    const variantIdsToKeep = new Set<string>();

    if (validated.data.variants && validated.data.variants.length > 0) {
      // Find lowest price among variants to set as base_price
      const prices = validated.data.variants.map((v) => v.price);
      finalBasePrice = Math.min(...prices);

      for (const variant of validated.data.variants) {
        const priceAdjustment = variant.price - finalBasePrice;

        if (variant.id) {
          // Update existing variant
          variantsUpdate.push({
            id: variant.id,
            name: variant.name,
            price_adjustment: priceAdjustment,
          });
          variantIdsToKeep.add(variant.id);
        } else {
          // Create new variant
          variantsCreate.push({
            name: variant.name,
            price_adjustment: priceAdjustment,
            sort_order: 0,
            is_active: true,
          });
        }
      }
    } else if (validated.data.base_price === undefined) {
      return { success: false, error: "Price is required if no variants are added" };
    }

    // Identify variants to delete
    const existingVariants = await productRepository.getVariants(id);
    const variantsDelete = existingVariants
      .filter((v) => !variantIdsToKeep.has(v.id))
      .map((v) => v.id);

    // 5. Handle image upload (if new image provided)
    const imageFile = formData.get("image") as File | null;
    const imageUrlFromGallery = formData.get("image_url") as string | null;
    let imageUrl = existingProduct.image_url;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingProduct.image_url) {
        await deleteImageFromR2(existingProduct.image_url);
      }

      // Upload new image
      const uploadedUrl = await uploadImageToR2(imageFile);
      if (!uploadedUrl) {
        return { success: false, error: "Failed to upload image" };
      }
      imageUrl = uploadedUrl;
    } else if (imageUrlFromGallery) {
      // User selected an existing image from gallery
      imageUrl = imageUrlFromGallery;
    }

    // 6. Update product and variants in database
    const product = await productRepository.updateWithVariants(
      id,
      {
        name: validated.data.name,
        slug: validated.data.slug,
        description: validated.data.description,
        category_id: validated.data.category_id,
        base_price: finalBasePrice,
        is_active: validated.data.is_active,
        image_url: imageUrl,
      },
      {
        // @ts-expect-error - Type mismatch for create variants
        create: variantsCreate,
        update: variantsUpdate,
        delete: variantsDelete,
      }
    );

    if (!product) {
      return { success: false, error: "Failed to update product" };
    }

    // 7. Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/menu");
    revalidatePath(`/products/${existingProduct.slug}`);

    return { success: true, data: { id: product.id } };
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, error: "Failed to update product" };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<ActionResult<void>> {
  try {
    // 1. Auth check
    if (!(await checkAdminRole())) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Get product to delete image
    const product = await productRepository.findById(id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // 3. Delete image from R2 if exists
    if (product.image_url) {
      await deleteImageFromR2(product.image_url);
    }

    // 4. Delete product from database
    await productRepository.delete(id);

    // 5. Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/menu");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

/**
 * Get all products with variants (admin view)
 */
export async function getProducts() {
  try {
    const products = await productRepository.findAll();

    // Debug: Check for products with null/empty image_url
    const productsWithoutImages = products.filter(
      (p: Product) => !p.image_url || p.image_url === ""
    );
    if (productsWithoutImages.length > 0) {
      console.log(
        "[SERVER DEBUG] Products without images from DB:",
        productsWithoutImages.map((p: Product) => ({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          image_url_type: typeof p.image_url,
          is_null: p.image_url === null,
          is_undefined: p.image_url === undefined,
          is_empty: p.image_url === "",
        }))
      );
    }

    // Fetch variants for each product
    const productsWithVariants = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products.map(async (product: any) => {
        const variants = await productRepository.getVariants(product.id);
        return {
          ...product,
          variants,
        };
      })
    );

    return productsWithVariants;
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
}

export async function getPaginatedProducts(
  page = 1,
  pageSize = 20
): Promise<PaginatedResult<ProductWithVariants>> {
  const limit = Math.max(1, Math.min(pageSize, 100));
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  try {
    const result = await productRepository.findPaginated(limit, offset, false);
    const productsWithVariants = await Promise.all(
      result.data.map(async (product: Product) => {
        const variants = await productRepository.getVariants(product.id);
        return {
          ...product,
          variants,
        };
      })
    );

    return {
      data: productsWithVariants,
      total: result.total,
      page: currentPage,
      pageSize: limit,
    };
  } catch (error) {
    console.error("Get paginated products error:", error);
    return { data: [], total: 0, page: currentPage, pageSize: limit };
  }
}

/**
 * Get active products with variants (public view)
 */
export async function getActiveProducts() {
  try {
    const products = await productRepository.findActiveProducts();

    // Fetch active variants for each product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await productRepository.getActiveVariants(product.id);
        return {
          ...product,
          variants,
        };
      })
    );

    return productsWithVariants;
  } catch (error) {
    console.error("Get active products error:", error);
    return [];
  }
}

/**
 * Get product by ID
 */
/**
 * Get product by ID with variants
 */
export async function getProductById(id: string) {
  try {
    const product = await productRepository.findById(id);
    if (!product) return null;

    const variants = await productRepository.getVariants(id);
    return { ...product, variants };
  } catch (error) {
    console.error("Get product error:", error);
    return null;
  }
}

/**
 * Toggle product active status
 */
export async function toggleProductActive(
  id: string
): Promise<ActionResult<{ id: string; is_active: boolean }>> {
  try {
    // 1. Auth check
    if (!(await checkAdminRole())) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Toggle status
    const product = await productRepository.toggleActive(id);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // 3. Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/menu");

    return { success: true, data: { id: product.id, is_active: product.is_active } };
  } catch (error) {
    console.error("Toggle product active error:", error);
    return { success: false, error: "Failed to toggle product status" };
  }
}

/**
 * Get all categories sorted
 */
export async function getCategories() {
  try {
    return await categoryRepository.findAllSorted();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

/**
 * Get product by slug with variants
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await productRepository.findBySlug(slug);
    if (!product) return null;

    const variants = await productRepository.getActiveVariants(product.id);
    return { ...product, variants };
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(categorySlug: string) {
  try {
    const category = await categoryRepository.findBySlug(categorySlug);
    if (!category) return [];

    const products = await productRepository.findActiveByCategoryId(category.id);

    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await productRepository.getActiveVariants(product.id);
        return { ...product, variants };
      })
    );

    return productsWithVariants;
  } catch (error) {
    console.error(`Failed to fetch products for category ${categorySlug}:`, error);
    return [];
  }
}

/**
 * Get all categories with their products (for Menu page)
 */
export async function getMenu() {
  try {
    const categories = await getCategories();

    const menu = await Promise.all(
      categories.map(async (category) => {
        const products = await getProductsByCategory(category.slug);
        return { ...category, products };
      })
    );

    return menu;
  } catch (error) {
    console.error("Failed to fetch menu:", error);
    return [];
  }
}

/**
 * Get random active products (for featured sections)
 */
export async function getRandomProducts(count: number = 3) {
  try {
    const allProducts = await productRepository.findActiveProducts();

    if (allProducts.length === 0) return [];

    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...allProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Take the first 'count' items and add variants
    const selectedProducts = shuffled.slice(0, count);
    const productsWithVariants = await Promise.all(
      selectedProducts.map(async (product) => {
        const variants = await productRepository.getActiveVariants(product.id);
        return { ...product, variants };
      })
    );

    return productsWithVariants;
  } catch (error) {
    console.error("Get random products error:", error);
    return [];
  }
}
