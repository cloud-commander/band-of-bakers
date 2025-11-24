# Band of Bakers - Customer User Experience Journey

## Overview

The Band of Bakers website is an artisan bakery e-commerce platform with a unique **bake sale date-based purchasing model**. Unlike traditional bakeries, customers must select an upcoming bake sale date before adding items to their cart. This ensures freshness and helps the bakery manage inventory and production schedules.

---

## 🚀 First-Time Visitor Journey

### Stage 1: Discovery & Orientation

**Entry Point:** Homepage (`/`)

**What They See:**

- Prominent hero section showcasing the bakery brand
- A dynamic carousel component showing next bake sale dates
- "Customer Favorites" section featuring bestselling products
- Trust indicators (ratings, reviews, testimonials)
- Category grid showing product types (Breads, Pastries, Cakes, Cookies)
- **Latest News & Upcoming Events** section with recent posts
- Call-to-action to explore products

**User Actions:**

- Browse featured products
- Learn about the bakery
- Explore product categories
- Understand brand values and story

**Key Elements:**

- Dynamic product cards with hover effects
- Product images, names, prices
- Star ratings and review counts
- "Quick Add" buttons (disabled with informational toast)

---

### Stage 2: Product Exploration

**Entry Point:** Products Page (`/products`)

**Page Layout (Top to Bottom):**

1. **Header**

   - Large title ("All Products")
   - Tagline about fresh-baked daily

2. **Category Filter**

   - Buttons: All, Breads, Pastries, Cakes, Cookies
   - Current selection highlighted in rust color
   - Clicking filters products by category

3. **Bake Sale Date Filter**

   - Shows all upcoming bake sale dates
   - Formatted as "MMM d" (e.g., "Dec 14", "Dec 21")
   - Auto-selects first available date
   - Current selection highlighted in rust color
   - Allows users to browse what's available for different dates

4. **Product Grid**
   - Responsive layout (1 col mobile, 2-3 cols tablet, 4 cols desktop)
   - Product cards with images, names, categories, prices
   - Star ratings and review counts
   - "Quick Add" buttons

**User Behavior:**

- Filters by category of interest
- Views available bake sale dates
- Browses products available for selected date
- Clicks on product card to view details (navigates to product page)
- Sees "Quick Add" error if they click button: "Please select a bake sale date from the product details page"

---

### Stage 3: Product Details & Bake Sale Selection

**Entry Point:** Product Detail Page (`/products/[id]`)

**Page Sections:**

1. **Product Information**

   - High-quality product image
   - Product name and description
   - Price per unit
   - Category badge
   - **Wishlist/Favorites Button** (heart icon to add/remove)
   - **Social Share Buttons** (Facebook, Instagram, Twitter, Pinterest, WhatsApp)
   - Allows customers to share product with friends

2. **Bake Sale Date Selector** (CRITICAL)

   - Label: "Select a Bake Sale Date"
   - Interactive buttons for each available date
   - Shows: Date (e.g., "December 14, 2024")
   - Shows: Order cutoff (e.g., "Order by: Dec 13, 2024 10:00 AM")
   - Auto-selects first available date
   - Selected date highlighted in primary color
   - User MUST select a date to proceed

3. **Fulfillment Method Selector**

   - Options: Collection (🏪) or Delivery (🚚)
   - Only shows enabled methods from admin settings
   - Auto-selects if only one method available
   - Required to add to cart

4. **Quantity Selector**

   - Minus/Plus buttons
   - Current quantity display
   - Minimum quantity: 1

5. **Add to Cart Button**

   - **DISABLED** until bake sale date is selected
   - Text shows state:
     - "Select a Bake Sale Date" (when no date selected)
     - "Add to Cart - £X.XX" (when ready)
   - Shows running total price
   - Each order can only contain items for one bake sale date at a time

6. **Bake Sale Information Panel**
   - Appears after date selection
   - Shows selected date
   - Shows bake sale location (e.g., "Station Road, Cressage")
   - Shows order cutoff time
   - Shows fulfillment method (Collection or Delivery)
   - Blue information box for visibility

**User Workflow:**

1. Arrives on product page
2. Sees bake sale date selector with auto-selected date
3. Reviews fulfillment methods and selects preferred option
4. Adjusts quantity as needed
5. Clicks "Add to Cart" button (now enabled)
6. Sees success toast: "Added [Product Name] to cart"
7. Can continue shopping or proceed to checkout

**Key Insight:** The bake sale date is THE critical decision point. All other selections are secondary.

---

## 🛒 Shopping Cart Experience

**Entry Point:** Cart Button (Header) or Automatic on Add

**Cart Display:**

- Side drawer/panel that slides in from the side
- Shows all items grouped by bake sale date
- Each group shows:
  - Date, location, and fulfillment method badge (🏪 Collection or 🚚 Delivery)
  - "Ready for [Collection/Delivery] on [Date] at [Location]"
  - Countdown timer to order cutoff
  - Item count and subtotal for that group

**For Each Item:**

- Product image
- Product name
- Fulfillment method for that item's date
- Quantity with +/- buttons
- Price per unit and line total
- Remove button

**Cart Totals:**

- Subtotal (all items)
- Tax (if enabled)
- Shipping (if applicable)
- Any discounts
- Final total

**Actions:**

- Continue Shopping (closes cart, returns to browsing)
- Proceed to Checkout (navigates to checkout flow)
- Update quantities on the fly
- Remove items

**Important:** Items are automatically grouped by bake sale date. This visual grouping helps users understand that:

- They'll receive items for different dates at different times
- Each date has its own cutoff
- They may have multiple orders to pay for

---

## 💳 Checkout Experience

**Entry Point:** "Proceed to Checkout" button from cart

### Step 1: Order Review

- Summary of all items grouped by bake sale date
- Shows what will be fulfilled on each date
- Shows bake sale location for each date
- Shows fulfillment method for each group
- Running total calculation

### Step 1b: Voucher Code (Optional)

**Discount Code Section:**

- Text input field for voucher/discount code
- "Apply Code" button
- Display applied voucher details:
  - Voucher name
  - Discount amount or percentage
  - Original total, discount amount, new total
- "Remove Code" option to clear voucher
- Error message if code is invalid/expired
- Success message when code applied

### Step 2: Shipping Address

- If logged in: option to use saved addresses or enter new
- Form fields: Name, Street, City, Postcode, Country
- Validation before proceeding
- Save address option for future orders

### Step 3: Billing Address

- Same as shipping or different option
- Same address form if different address needed

### Step 4: Payment Method

- Supported payment options displayed
- Secure payment processing
- Order total confirmation
- Display loyalty points that will be earned

### Step 5: Final Order Review

- Complete order summary
- All items with quantities and prices
- Fulfillment dates, locations, and methods
- Shipping address confirmation
- Applied voucher discount
- Total amount to be charged
- "Place Order" button

**Order Validation:**

- System checks that no bake sale cutoff times have passed
- Validates item availability for each selected date
- Prevents checkout if items are no longer available
- Shows clear error messages if issues found

---

## 📧 Order Confirmation

**After Successful Payment:**

1. **Confirmation Page**

   - Order number
   - Order date and time
   - Total amount paid
   - Breakdown by bake sale date
   - Bake sale locations for each date
   - Expected delivery/collection dates

2. **Confirmation Email**
   - Order summary
   - What items to expect on each date
   - Bake sale locations for each date
   - Collection/delivery instructions
   - Customer service contact information

---

## 🏪 Fulfillment Scenarios

### Collection-Only (Delivery Disabled)

**When admin disables delivery and only Collection is available:**

**Product Details Page:**

- **Fulfillment Method Selector** shows only Collection (🏪)
- Collection is **auto-selected** (no customer choice needed)
- Selector displays: "Collection Available"
- No delivery option visible

**Shopping Cart:**

- Badge shows: **🏪 Collection**
- Text: "Ready for Collection on [Date]"
- Shows collection location (if configured)
- No delivery address entry

**Checkout Experience:**

- **Step 1:** Order Review (items grouped by date)
- **Step 1b:** Voucher Code (optional)
- **Step 2:** Skipped - No shipping address needed
  - OR Shows collection location information instead
  - Customer may only need to confirm collection details
- **Step 3:** Billing Address (only if different from registration)
- **Step 4:** Payment Method
- **Step 5:** Final Review
  - Shows: Collection location, collection date, collection hours
  - Shows: Cutoff time for order

**Confirmation:**

- Collection location prominently displayed
- Collection date and hours
- Instructions: When/where to pick up
- Contact number for collection location
- No delivery tracking needed

---

### Delivery-Only (Collection Disabled)

**When admin disables collection and only Delivery is available:**

**Product Details Page:**

- **Fulfillment Method Selector** shows only Delivery (🚚)
- Delivery is **auto-selected** (no customer choice needed)
- Selector displays: "Delivery Available"
- No collection option visible

**Shopping Cart:**

- Badge shows: **🚚 Delivery**
- Text: "Ready for Delivery on [Date]"
- Shows estimated delivery window
- No collection location info

**Checkout Experience:**

- **Step 1:** Order Review (items grouped by date)
- **Step 1b:** Voucher Code (optional)
- **Step 2:** Shipping Address (REQUIRED)
  - Customer must enter or select delivery address
  - Form validates postcode for delivery zone
  - Shows delivery fee for selected address
- **Step 3:** Billing Address
  - Option: Same as shipping or different
- **Step 4:** Payment Method
- **Step 5:** Final Review
  - Shows: Delivery address, expected delivery date, delivery fee
  - Shows: Tracking information (if available)
  - Shows: Any special delivery instructions

**Confirmation:**

- Delivery address clearly shown
- Expected delivery date/window
- Delivery tracking info (if available)
- Estimated delivery time
- Special delivery instructions (if any)
- No collection location info

---

### Both Methods Available (Default)

**When admin enables both Collection and Delivery:**

**Product Details Page:**

- **Fulfillment Method Selector** shows both options
  - Collection (🏪)
  - Delivery (🚚)
- Customer MUST choose one
- Button text changes based on selection:
  - "Select Collection" / "Collection Selected ✓"
  - "Select Delivery" / "Delivery Selected ✓"

**Shopping Cart:**

- Each item shows its fulfillment method
- Grouping shows mixed methods clearly
- Example:
  - Group 1: Croissants (Dec 14 - 🏪 Collection)
  - Group 2: Bread (Dec 21 - 🚚 Delivery)
- Subtotals calculated per method (delivery fee only on delivery items)

**Checkout Experience:**

- **Step 1:** Order Review (shows both methods)
- **Step 1b:** Voucher Code (optional)
- **Step 2:** Shipping Address
  - If collection items only: Hidden or collection info shown
  - If delivery items: Address form displayed and required
  - Mixed order: Address form required for delivery items
- **Step 3:** Billing Address
- **Step 4:** Payment Method
- **Step 5:** Final Review
  - Shows fulfillment method for each date group
  - Shows address for delivery, location for collection
  - Separate fees/charges per method

**Confirmation:**

- Each order/group shows its fulfillment method
- Collection items: Show location, hours, pickup instructions
- Delivery items: Show address, tracking, delivery window
- Clear separation of fulfillment details by method

---

## 👤 Authenticated User Journey

### Account Dashboard (`/account`)

**For Logged-In Users Only**

#### Orders History (`/account/orders`)

- Table of all past orders
- Grouped by bake sale date
- Shows order number, status, total, date
- Status badges: Pending, Processing, Shipped, Delivered, Cancelled, Refunded
- Click to view full order details

#### Order Details View

- Complete order information
- Items with quantities and prices
- Bake sale date for each group
- Fulfillment method (Collection/Delivery)
- Cutoff countdown (if order still active)
- Order status timeline
- Shipping address
- Billing address
- Payment method used
- Continue Shopping button

#### Profile (`/account/profile`)

- View account information
- Edit profile details
- Change password
- Account preferences

#### Saved Addresses (`/account/addresses`)

- Manage multiple shipping addresses
- Add new address
- Edit existing addresses
- Delete addresses
- Set default address

#### Wishlist/Favorites (`/account/wishlist`)

**Saved Items Page:**

- View all saved products
- Product images, names, prices
- Availability status for next bake sale
- Add to cart directly from wishlist
- Remove items
- Sort by date added, price, etc.

**Features:**

- Heart icon on product pages to add/remove from wishlist
- Quick visual indicator if product is in wishlist
- Notifications when wishlist items are available
- Share wishlist with friends (shareable link)
- Organize items into custom collections

#### Loyalty Program (`/account/loyalty`)

**Rewards Dashboard:**

- Current points balance
- Loyalty tier (Bronze, Silver, Gold)
- Progress toward next tier
- Points earned this month
- Lifetime points total
- Exclusive tier benefits

**Features:**

- Earn 1 point per £1 spent
- Bonus points on special promotions
- Birthday month bonus points
- Referral rewards (earn points for inviting friends)
- Tier-based perks:
  - Bronze: 5% bonus points
  - Silver: 10% bonus points + early access to sales
  - Gold: 15% bonus points + exclusive products
- Redeem points at checkout for discounts
- Points never expire

**Point Redemption:**

- 100 points = £5 discount
- 500 points = £30 discount
- 1000 points = £75 discount
- Apply at checkout

#### Subscriptions (`/account/subscriptions`)

**Active Subscriptions:**

- List of recurring bake sale subscriptions
- Frequency display (weekly, bi-weekly, monthly)
- Next delivery date
- Products included
- Cost per delivery

**Subscription Management:**

- View upcoming deliveries (next 12 months)
- Modify products for next delivery
- Skip next delivery (if needed)
- Pause subscription temporarily
- Change frequency
- Cancel anytime with no penalties

**Email Reminders:**

- Automatic reminder email before each delivery
- Reminder sent 3 days before cutoff
- Option to customize products before cutoff
- Can skip or pause from email

**Subscription Dashboard:**

- Total spent on subscriptions
- Deliveries completed
- Estimated next delivery cost
- Savings vs. one-time purchases

#### Analytics Dashboard (`/account/analytics`)

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
- Loyalty tier progress

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

#### Newsletter Preferences (`/account/newsletter`)

**Subscription Management:**

- Email subscription toggle
- Subscription status (Active/Inactive)
- Last newsletter received date

**Newsletter Types:**

- [ ] Weekly digest of new products
- [ ] Special offers and promotions
- [ ] News and events updates
- [ ] Recipe ideas and tips
- [ ] Loyalty program offers
- [ ] Admin announcements

**Email Frequency:**

- Choose frequency: Daily, Weekly, Monthly
- Select preferred day/time for emails
- Unsubscribe from all with one click

**Newsletter Preview:**

- View past newsletters
- See what you'll receive
- Archive of all newsletters

---

## 📰 News & Events

### News & Events Page (`/news-events`)

**Public Page for Reading Latest News and Events**

**Page Layout:**

1. **Header**

   - Page title: "News & Events"
   - Tagline: "Stay updated with the latest from Band of Bakers"

2. **Filter Tabs**

   - All Posts (default)
   - News only
   - Events only
   - Upcoming Events (if applicable)

3. **News & Events Feed**

   - Chronologically ordered (newest first)
   - Each post shows:
     - Featured image (if available)
     - Type badge (News or Event)
     - Title (clickable)
     - Excerpt
     - Publication date
     - For events: Event date and location
     - Author name

4. **Post Detail View** (Click on title)

   - Full post content
   - Featured image
   - Post type, date, and author
   - For events: Prominent event date/location box
   - Related posts sidebar
   - Share buttons
   - Back to feed link

5. **Pagination**
   - Shows 10 posts per page
   - Previous/Next navigation
   - "Load More" button

**User Actions:**

- Browse latest news
- Discover upcoming events
- Read full articles
- Share posts on social media
- Subscribe to updates (if enabled)

### News & Events on Homepage

**Featured News Section:**

- Located above or below featured products
- Shows 3 most recent published posts
- Card layout with image, title, excerpt
- "View All News" link to full news page
- Auto-refreshes when new posts are published

**Upcoming Events Section:**

- Shows next 3 upcoming events
- Prominent event date and location
- Event title and excerpt
- "Learn More" link to full details
- Sorted by event date (soonest first)

---

## 🔐 Authentication Flow

### First-Time Checkout

**Option 1: Guest Checkout**

- Enter email at checkout
- Complete order without creating account
- Account optional

**Option 2: Create Account**

- Sign up during checkout
- Email verification (if enabled)
- Password creation
- Save addresses and preferences

### Login

- Email and password
- "Remember me" option
- Password reset link if needed
- **Social Login Options** (Google, Facebook, Instagram)
  - One-click signup/login with social account
  - Auto-fill profile information from social accounts
  - Link social accounts to existing profiles

### After Login

- Faster checkout (addresses pre-filled)
- Order history available
- Saved preferences
- Personalized recommendations
- Loyalty points and rewards accessible
- Subscription management available
- Wishlist synced

---

## 🎯 Special Features & Flows

### Social Media Integration

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

**Wishlist Sharing:**

- Generate shareable wishlist link
- Friends can view your saved items
- Friends can purchase items from your wishlist
- Gift functionality (send wishlist items as gifts)

**News & Events:**

- Share posts to social media
- Social media buttons on article pages
- User-generated hashtags for bakery
- Instagram feed integration on homepage
- Behind-the-scenes content from social channels

**Social Proof:**

- Instagram feed widget showing bakery posts
- Customer testimonials from social media
- User reviews and ratings displayed
- Social sharing counts on popular items

---

### Bake Sale Cutoff Handling

**Before Cutoff:**

- User can add items to cart normally
- Countdown timer shows time remaining
- Clear cutoff time displayed

**After Cutoff:**

- Items become unavailable for that date
- Cannot add new items for that date
- Existing items show as "unavailable" in cart with warning
- User prompted to select different date
- Automatic removal on checkout if cutoff passed

---

### Multiple Bake Dates in One Cart

**User Scenario:** Wants croissants on Dec 14 and bread on Dec 21

**Experience:**

1. Add croissants for Dec 14
2. Go back to products, select Dec 21
3. Add bread for Dec 21
4. Cart now shows two groups:
   - Group 1: Croissants (Dec 14 - Collection)
   - Group 2: Bread (Dec 21 - Delivery)
5. Checkout creates separate orders automatically
6. Pay once for combined total
7. Receive items on respective dates

---

### Quantity Availability

- If product runs out for selected date
- User sees "Limited" or "Sold Out" badge
- Cannot add if fully sold
- Encouraged to select different date
- Can add to waitlist (if feature enabled)

---

## 📱 Mobile Experience

**Responsive Design:**

- Stacked layout on mobile
- Touch-friendly buttons (min 44px)
- Readable text sizes
- Mobile-optimized images

**Key Mobile Features:**

- Quick add from featured products (shows toast error)
- Product filters (category and date) stack vertically
- Cart drawer slides from side (full width on mobile)
- Checkout form optimized for mobile entry
- Address autocomplete to reduce typing

---

## 🎨 Design & UX Principles

### Visual Hierarchy

- Hero images on product cards
- Clear pricing and CTAs
- Status indicators (badges, colors)
- Countdown timers in prominent positions

### Color Coding

- **Rust (Primary):** Selected filters, active states, primary actions
- **Blue:** Information panels, bake sale details, important dates
- **Green:** Success messages, order completion
- **Red:** Errors, warnings, sold out states
- **Gray:** Disabled states, inactive content

### Loading States

- Skeleton screens for initial page load
- Spinners during data fetch
- Progressive enhancement (show content as it loads)

### Error Handling

- Clear, specific error messages
- Toast notifications for actions (success/error)
- Inline form validation
- Helpful suggestions for recovery

### Feedback & Confirmation

- Toast messages for actions (Add to cart, Order placed)
- Loading states during processing
- Confirmation dialogs for destructive actions
- Success pages after major actions

---

## 🔐 Security & Trust

### For Customers

- SSL/HTTPS throughout
- Secure payment processing
- Privacy policy visible
- Trust badges and certifications
- No account required for checkout

---

## 📈 Conversion Points

### Metrics Tracked

1. **Browsing:** Homepage → Products viewed
2. **Selection:** Bake sale date selected
3. **Cart:** Product added to cart
4. **Checkout:** Cart → Checkout started
5. **Purchase:** Order completed
6. **Repeat:** Customers making additional purchases

### Optimization Areas

- Clear date selection flow (currently working)
- Reduced friction in checkout
- Trust indicators (reviews, ratings)
- Mobile optimization
- Email recovery for abandoned carts

---

## 🌟 Key Differentiators

### What Makes Band of Bakers Unique

1. **Bake Sale Date Model**

   - Ensures freshness
   - Clear communication about delivery dates
   - Helps with production planning
   - Creates urgency (cutoff times)

2. **News & Events Communication**

   - Keep customers updated with latest news
   - Announce upcoming bake sales and special events
   - Share recipes, tips, and bakery stories
   - Build community engagement

3. **Grouped Fulfillment**

   - Multiple items for different dates in one cart
   - Automatic order separation
   - Clear timeline for customer

4. **Transparent Timeline**

   - Order cutoff clearly shown
   - Fulfillment date known upfront
   - Collection/Delivery options
   - Countdown to cutoff

5. **Category Organization**
   - Easy browsing by product type
   - Bake sale date awareness
   - Fulfillment method transparency

---

## 📚 User Flows Summary

### First-Time Visitor

```
Homepage → Featured Products → Browse Category →
Select Bake Date → View Product Details →
Select Date & Fulfillment → Add to Cart →
Checkout (Guest or New Account) → Order Confirmation
```

### Returning Customer

```
Homepage → Products Page → Select Date Filter →
Browse & Select Product → Add to Cart →
Auto-filled Checkout → Place Order →
Account Dashboard to View Previous Orders
```

---

## ✨ Available Customer Features

### Voucher Code System

- Apply discount codes at checkout
- See discount amount before paying
- Remove codes if needed
- Track which offers worked best

### Wishlist/Favorites

- Save products to personal wishlist
- Add/remove items with one click
- View wishlist in account dashboard
- Share wishlist with others
- Get notified when items are back in stock
- Organize items into collections

### Subscription Box (Recurring Orders)

- Sign up for recurring deliveries
- Choose frequency (weekly, bi-weekly, monthly)
- Select products for each delivery
- Automatic ordering on schedule
- Email reminders before each delivery
- Skip or pause subscriptions anytime
- Cancel anytime with no penalties
- Manage subscription in account dashboard
- Customize items for upcoming deliveries

### Email Reminders & Notifications

- Automatic email reminders before order cutoffs
- Email notifications for subscription deliveries
- News and events email subscription
- Marketing opt-in/opt-out preferences
- Customizable notification frequency
- Unsubscribe links in all emails

### Loyalty Program / Rewards

- Earn points on every purchase
- Accumulate points toward discounts
- Tier-based rewards (Bronze, Silver, Gold)
- Exclusive perks for loyalty members
- Birthday rewards and special offers
- Redeem points at checkout
- Track rewards balance in account
- Referral bonuses for inviting friends

### Analytics Dashboard

- View order history and trends
- Spending analysis by category
- Purchase frequency insights
- Favorite products tracking
- Seasonal purchasing patterns
- Delivery/collection preferences
- Export order data

### Social Media Integration

- Share products on social platforms
- Share orders and wishlist
- Social login options (Google, Facebook)
- Share news/events on social media
- Instagram integration for bakery photos
- Facebook Messenger customer support

### Email Newsletter & Updates

- Subscribe to news and events
- Weekly digest of new products
- Special offers and promotions
- Recipe ideas using products
- Behind-the-scenes bakery stories
- Event announcements
- Manage subscription preferences
- View past newsletters

---

## 📞 Support & Help

### Customer Support

**Within App:**

- FAQ section (dedicated `/faq` page)
- Live chat (if enabled)
- Contact form
- Help with order tracking

**Account Help:**

- Password reset
- Account recovery
- Profile update guidance
- Address management help

---

## ❓ FAQ Page (`/faq`)

**Purpose:** Help customers find answers to common questions about shopping, bake sale dates, orders, and policies.

### Page Structure

**Header Section:**

- Page title: "Frequently Asked Questions"
- Subtitle: "Find answers to common questions about Band of Bakers"
- Search bar to filter FAQs by keyword
- Category tabs to jump to sections

### FAQ Categories

#### 1. **About Bake Sales & Ordering**

- Q: What is a bake sale date?
  A: Explanation of the bake sale date model, why it ensures freshness, how orders are organized by date.

- Q: Why do I need to select a bake sale date before adding items to my cart?
  A: Clarifies the requirement, explains benefits (freshness, production planning, clear delivery dates).

- Q: What happens if I miss the order cutoff?
  A: Explains cutoff time importance, shows how to identify cutoff times, suggests selecting a different date.

- Q: Can I order items for multiple bake sale dates in one purchase?
  A: Yes, explains how items are grouped in cart, shows separate orders are created, payment is combined.

- Q: How do I know what items are available for my selected date?
  A: Explains availability display on product page, shows how to change dates to see different products.

#### 2. **Checkout & Payment**

- Q: Do you offer guest checkout?
  A: Yes, explains no account required, but can create account for future convenience.

- Q: What payment methods do you accept?
  A: Lists all accepted payment methods (Stripe, cards, digital wallets, etc.).

- Q: Is my payment information secure?
  A: Assures SSL encryption, PCI compliance, no storage of full card details.

- Q: Do you charge tax?
  A: Explains tax calculation method, when tax applies, how it's shown at checkout.

- Q: What are your shipping/collection costs?
  A: Explains collection is free, delivery costs based on distance/method, free delivery threshold if applicable.

#### 3. **Orders & Fulfillment**

- Q: How will I receive my order?
  A: Explains collection (pickup at location) vs. delivery (home delivery), shows how to select method.

- Q: What are the collection hours?
  A: Lists collection location and hours, explains how to arrange pickup time.

- Q: How long does delivery take?
  A: Explains delivery window for each bake sale date, shows how to check in account.

- Q: Can I cancel or modify my order after placing it?
  A: Explains timeframe for cancellations (before cutoff), how to contact support, refund policy.

- Q: When will I receive my order confirmation?
  A: Explains email sent immediately, shows what to expect in email, how to track order.

- Q: How can I track my order?
  A: Explains order tracking in account dashboard, status updates, delivery tracking for shipped orders.

#### 4. **Products & Availability**

- Q: Are your products made fresh to order?
  A: Yes, explains baking process, delivery within days, why freshness matters.

- Q: Do you have vegan/gluten-free options?
  A: Directs to product filters, explains allergen information display.

- Q: What if a product is sold out?
  A: Explains waitlist feature (if available), suggests alternative products, shows when to check back.

- Q: Can I pre-order items?
  A: Explains bake sale model serves as pre-order system, can add to cart up to cutoff.

#### 5. **Account & Profile**

- Q: Do I need an account to purchase?
  A: No, guest checkout available, but account offers benefits (saved addresses, order history).

- Q: How do I reset my password?
  A: Provides login page link, explains password reset email process, troubleshooting tips.

- Q: How do I delete my account?
  A: Explains how to request account deletion, data retention policy, support contact.

- Q: Can I save multiple delivery addresses?
  A: Yes, explains address management in account, how to set default address.

#### 6. **Returns & Refunds**

- Q: What is your return policy?
  A: Explains policy for damaged/incorrect items, timeframe for returns, how to initiate.

- Q: How long does a refund take?
  A: Explains refund processing time, how to track refund, where money goes.

- Q: What if my order arrives damaged?
  A: Explains process: document damage, contact support with photos, refund/replacement offered.

- Q: Can I exchange a product?
  A: Explains exchange process, timeframe, how to arrange.

#### 7. **Policies**

- Q: What is your privacy policy?
  A: Link to full privacy policy, summary of data collection and usage.

- Q: How do you use my personal information?
  A: Summary of data usage (orders, shipping, marketing with consent), link to detailed policy.

- Q: Do you share my information with third parties?
  A: Explains only shared for order fulfillment/payment, never sold, link to privacy policy.

- Q: How can I opt out of marketing emails?
  A: Explains unsubscribe link in emails, account preferences, how to manage communications.

#### 8. **Technical Issues**

- Q: The website isn't working properly. What should I do?
  A: Troubleshooting steps, browser requirements, how to clear cache, support contact.

- Q: I didn't receive my confirmation email.
  A: Explains to check spam, wait a few minutes, resend option, support contact.

- Q: I'm having trouble creating an account.
  A: Common issues and solutions, password requirements, support contact.

### Interactive Elements

**Expandable Q&A:**

- Each question is clickable/expandable
- Smooth animations when opening/closing
- Category tabs to jump to sections
- Search filters results in real-time
- "Was this helpful?" voting under each answer

**Contact Support:**

- "Didn't find your answer?" section at bottom
- Contact form link
- Live chat option
- Email address for support
- Response time expectations

---

## 🚀 Future Enhancements

**Potential Features:**

- Product reviews and ratings (customer-submitted)
- Pre-order deposits
- Gift cards
- Bulk ordering for events
- Custom orders (with extended lead time)
- Recipe suggestions based on purchases
- Event registration and RSVP system
- Photo gallery from past events
- User-generated content (customer stories)

---

## Summary

The Band of Bakers website creates a seamless experience for customers by centering everything around the **bake sale date concept**. This unique model ensures freshness, helps customers understand delivery timelines, and creates natural urgency through cutoff times.

For customers, the journey is intuitive: browse → select a date → choose products → add to cart → checkout. The system prevents confusion by requiring date selection upfront and clearly communicating cutoff times throughout.

The design emphasizes clarity, trust, and ease of use, creating a delightful experience for artisan bakery enthusiasts.

---

## 📚 Related Documentation

For comprehensive guidance on specific areas, refer to these dedicated guides:

- **[SEO_OPTIMIZATION_GUIDE.md](SEO_OPTIMIZATION_GUIDE.md)** - Complete SEO strategy including keyword research, technical SEO, schema markup, and monitoring
- **[WCAG_ACCESSIBILITY_GUIDE.md](WCAG_ACCESSIBILITY_GUIDE.md)** - WCAG 2.1 AA compliance guide with implementation checklists and testing procedures
- **[FEATURES_GUIDE.md](FEATURES_GUIDE.md)** - Feature specifications and implementation requirements
- **[ADMIN_UX_GUIDE.md](ADMIN_UX_GUIDE.md)** - Complete admin dashboard and management interface documentation
