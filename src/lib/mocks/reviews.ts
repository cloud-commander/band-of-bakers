export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number; // 1-5
  date: string;
  title?: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count: number;
  images?: string[];
}

export const mockReviews: Review[] = [
  {
    id: "rev-1",
    product_id: "prod-granary-sourdough",
    user_name: "Sarah J.",
    rating: 5,
    date: "2024-03-15",
    title: "Best sourdough in town!",
    comment:
      "Absolutely delicious. The crust is perfect and the inside is so soft. Will definitely order again.",
    verified_purchase: true,
    helpful_count: 12,
  },
  {
    id: "rev-2",
    product_id: "prod-granary-sourdough",
    user_name: "Mike T.",
    rating: 4,
    date: "2024-03-10",
    title: "Great taste",
    comment: "Really good bread, just a bit pricey. But worth it for a treat.",
    verified_purchase: true,
    helpful_count: 3,
  },
  {
    id: "rev-3",
    product_id: "prod-almond-croissant",
    user_name: "Emma W.",
    rating: 5,
    date: "2024-03-12",
    title: "Heavenly",
    comment:
      "These are the best almond croissants I've ever had. Generous filling and flaky pastry.",
    verified_purchase: true,
    helpful_count: 8,
  },
  {
    id: "rev-4",
    product_id: "prod-almond-croissant",
    user_name: "David B.",
    rating: 5,
    date: "2024-03-05",
    title: "Perfect with coffee",
    comment: "A weekend staple for us now. Simply delicious.",
    verified_purchase: true,
    helpful_count: 2,
  },
  {
    id: "rev-5",
    product_id: "prod-chocolate-brownie",
    user_name: "Lucy H.",
    rating: 5,
    date: "2024-03-14",
    title: "So gooey!",
    comment: "Rich, fudgy and delicious. Highly recommend.",
    verified_purchase: true,
    helpful_count: 5,
  },
  {
    id: "rev-6",
    product_id: "prod-chocolate-brownie",
    user_name: "James P.",
    rating: 3,
    date: "2024-02-28",
    title: "Good but sweet",
    comment: "A bit too sweet for my taste, but the texture was great.",
    verified_purchase: true,
    helpful_count: 1,
  },
];
