import { productRepository } from '@/lib/repositories';
import type { InsertProduct, InsertProductVariant } from '@/lib/repositories';

/**
 * Product Service
 * Handles product-related business logic
 */
export class ProductService {
  /**
   * Get all active products
   */
  async getActiveProducts() {
    return await productRepository.findActiveProducts();
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  /**
   * Get product with variants
   */
  async getProductWithVariants(productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const variants = await productRepository.getActiveVariants(productId);

    return {
      ...product,
      variants,
    };
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string, activeOnly = true) {
    if (activeOnly) {
      return await productRepository.findActiveByCategoryId(categoryId);
    }
    return await productRepository.findByCategoryId(categoryId);
  }

  /**
   * Create product with variants
   */
  async createProduct(product: InsertProduct, variants: InsertProductVariant[]) {
    // Validate slug is unique
    const existingProduct = await productRepository.findBySlug(product.slug);
    if (existingProduct) {
      throw new Error('Product slug already exists');
    }

    // Validate price
    if (product.base_price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    // Create product with variants
    return await productRepository.createWithVariants(product, variants);
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, data: Partial<InsertProduct>) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // If updating slug, check it's unique
    if (data.slug && data.slug !== product.slug) {
      const existingProduct = await productRepository.findBySlug(data.slug);
      if (existingProduct) {
        throw new Error('Product slug already exists');
      }
    }

    return await productRepository.update(productId, data);
  }

  /**
   * Toggle product active status
   */
  async toggleProductActive(productId: string) {
    return await productRepository.toggleActive(productId);
  }

  /**
   * Search products
   */
  async searchProducts(searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters');
    }

    return await productRepository.searchByName(searchTerm.trim());
  }

  /**
   * Calculate product price with variant
   */
  calculatePrice(basePrice: number, variantAdjustment: number = 0): number {
    return basePrice + variantAdjustment;
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return await productRepository.delete(productId);
  }
}

export const productService = new ProductService();
