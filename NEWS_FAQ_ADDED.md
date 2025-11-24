# News and FAQ Pages Added

## What Was Created

### 1. **News Page** (`/news`)

A professional news listing page displaying published posts in a card grid layout.

**Features:**

- Card grid layout (responsive 2-3 columns)
- Featured images for visual impact
- Post excerpts with "Read more" links
- Author and published date metadata
- Sorted by newest first
- Empty state for no published posts

### 2. **FAQ Page** (`/faq`)

An interactive FAQ page with category filtering and accordion UI.

**Features:**

- Tabbed category filter (All, Ordering, Delivery, Products, General)
- 15 comprehensive questions across 4 categories
- Accordion UI for clean presentation
- Contact CTA at bottom
- Fully responsive design

**FAQ Categories:**

- 🛒 **Ordering** (4 questions) - How to order, cutoffs, modifications
- 🚚 **Delivery & Collection** (3 questions) - Delivery areas, collection times
- 🍞 **Products** (4 questions) - Ingredients, allergies, freshness, sourdough
- ❓ **General** (4 questions) - Schedules, custom orders, wholesale, updates

### 3. **Recent News Component** (Homepage)

A news preview section showing the 3 most recent published posts.

**Features:**

- Displays 3 latest news stories
- Featured images with hover effects
- Post excerpts and dates
- "View All News" button linking to `/news`
- Automatically hidden if no published posts

**Homepage Location:**
Between the CTA section and Find Us map.

## Navigation Updates

### Navbar Links Added:

```
Shop | About | News | FAQ
```

Both links are now in the main navigation bar, accessible from any page.

## Mock Data Created

### FAQ Mock Data (`src/lib/mocks/faq.ts`)

- 15 questions covering common customer inquiries
- Organized by category with sort order
- Easy to extend with more questions

### Enhanced News Mock Data (`src/lib/mocks/news.ts`)

- **Updated:** 4 realistic news posts with:
  - Featured images (via Unsplash)
  - Author names (Sarah Mitchell, James Thompson)
  - Recent dates (November 2024)
  - Engaging content about products, processes, sourcing

**Sample Posts:**

1. "Introducing Our New Sourdough Varieties"
2. "Christmas Bake Sale Dates Announced"
3. "Behind the Scenes: A Day in Our Bakery"
4. "Supporting Local Flour Mills" (draft)

## Technical Implementation

### Schema Updates

Added to `NewsPost` type:

- `featured_image?: string` - URL for card/preview images
- `author?: string` - Display name for byline

### UI Components Installed

- `accordion` - For FAQ expandable questions
- `tabs` - For FAQ category filter

### Design Tokens

All components use centralized design system for:

- Typography scales
- Spacing and padding
- Colors and borders
- Hover effects and transitions

## File Structure

```
src/
├── app/(shop)/
│   ├── news/
│   │   └── page.tsx          # News listing page
│   └── faq/
│       └── page.tsx           # FAQ page with accordion
├── components/
│   ├── recent-news.tsx        # Homepage news preview
│   ├── navbar.tsx             # Updated with News/FAQ links
│   └── ui/
│       ├── accordion.tsx      # Shadcn accordion component
│       └── tabs.tsx           # Shadcn tabs component
└── lib/
    ├── mocks/
    │   ├── faq.ts             # NEW: FAQ mock data
    │   └── news.ts            # UPDATED: Enhanced with images/authors
    └── validators/
        └── news.ts            # UPDATED: Added featured_image, author
```

## Try It Out

1. **News Page**: Visit http://localhost:3001/news

   - See 3 published news posts in grid layout
   - Click any post to view details (detail page to be built in Phase 4)

2. **FAQ Page**: Visit http://localhost:3001/faq

   - Click category tabs to filter questions
   - Click questions to expand/collapse answers
   - Try "Contact Us" button at bottom

3. **Homepage**: Visit http://localhost:3001
   - Scroll down past the CTA section
   - See "Latest News" section with 3 recent posts
   - Click "View All News" to go to news page

## Next Steps (Phase 4)

1. **News Detail Page** - Create `/news/[slug]/page.tsx` for full articles
2. **News Admin** - Build admin interface for creating/editing news posts
3. **Rich Text Editor** - For news content editing
4. **Search/Filter** - Add search functionality to news page
5. **Newsletter Signup** - Capture emails for news updates
6. **RSS Feed** - Generate RSS for news subscribers

## E-Commerce Best Practices Applied

✅ **Content Marketing**: News builds brand trust and drives organic traffic  
✅ **Customer Support**: FAQs reduce support burden and improve UX
✅ **Engagement**: Recent news on homepage keeps content fresh  
✅ **SEO**: Dedicated pages for news and FAQ improve search rankings  
✅ **Navigation**: Easy access via main navbar
