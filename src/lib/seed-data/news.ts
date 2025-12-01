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
    is_published: true,
    published_at: "2024-11-20T09:00:00.000Z",
    created_at: "2024-11-20T00:00:00.000Z",
    updated_at: "2024-11-20T00:00:00.000Z",
  },
  {
    id: "news-5",
    title: "Welcoming Our New Head Pastry Chef",
    slug: "welcoming-our-new-head-pastry-chef",
    content:
      "<p>We are delighted to welcome Elena Rossi to the Band of Bakers family as our new Head Pastry Chef. Elena brings over 15 years of experience from bakeries in Paris and Rome.</p><p>Her signature croissants and danishes are already flying off the shelves. Come by this weekend to taste her creations!</p>",
    excerpt:
      "Meet Elena Rossi, our new Head Pastry Chef bringing 15 years of European baking experience to Shrewsbury.",
    featured_image:
      "https://images.unsplash.com/photo-1583332130317-de7b2adb9e64?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-10-15T09:00:00.000Z",
    created_at: "2024-10-10T00:00:00.000Z",
    updated_at: "2024-10-15T00:00:00.000Z",
  },
  {
    id: "news-6",
    title: "Community Sourdough Workshop",
    slug: "community-sourdough-workshop",
    content:
      "<p>Due to popular demand, we're hosting our first-ever Community Sourdough Workshop! Join us for a hands-on afternoon where you'll learn the art of maintaining a starter, mixing, folding, and baking your own loaf.</p><p>Tickets are limited to 10 participants per session to ensure personal attention.</p>",
    excerpt:
      "Join us for a hands-on sourdough workshop. Learn to bake your own artisan bread from our expert bakers.",
    featured_image:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: true,
    published_at: "2024-10-01T09:00:00.000Z",
    created_at: "2024-09-25T00:00:00.000Z",
    updated_at: "2024-10-01T00:00:00.000Z",
  },
  {
    id: "news-7",
    title: "Finalist in National Bakery Awards",
    slug: "finalist-in-national-bakery-awards",
    content:
      "<p>We are incredibly honoured to be named a finalist in the 'Best Regional Bakery' category at this year's National Bakery Awards! This recognition means the world to our small team.</p><p>Thank you to all our wonderful customers for your continued support and for nominating us.</p>",
    excerpt:
      "Band of Bakers has been named a finalist for 'Best Regional Bakery' in the National Bakery Awards!",
    featured_image:
      "https://images.unsplash.com/photo-1579697096985-41fe14370493?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-09-10T09:00:00.000Z",
    created_at: "2024-09-05T00:00:00.000Z",
    updated_at: "2024-09-10T00:00:00.000Z",
  },
  {
    id: "news-8",
    title: "Summer Menu Launch Party",
    slug: "summer-menu-launch-party",
    content:
      "<p>Summer is here, and so is our new menu! Think strawberry tarts, lemon drizzle cake, and focaccia with fresh garden herbs.</p><p>Join us this Saturday for our launch party with free tastings and live music from local artists.</p>",
    excerpt:
      "Celebrate the start of summer with our new seasonal menu launch party. Free tastings and live music!",
    featured_image:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: true,
    published_at: "2024-06-01T09:00:00.000Z",
    created_at: "2024-05-25T00:00:00.000Z",
    updated_at: "2024-06-01T00:00:00.000Z",
  },
  {
    id: "news-9",
    title: "Charity Bake Sale Success",
    slug: "charity-bake-sale-success",
    content:
      "<p>A huge thank you to everyone who came out to our charity bake sale last weekend. Together, we raised over £1,500 for the Shrewsbury Food Bank!</p><p>It was heartwarming to see the community come together for such a great cause.</p>",
    excerpt:
      "We raised over £1,500 for the Shrewsbury Food Bank! Thank you to everyone who supported our charity bake sale.",
    featured_image:
      "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-05-15T09:00:00.000Z",
    created_at: "2024-05-10T00:00:00.000Z",
    updated_at: "2024-05-15T00:00:00.000Z",
  },
  {
    id: "news-10",
    title: "Why We Use Organic Butter",
    slug: "why-we-use-organic-butter",
    content:
      "<p>Butter is the soul of baking. That's why we've made the switch to 100% organic butter from local dairy farms.</p><p>Not only does it taste richer and creamier, but it also supports sustainable farming practices. Taste the difference in our croissants!</p>",
    excerpt:
      "We've switched to 100% organic local butter. Discover why it makes our pastries taste even better.",
    featured_image:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: true,
    published_at: "2024-04-20T09:00:00.000Z",
    created_at: "2024-04-15T00:00:00.000Z",
    updated_at: "2024-04-20T00:00:00.000Z",
  },
  {
    id: "news-11",
    title: "Partnering with Bean & Brew",
    slug: "partnering-with-bean-and-brew",
    content:
      "<p>Great coffee deserves great pastries. We're excited to announce our partnership with Bean & Brew Coffee House.</p><p>You can now find a selection of our fresh pastries and cakes at their High Street location every morning.</p>",
    excerpt:
      "Find our fresh pastries at Bean & Brew Coffee House! We're partnering with local coffee experts to bring you the perfect breakfast.",
    featured_image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=800&fit=crop&auto=format",
    author: "Sarah Mitchell",
    author_id: mockAdminUsers[0].id,
    is_published: true,
    published_at: "2024-03-10T09:00:00.000Z",
    created_at: "2024-03-05T00:00:00.000Z",
    updated_at: "2024-03-10T00:00:00.000Z",
  },
  {
    id: "news-12",
    title: "Expanding Our Shrewsbury Bakery",
    slug: "expanding-our-shrewsbury-bakery",
    content:
      "<p>We're growing! Thanks to your support, we're expanding our bakery to include a small seating area.</p><p>Soon you'll be able to enjoy your coffee and cake right here with us. Renovations start next month!</p>",
    excerpt:
      "Big news! We're expanding our bakery to include a seating area. Soon you can enjoy your treats in-store.",
    featured_image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop&auto=format",
    author: "James Thompson",
    author_id: mockAdminUsers[1].id,
    is_published: true,
    published_at: "2024-02-15T09:00:00.000Z",
    created_at: "2024-02-10T00:00:00.000Z",
    updated_at: "2024-02-15T00:00:00.000Z",
  },
];

export const mockNewsPostsEmpty: NewsPost[] = [];
export const mockNewsPostsPublished = mockNewsPosts.filter((p) => p.is_published);
export const mockNewsPostsDraft = mockNewsPosts.filter((p) => !p.is_published);
