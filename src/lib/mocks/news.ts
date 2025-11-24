import type { NewsPost } from "@/lib/validators/news";
import { mockAdminUsers } from "./users";

// ============================================================================
// NEWS POSTS - MOCK DATA
// ============================================================================

export const mockNewsPosts: NewsPost[] = [
  {
    id: "news-1",
    title: "Welcome to Band of Bakers!",
    slug: "welcome-to-band-of-bakers",
    content: "<p>We're thrilled to announce our new bake sale platform...</p>",
    excerpt: "We're thrilled to announce our new bake sale platform",
    image_url: null,
    author_id: mockAdminUsers[0].id, // Owner
    is_published: true,
    published_at: new Date("2024-01-15T10:00:00Z").toISOString(),
    created_at: new Date("2024-01-10T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-15T10:00:00Z").toISOString(),
  },
  {
    id: "news-2",
    title: "Christmas Bake Sale Announced",
    slug: "christmas-bake-sale-announced",
    content:
      "<p>Join us for our special Christmas bake sale on December 21st...</p>",
    excerpt: "Join us for our special Christmas bake sale",
    image_url: null,
    author_id: mockAdminUsers[1].id, // Manager
    is_published: true,
    published_at: new Date("2024-11-01T10:00:00Z").toISOString(),
    created_at: new Date("2024-10-25T00:00:00Z").toISOString(),
    updated_at: new Date("2024-11-01T10:00:00Z").toISOString(),
  },
  {
    id: "news-3",
    title: "New Products Coming Soon",
    slug: "new-products-coming-soon",
    content: "<p>We're working on exciting new products for next month...</p>",
    excerpt: "We're working on exciting new products",
    image_url: null,
    author_id: mockAdminUsers[0].id,
    is_published: false,
    published_at: null,
    created_at: new Date("2024-11-20T00:00:00Z").toISOString(),
    updated_at: new Date("2024-11-20T00:00:00Z").toISOString(),
  },
];

export const mockNewsPostsEmpty: NewsPost[] = [];
export const mockNewsPostsPublished = mockNewsPosts.filter(
  (p) => p.is_published
);
export const mockNewsPostsDraft = mockNewsPosts.filter((p) => !p.is_published);
