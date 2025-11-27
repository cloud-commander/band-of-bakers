# Band of Bakers - Features Implementation Guide

This document provides specifications for the advanced features available in Band of Bakers, including implementation requirements and customer/admin touchpoints.

---

## Voucher Code System

### Customer Experience

**At Checkout:**

- Text input field for voucher/discount code
- "Apply Code" button
- Display applied voucher details:
  - Voucher name
  - Discount amount or percentage
  - Original total, discount amount, new total
- "Remove Code" option to clear voucher
- Error message if code is invalid/expired
- Success message when code applied

**Features:**

- Single-use or multi-use codes
- Product-specific or category-wide discounts
- Percentage or fixed amount discounts
- Minimum order value requirements
- Expiration dates enforced
- Usage limits per customer
- Stack multiple vouchers (if enabled)

### Admin Experience

See `ADMIN_UX_GUIDE.md` - Voucher Management section

---

## Wishlist/Favorites

### Customer Experience

**On Product Pages:**

- Heart icon to add/remove from wishlist
- Quick visual indicator if product is in wishlist
- Notifications when wishlist items are available

**Account Dashboard:**

- View all saved products at `/account/wishlist`
- Product images, names, prices
- Availability status for next bake sale
- Add to cart directly from wishlist
- Remove items
- Sort by date added, price, etc.

**Features:**

- Share wishlist with friends (shareable link)
- Organize items into custom collections
- Get notified when items are back in stock
- Recipients can view and purchase from shared wishlist
- Gift functionality (send wishlist items as gifts)

---

## Email Reminders & Notifications

### Customer Experience

**Reminder Types:**

- Automatic email reminders before order cutoffs
- Email notifications for subscription deliveries
- News and events email subscription
- Marketing opt-in/opt-out preferences
- Customizable notification frequency
- Unsubscribe links in all emails

**Notification Preferences at `/account/newsletter`:**

- Email subscription toggle
- Newsletter types (weekly digest, offers, news, recipes, announcements)
- Email frequency (Weekly, Monthly)
- Preferred day/time for emails
- View past newsletters

---

## Analytics Dashboard for Customers

### Features

**Order History Insights:**

- Total orders and spending
- Average order value
- Orders by bake sale date
- Spending by category (Breads, Pastries, Cakes, Cookies)
- Most frequently ordered products
- Seasonal trends

**Purchase Behavior:**

- Favorite products (most ordered)
- Favorite fulfillment method (Collection vs. Delivery)
- Average items per order
- Repeat purchase rate

**Delivery Preferences:**

- Collection vs. Delivery preference ratio
- Preferred fulfillment dates
- Successful delivery rate
- Cancellation history

**Charts & Visualizations:**

- Line chart: Spending over time
- Pie chart: Spending by category
- Bar chart: Top 10 products
- Calendar heatmap: Order frequency by date

**Export Options:**

- Download order history as CSV
- Download analytics report as PDF
- Print analytics dashboard

### Implementation Requirements

- Aggregated customer order data
- Chart rendering library (Chart.js, D3.js, or similar)
- Export functionality (CSV, PDF)
- Performance optimization for large datasets

---

## Social Media Integration

### Customer-Facing Features

**Product Sharing:**

- Share button on product page
- Share to: Facebook, Instagram, Twitter, Pinterest, WhatsApp
- Pre-filled message with product name and link
- Customizable share message

**Order Sharing:**

- Share order summary with friends
- Generate unique shareable link
- Recipients can view what you ordered
- "Add similar items to my cart" option for recipients

**News & Events:**

- Share posts to social media
- Social media buttons on article pages
- User-generated hashtags for bakery
- Instagram feed integration on homepage
- Behind-the-scenes content from social channels

**Social Proof:**

- Instagram feed widget showing bakery posts
- Customer testimonials from social media

- Social sharing counts on popular items

**Authentication:**

- Social login options (Google)
- One-click signup/login with social account
- Auto-fill profile information from social accounts
- Link social accounts to existing profiles

### Implementation Requirements

- Social sharing APIs (Open Graph, Share URLs)
- Social login integration (OAuth)
- Instagram API integration for feed widget
- Shareable link generation
- Social media button components

---

## Social Login (Google)

### Customer Experience

**During Authentication:**

- Social login buttons on signup/login page
- One-click authentication with social account
- Auto-fill profile information (name, email, profile picture)
- Option to link social accounts to existing profiles

**Account Management:**

- Link/unlink social accounts in profile settings
- Use social account as alternate login method
- Manage connected social apps

### Implementation Requirements

- Google Identity Platform integration (email/password, Google social login)
- Account linking logic
- Social profile data mapping
- Secure token storage
- Session management

---

## Shared/Referral Links

### Features

**Shareable Wishlist:**

- Generate unique URL for wishlist
- Friends can view items without logging in
- Friends can add items to their own cart
- Sender can see who clicked their link

**Shared Orders:**

- Share order summary with friends
- View what specific items were ordered
- "Add similar items to cart" functionality
- Sender can track clicks

**Referral Program:**

- Each customer gets unique referral code
- Share code with friends
- Friends get discount on first order
- Track referral performance

### Implementation Requirements

- URL slug generation for sharing
- Referral code generation and tracking
- Click tracking and analytics
- Discount application for referred customers
- Referral reward logic

---

## Advanced Features - Technical Considerations

### Database Requirements

All features require extended database schema with tables for:

- `vouchers` - Discount codes
- `voucher_usage` - Track code redemptions
- `wishlists` - Saved product lists
- `wishlist_items` - Individual saved products
- `newsletters` - Email subscription tracking
- `social_accounts` - Linked social media accounts

### API Endpoints Needed

- `POST /api/vouchers/validate` - Check voucher validity
- `POST /api/vouchers/apply` - Apply voucher to order
- `POST /api/wishlist` - Add/remove items
- `GET /api/wishlist` - Get customer's wishlist
- `GET /api/analytics` - Customer analytics data
- `POST /api/newsletters/subscribe` - Subscribe to newsletter
- `POST /api/auth/social/:provider` - Social login
- `POST /api/share/link/:type` - Generate share links

### State Management

Features use Zustand stores for:

- Voucher state (applied codes)
- Wishlist state (saved items)
- User preferences (newsletter, notifications)
- Social account links

### Email Infrastructure

Requires email service integration (SendGrid, AWS SES, etc.) for:

- Order reminders
- Subscription reminders
- Newsletter campaigns
- Transactional emails

---

## Implementation Priority

### Phase 1 (Core)

- Voucher system
- Wishlist/Favorites
- Basic email reminders

### Phase 2 (Engagement)

- Analytics dashboard
- Social login
- Sharing/Referrals

---

## Testing Considerations

- Voucher validation logic (expiration, usage limits, applicability)
- Email reminder scheduling and delivery
- Newsletter unsubscribe functionality
- Social login account linking
- Share link expiration and access control
