/**
 * Repository Index
 * Centralized exports for all repositories
 */

export { BaseRepository } from "./base.repository";
export { UserRepository, userRepository } from "./user.repository";
export { ProductRepository, productRepository } from "./product.repository";
export { CategoryRepository, categoryRepository } from "./category.repository";
export { BakeSaleRepository, bakeSaleRepository } from "./bake-sale.repository";
export { VoucherRepository, voucherRepository } from "./voucher.repository";

export type { User, InsertUser } from "./user.repository";
export type {
  Product,
  InsertProduct,
  ProductVariant,
  InsertProductVariant,
} from "./product.repository";
export type { ProductCategory, InsertProductCategory } from "./category.repository";
export type { BakeSaleWithLocation } from "./bake-sale.repository";
export type { BakeSale } from "@/db/schema";
export type { Voucher } from "@/db/schema";
