import type { NewsPost } from "@/lib/validators/news";
import { mockAdminUsers } from "./users";

// ============================================================================
// NEWS POSTS - MOCK DATA
// ============================================================================

export const mockNewsPosts: NewsPost[] = [
  {
    id: "news-1",
    title: "Introducing Our New Sourdough Varieties",
    slug: "introducing-new-sourdough-varieties",
    content:
      "<p>We're excited to announce three new sourdough varieties joining our lineup! After months of testing and perfecting our recipes, we're proud to introduce Seeded Rye, Olive & Rosemary, and Sun-Dried Tomato & Basil sourdough loaves.</p><p>Each loaf is made with our signature 24-hour fermentation process and local ingredients...</p>",
    excerpt:
      "Three new artisan sourdough varieties are joining our regular lineup, including Seeded Rye, Olive & Rosemary, and Sun-Dried Tomato & Basil.",
    featured_image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-11-20T10:00:00.000Z",
    created_at: "2024-11-15T00:00:00.000Z",
    updated_at: "2024-11-20T10:00:00.000Z",
  },
  {
    id: "news-2",
    title: "Christmas Bake Sale Dates Announced",
    slug: "christmas-bake-sale-dates-announced",
    content:
      "<p>The festive season is approaching, and we're thrilled to announce our special Christmas bake sale schedule! We'll be offering limited-edition seasonal treats including Stollen, Mince Pies, and Christmas Pudding.</p><p>Pre-orders open December 1st with collection dates on December 21st and 22nd...</p>",
    excerpt:
      "Mark your calendars! Our Christmas bake sale featuring Stollen, Mince Pies, and festive treats runs December 21-22. Pre-orders open December 1st.",
    featured_image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: true,
    published_at: "2024-11-15T10:00:00.000Z",
    created_at: "2024-11-10T00:00:00.000Z",
    updated_at: "2024-11-15T10:00:00.000Z",
  },
  {
    id: "news-3",
    title: "Behind the Scenes: A Day in Our Bakery",
    slug: "behind-the-scenes-bakery-day",
    content:
      "<p>Ever wondered what goes into making your favourite artisan bread? Join us for a behind-the-scenes look at a typical baking day at Band of Bakers.</p><p>We start at 4 AM, shaping the dough that's been fermenting overnight...</p>",
    excerpt:
      "Go behind the scenes and discover what it takes to create your favourite artisan bread. From 4 AM starts to the final bake.",
    featured_image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-11-10T10:00:00.000Z",
    created_at: "2024-11-05T00:00:00.000Z",
    updated_at: "2024-11-10T10:00:00.000Z",
  },
  {
    id: "news-4",
    title: "Supporting Local Flour Mills",
    slug: "supporting-local-flour-mills",
    content:
      "<p>At Band of Bakers, we're committed to using locally sourced ingredients. This month, we're highlighting our partnership with Shipton Mill...</p>",
    excerpt:
      "Learn about our commitment to local sourcing and our partnership with Shipton Mill for premium British flour.",
    featured_image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: false,
    published_at: null,
    created_at: "2024-11-20T00:00:00.000Z",
    updated_at: "2024-11-20T00:00:00.000Z",
  },
];

export const mockNewsPostsEmpty: NewsPost[] = [];
export const mockNewsPostsPublished = mockNewsPosts.filter((p) => p.is_published);
export const mockNewsPostsDraft = mockNewsPosts.filter((p) => !p.is_published);
