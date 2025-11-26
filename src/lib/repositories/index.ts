/**
 * Repository Index
 * Centralized exports for all repositories
 */

export { BaseRepository } from './base.repository';
export { UserRepository, userRepository } from './user.repository';
export { ProductRepository, productRepository } from './product.repository';

export type { User, InsertUser } from './user.repository';
export type { Product, InsertProduct, ProductVariant, InsertProductVariant } from './product.repository';
