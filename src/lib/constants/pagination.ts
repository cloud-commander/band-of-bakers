/**
 * Pagination Configuration
 * Centralized settings for pagination across the application
 */

export const PAGINATION_CONFIG = {
  // Shop Pages
  MENU_ITEMS_PER_PAGE: 8,
  NEWS_ITEMS_PER_PAGE: 9,
  ORDERS_ITEMS_PER_PAGE: 10,

  // Admin Pages
  ADMIN_PRODUCTS_ITEMS_PER_PAGE: 10,
  ADMIN_ORDERS_ITEMS_PER_PAGE: 10,
  ADMIN_NEWS_ITEMS_PER_PAGE: 10,
  ADMIN_BAKE_SALES_ITEMS_PER_PAGE: 10,
  ADMIN_USERS_ITEMS_PER_PAGE: 10,
} as const;

/**
 * Get items per page for a specific page
 * @param pageType - The type of page (e.g., 'menu', 'admin-products')
 * @returns Number of items to display per page
 */
export function getItemsPerPage(pageType: keyof typeof PAGINATION_CONFIG): number {
  return PAGINATION_CONFIG[pageType];
}
