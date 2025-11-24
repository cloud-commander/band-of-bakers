# Band of Bakers - Project Specification

**Version:** 1.0  
**Last Updated:** November 24, 2025  
**Status:** Planning Phase (Phase 0)  
**Geographic Scope:** United Kingdom Only

---

## Problem Statement

Traditional bakery e-commerce platforms operate on a continuous inventory model, which creates challenges for artisan bakeries:

- **Freshness concerns:** Products may sit in inventory for days
- **Waste management:** Unsold items lead to waste and lost revenue
- **Production planning:** Difficult to predict demand and manage batch production
- **Quality control:** Maintaining artisan quality at scale is challenging

**Band of Bakers** solves these problems with a **bake sale date-based purchasing model**, where customers order products for specific upcoming bake sale dates. This ensures:

- ✅ Maximum freshness (baked to order)
- ✅ Zero waste (production matches demand)
- ✅ Predictable production schedules
- ✅ Artisan quality maintained

---

## Target Users

### Primary Users (Customers)

**Demographics:**

- UK residents seeking fresh, artisan baked goods
- Age range: 25-65
- Value quality over convenience
- Willing to plan purchases in advance

**User Personas:**

1. **The Quality Seeker**

   - Wants the freshest possible baked goods
   - Willing to wait for specific bake dates
   - Values artisan craftsmanship
   - Typical order: £15-30 per bake sale

2. **The Planner**

   - Orders for events and gatherings
   - Plans purchases weeks in advance
   - Larger order volumes (£50+)
   - Appreciates predictable fulfillment dates

3. **The Regular**
   - Frequent customer (monthly orders)
   - Familiar with bake sale model
   - Prefers collection over delivery
   - Builds relationship with bakery

### Secondary Users (Administrators)

**Roles:**

1. **Owner**

   - Full system access
   - Business decisions and strategy
   - Financial oversight
   - User management

2. **Manager**

   - Operational management
   - Bake sale scheduling
   - Order fulfillment oversight
   - Customer service

3. **Staff**
   - Order processing
   - Inventory management
   - Customer communication
   - Limited administrative access

---

## MVP Features (Day One Launch)

### Core E-Commerce Features

#### 1. Product Catalog & Discovery ⭐ CRITICAL

**Must-Have:**

- Product listing with images, names, descriptions, prices
- Product detail pages with full specifications
- Product categories: Breads, Pastries, Cakes, Cookies
- Product variants (different sizes for same item)
- Search functionality (basic)
- Category filtering
- Product availability by bake sale date

**User Flow:**

```
Browse Products → Select Category → View Product Details →
Select Bake Sale Date → Choose Size (if applicable) →
Select Fulfillment Method → Add to Cart
```

#### 2. Bake Sale Date Selection ⭐ CRITICAL

**Must-Have:**

- Display all upcoming bake sale dates
- Show cutoff time for each date
- Show location for each date
- Auto-select first available date
- Prevent orders after cutoff
- Visual countdown to cutoff
- Date-specific product availability

**Business Rules:**

- Customers MUST select a bake sale date before adding to cart
- Each cart can contain items from multiple bake sale dates
- Each order can only have items from one bake sale date
- Separate orders are created for each bake sale date
- Orders are grouped by bake sale date at checkout
- Cutoff times are strictly enforced (no exceptions)

#### 3. Fulfillment Methods ⭐ CRITICAL

**Available Methods:**

1. **Collection** (Default)

   - Customer picks up at specified location
   - No delivery fee
   - Collection location shown per bake sale date
   - Collection hours specified

2. **Delivery**

   - Shipped to customer address
   - Delivery fee applies
   - Delivery address required at checkout
   - Estimated delivery window shown

3. **PayPal**

   - Standard PayPal checkout
   - Can be enabled/disabled by admin
   - Manual payment verification

4. **Bank Transfer**

   - Manual payment verification
   - Order held until payment confirmed
   - Can be enabled/disabled by admin

5. **Payment on Collection**
   - Pay when picking up order
   - **Default payment method**
   - Only available for Collection fulfillment

**Admin Controls:**

- Enable/disable each payment method globally
- Set delivery fees
- Configure collection locations
- Set collection hours

**Default Configuration:**

- Fulfillment method: Collection
- Payment method: Payment on Collection
- All other payment methods: Disabled (admin must enable)

#### 4. Shopping Cart ⭐ CRITICAL

**Must-Have:**

- Add/remove items
- Quantity adjustment
- Cart persistence (localStorage + database for logged-in users)
- Cart total calculation
- Items grouped by bake sale date
- Fulfillment method shown per date group
- Cutoff countdown per date group
- Clear indication of collection vs delivery items

**Validation:**

- Bake sale date required for all items
- Fulfillment method required for all items
- Prevent checkout if cutoff passed
- Validate item availability before checkout

#### 5. Checkout & Payments ⭐ CRITICAL

**Checkout Steps:**

1. **Order Review**

   - Items grouped by bake sale date
   - Fulfillment method per group
   - Subtotals per group
   - Total amount

2. **Voucher Code (Optional)**

   - Apply discount code
   - Show discount amount
   - Update totals

3. **Shipping Address** (if delivery items present)

   - Enter or select saved address
   - Validate UK postcode
   - Calculate delivery fee

4. **Billing Address**

   - Same as shipping or different
   - Required for all orders

5. **Payment Method**

   - Select from enabled payment methods:
     - Stripe (card payment)
     - PayPal
     - Bank Transfer
     - Payment on Collection (default)
   - Show payment instructions per method

6. **Final Review**
   - Complete order summary
   - Fulfillment details per date
   - Total amount breakdown
   - Place Order button

**Payment Processing:**

- Stripe integration for card payments
- PayPal integration
- Bank transfer instructions
- Payment on collection confirmation
- Automatic receipt generation
- Payment status tracking

#### 6. Order Management (Customer) ⭐ CRITICAL

**Must-Have:**

- Order history view
- Order details page
- Order status tracking
- Grouped by bake sale date
- Fulfillment method shown
- Collection/delivery instructions
- Order cancellation (before cutoff)
- Reorder functionality

**Order Statuses:**

- Pending (awaiting payment)
- Processing (payment confirmed)
- Ready for Collection / Dispatched
- Fulfilled / Delivered
- Cancelled
- Refunded

#### 7. Authentication & User Accounts ⭐ CRITICAL

**Authentication Methods:**

- Email/password signup and login
- Google OAuth (one-click signup)
- Secure session management (Cloudflare KV)
- Password reset flow
- Account verification emails

**User Account Features:**

- Profile management (name, email, phone)
- Saved addresses
- Order history
- Password change
- Account preferences
- Newsletter opt-in/opt-out

**Guest Checkout:**

- Optional account creation
- Email required for order confirmation
- Can create account after checkout

#### 8. Email Notifications ⭐ CRITICAL

**Transactional Emails (Resend):**

- Order confirmation (immediate after checkout)
- Payment receipt (success/failure)
- Order status updates (when admin changes status)
- Cancellation confirmation
- Password reset
- Account verification

**Email Requirements:**

- Professional templates
- Mobile-responsive
- Clear order details
- Fulfillment instructions
- Customer service contact info
- Unsubscribe option (for marketing emails)

#### 9. Admin Dashboard ⭐ CRITICAL

**Core Admin Features:**

**Bake Sale Management:**

- Create new bake sale dates
- Set cutoff times
- Assign locations
- Enable/disable dates
- View orders per date
- Mark dates as complete

**Product Management:**

- Add/edit/delete products
- Upload product images (Cloudflare Images)
- Set prices and descriptions
- Manage product categories
- Product variants (sizes)
- Set availability per bake sale date
- Bulk import from CSV

**Order Management:**

- View all orders
- Filter by date, status, customer
- Update order status
- Mark items as unavailable (auto-refund)
- View customer contact info
- Generate picking lists
- Print packing slips
- Send customer notifications

**Location Management:**

- Create/edit locations
- Set default location (Station Road, Cressage)
- Activate/deactivate locations
- Manage location details (address, postcode, hours)

**Payment Method Management:**

- Enable/disable Stripe
- Enable/disable PayPal
- Enable/disable Bank Transfer
- Enable/disable Payment on Collection
- Configure payment settings

**Fulfillment Method Management:**

- Enable/disable Collection
- Enable/disable Delivery
- Set delivery fees
- Configure collection locations

**Dashboard Metrics:**

- Total orders today
- Revenue today
- Orders by status breakdown
- Upcoming cutoff times
- Top products

#### 10. Voucher System

**Must-Have:**

- Create discount codes
- Percentage or fixed amount discounts
- Minimum order value requirements
- Usage limits (total and per customer)
- Expiration dates
- Single-use or multi-use codes
- Apply at checkout
- Track usage

**Admin Controls:**

- Create/edit/delete vouchers
- View usage statistics
- Deactivate vouchers
- Set applicability (all products or specific categories)

---

## Role-Based Access Control (RBAC)

### Permission Matrix

| Feature                | Owner | Manager | Staff | Customer                |
| ---------------------- | ----- | ------- | ----- | ----------------------- |
| **Products**           |
| View products          | ✅    | ✅      | ✅    | ✅                      |
| Create products        | ✅    | ✅      | ❌    | ❌                      |
| Edit products          | ✅    | ✅      | ✅    | ❌                      |
| Delete products        | ✅    | ✅      | ❌    | ❌                      |
| Bulk import            | ✅    | ✅      | ❌    | ❌                      |
| **Bake Sales**         |
| View bake sales        | ✅    | ✅      | ✅    | ✅                      |
| Create bake sales      | ✅    | ✅      | ❌    | ❌                      |
| Edit bake sales        | ✅    | ✅      | ❌    | ❌                      |
| Delete bake sales      | ✅    | ❌      | ❌    | ❌                      |
| **Orders**             |
| View all orders        | ✅    | ✅      | ✅    | ❌                      |
| View own orders        | ✅    | ✅      | ✅    | ✅                      |
| Update order status    | ✅    | ✅      | ✅    | ❌                      |
| Cancel orders          | ✅    | ✅      | ❌    | ✅ (own, before cutoff) |
| Refund orders          | ✅    | ✅      | ❌    | ❌                      |
| Mark items unavailable | ✅    | ✅      | ✅    | ❌                      |
| **Customers**          |
| View customer list     | ✅    | ✅      | ✅    | ❌                      |
| View customer details  | ✅    | ✅      | ✅    | ❌                      |
| Edit customer accounts | ✅    | ✅      | ❌    | ❌                      |
| Delete customers       | ✅    | ❌      | ❌    | ❌                      |
| **Vouchers**           |
| View vouchers          | ✅    | ✅      | ✅    | ❌                      |
| Create vouchers        | ✅    | ✅      | ❌    | ❌                      |
| Edit vouchers          | ✅    | ✅      | ❌    | ❌                      |
| Delete vouchers        | ✅    | ❌      | ❌    | ❌                      |
| **Settings**           |
| View settings          | ✅    | ✅      | ❌    | ❌                      |
| Edit settings          | ✅    | ❌      | ❌    | ❌                      |
| Manage users           | ✅    | ❌      | ❌    | ❌                      |
| Payment methods        | ✅    | ❌      | ❌    | ❌                      |
| Fulfillment methods    | ✅    | ❌      | ❌    | ❌                      |
| **News & Events**      |
| View posts             | ✅    | ✅      | ✅    | ✅                      |
| Create posts           | ✅    | ✅      | ❌    | ❌                      |
| Edit posts             | ✅    | ✅      | ❌    | ❌                      |
| Delete posts           | ✅    | ✅      | ❌    | ❌                      |
| Publish posts          | ✅    | ✅      | ❌    | ❌                      |

### Role Descriptions

**Owner:**

- Full system access
- User management (create/edit/delete admin accounts)
- Financial settings and payment methods
- Critical system settings
- Cannot be deleted or demoted

**Manager:**

- Operational management
- Product and bake sale management
- Order fulfillment
- Customer service
- Cannot access financial settings or user management

**Staff:**

- Order processing
- Product editing (not creation/deletion)
- Customer communication
- Limited administrative access
- Cannot access settings or create new entities

**Customer:**

- Public-facing features only
- Own account management
- Own order history
- Shopping and checkout

---

## Out of Scope (Not for Day One Launch)

### Deferred to Post-Launch (Phase 2+)

The following features are **explicitly excluded** from Day One launch and will be considered for future phases:

#### Loyalty & Rewards Program

- Points accumulation
- Tier system (Bronze, Silver, Gold)
- Points redemption
- Referral rewards
- Birthday bonuses

**Rationale:** Adds complexity to checkout and order processing. Better to launch with core e-commerce first, then add engagement features once baseline is established.

#### Subscription Service

- Recurring bake sale subscriptions
- Automatic order placement
- Subscription management
- Delivery frequency selection
- Skip/pause functionality

**Rationale:** Requires additional infrastructure for recurring billing and automated order generation. Not essential for MVP validation.

#### Advanced Analytics Dashboard (Customer-Facing)

- Spending trends
- Category preferences
- Purchase behavior analysis
- Custom reports
- Data exports

**Rationale:** Nice-to-have for engaged customers, but not required for core purchasing flow.

#### Social Media Integration (Advanced)

- Instagram feed widget
- Social sharing of orders
- Influencer tracking
- User-generated content

**Rationale:** Social login (Google) is included, but advanced social features can wait until customer base is established.

#### Wishlist/Favorites

- Save products for later
- Wishlist sharing
- Notifications when items available
- Gift functionality

**Rationale:** Useful for engagement but not blocking for purchases. Can be added post-launch.

#### Advanced Email Features

- Newsletter segmentation
- A/B testing
- Email scheduling
- Newsletter archive
- Advanced subscription management

**Rationale:** Basic transactional emails are sufficient for Day One. Marketing features can be added as customer base grows.

#### Multi-Language Support

- Translation system
- Locale management
- Currency conversion

**Rationale:** UK-only scope makes this unnecessary. If international expansion is considered, this would be a major Phase 3+ initiative.

---

## Success Metrics (Day One - First 30 Days)

### Technical Metrics

| Metric                     | Target  | Measurement                 |
| -------------------------- | ------- | --------------------------- |
| **Uptime**                 | 99.9%   | Cloudflare analytics        |
| **Page Load Time (LCP)**   | < 2.5s  | Lighthouse, Core Web Vitals |
| **Error Rate**             | < 1%    | Rollbar error tracking      |
| **D1 Query Latency (p95)** | < 200ms | Logflare monitoring         |
| **Email Delivery Rate**    | > 98%   | Resend analytics            |
| **Build Success Rate**     | 100%    | CI/CD pipeline              |

### Business Metrics

| Metric                   | Target         | Measurement             |
| ------------------------ | -------------- | ----------------------- |
| **Orders Processed**     | Track baseline | Admin dashboard         |
| **Payment Success Rate** | > 95%          | Stripe/PayPal analytics |
| **Cart Abandonment**     | < 70%          | Analytics tracking      |
| **Average Order Value**  | Track baseline | Order data              |
| **Customer Acquisition** | Track baseline | User signups            |
| **Repeat Order Rate**    | Track baseline | Customer order history  |

### User Experience Metrics

| Metric                        | Target          | Measurement             |
| ----------------------------- | --------------- | ----------------------- |
| **Signup Completion Rate**    | > 80%           | Analytics funnel        |
| **First Order Completion**    | > 40%           | Conversion tracking     |
| **Customer Support Response** | < 2 hours       | Support ticket system   |
| **Order Processing Time**     | < 5 minutes     | Admin workflow tracking |
| **Customer Satisfaction**     | Gather feedback | Post-order surveys      |

### Operational Metrics

| Metric                          | Target            | Measurement          |
| ------------------------------- | ----------------- | -------------------- |
| **Admin Order Processing**      | < 5 min per order | Time tracking        |
| **Bake Sale Cutoff Compliance** | 100%              | System validation    |
| **Inventory Accuracy**          | > 95%             | Stock reconciliation |
| **Refund Processing Time**      | < 24 hours        | Admin tracking       |

---

## Technical Constraints

### Platform Requirements

**Framework:**

- Next.js 15.5+ (App Router)
- Webpack build system (NOT turbopack)
- TypeScript strict mode
- React 18+

**Infrastructure:**

- Cloudflare Pages (hosting)
- Cloudflare Workers (background tasks)
- Cloudflare D1 (database) - **No Postgres migration planned**
- Cloudflare KV (caching, sessions)
- Cloudflare R2 (file storage)
- Cloudflare Images (image optimization)

**Third-Party Services:**

- Google Identity Platform (authentication)
- Stripe (payment processing)
- PayPal (payment processing)
- Resend (email delivery)
- Logflare (logging)
- Rollbar (error tracking)

**Database:**

- Cloudflare D1 (SQLite at edge)
- 10GB storage limit
- Single writer architecture
- Eventual consistency for reads
- **Scaling strategy:** D1 only, no Postgres migration
- **Optimization:** KV caching layer at 500+ MAU

### Performance Requirements

**Core Web Vitals:**

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**API Performance:**

- Server Action response time: < 300ms (p95)
- D1 query latency: < 200ms (p95)
- Image load time: < 1s

**Scalability:**

- Support 100-500 MAU at launch
- Plan for 1000+ MAU growth
- KV caching at 500+ MAU
- D1 optimization for high-traffic periods

### Security Requirements

**Authentication:**

- HTTPS only (SSL/TLS)
- Secure session management
- Password hashing (bcrypt/argon2)
- CSRF protection
- Rate limiting on auth endpoints

**Data Protection:**

- PCI DSS compliance (via Stripe)
- GDPR compliance (UK/EU)
- Secure credential storage
- Input validation (Zod)
- SQL injection prevention (Drizzle ORM)
- XSS prevention

**Access Control:**

- Role-based permissions (RBAC)
- Admin access logging
- Secure API endpoints
- Environment variable protection

### Compliance Requirements

**GDPR (UK/EU):**

- Cookie consent
- Privacy policy
- Data retention policies
- Right to deletion
- Data export capability

**Accessibility:**

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast requirements
- Semantic HTML

**SEO:**

- Meta tags and descriptions
- Structured data (Schema.org)
- Sitemap generation
- Mobile-friendly design
- Core Web Vitals optimization

---

## Geographic Scope

**Primary Market:** United Kingdom Only

**Implications:**

- Currency: GBP (£) only
- Language: English (UK) only
- Postcode validation: UK format only
- Delivery zones: UK addresses only
- Timezone: GMT/BST
- Date format: DD/MM/YYYY
- Phone format: UK (+44)

**No International Expansion Planned:**

- No multi-currency support needed
- No translation/localization needed
- No international shipping
- No region-specific pricing

---

## Timeline & Phases

**Development Methodology:** 10-Phase Approach (see `project-phases.md`)

**Phase Overview:**

```
Phase 0: Discovery & Requirements (Current)
Phase 1: Project Foundation (2-3 weeks)
Phase 2: Data Layer (2-3 weeks)
Phase 3: Core UI (3-4 weeks)
Phase 4: Features (4-6 weeks)
Phase 5: Auth (2-3 weeks, parallel to Phase 4)
Phase 6: Integration (3-4 weeks)
Phase 7: Testing (2-3 weeks)
Phase 8: Performance (1-2 weeks)
Phase 9: Deployment (1-2 weeks)
Phase 10: Launch & Monitoring (Ongoing)
```

**Estimated Timeline:** 20-30 weeks from Phase 1 start to launch

**Critical Path:**

- Phase 2 completion blocks Phase 3 (mock files required)
- Phase 6 completion blocks Phase 7 (all mocks must be removed)
- Phase 8 completion blocks Phase 9 (performance targets must be met)

---

## Assumptions & Dependencies

### Assumptions

1. **Bake Sale Model Acceptance:**

   - Customers understand and accept the bake sale date model
   - Customers are willing to plan purchases in advance
   - Cutoff times are reasonable and communicated clearly

2. **Product Catalog:**

   - 20-50 products at launch across 4 categories
   - Some products have multiple sizes/variants
   - Product availability varies by bake sale date

3. **Order Volume:**

   - Initial volume: 10-50 orders per bake sale
   - Growth to 100+ orders per bake sale within 6 months
   - Monthly bake sales (with exceptions for holidays)

4. **Technical Infrastructure:**

   - Cloudflare services remain available and performant
   - D1 database sufficient for 1000+ MAU without Postgres migration
   - Third-party APIs (Stripe, PayPal, Resend) remain stable

5. **User Behavior:**
   - Majority of customers prefer collection over delivery
   - Payment on collection is most popular payment method
   - Customers check email for order confirmations

### Dependencies

**External Services:**

- Cloudflare (Pages, Workers, D1, KV, R2, Images)
- Google Identity Platform (authentication)
- Stripe (payment processing)
- PayPal (payment processing)
- Resend (email delivery)
- Logflare (logging)
- Rollbar (error tracking)

**Internal Dependencies:**

- Phase 2 mock files must be complete before Phase 3
- Phase 6 mock removal must be verified before Phase 7
- Performance targets must be met before production launch

**Business Dependencies:**

- Product catalog ready for upload
- Bake sale schedule defined
- Collection location confirmed (Station Road, Cressage)
- Payment accounts configured (Stripe, PayPal, bank)
- Email domain verified (Resend)

---

## Risk Assessment

### High-Risk Items

| Risk                                     | Impact | Mitigation                                                                   |
| ---------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| **D1 scaling limitations**               | High   | Monitor query performance; implement KV caching at 500 MAU; optimize queries |
| **Bake sale cutoff enforcement**         | High   | Automated cutoff checks; clear customer communication; grace period handling |
| **Payment processing failures**          | High   | Multiple payment methods; clear error messages; automatic retry logic        |
| **Email delivery issues**                | Medium | Resend monitoring; fallback to admin notifications; delivery tracking        |
| **Customer confusion (bake sale model)** | Medium | Clear UI/UX; onboarding flow; help documentation; customer support           |

### Medium-Risk Items

| Risk                            | Impact | Mitigation                                                            |
| ------------------------------- | ------ | --------------------------------------------------------------------- |
| **Third-party API downtime**    | Medium | Circuit breakers; graceful degradation; status monitoring             |
| **Image upload/storage issues** | Medium | Cloudflare Images reliability; fallback to placeholder images         |
| **Session management issues**   | Medium | KV redundancy; session timeout handling; re-authentication flow       |
| **Mobile responsiveness**       | Medium | Mobile-first design; extensive device testing; responsive breakpoints |

### Low-Risk Items

| Risk                         | Impact | Mitigation                                                           |
| ---------------------------- | ------ | -------------------------------------------------------------------- |
| **SEO ranking**              | Low    | Follow best practices; structured data; content optimization         |
| **Browser compatibility**    | Low    | Modern browser support; progressive enhancement; polyfills if needed |
| **Accessibility compliance** | Low    | WCAG 2.1 AA guidelines; automated testing; manual audits             |

---

## Glossary

**Bake Sale Date:** A specific date when products are baked and available for collection or delivery. Customers must select a bake sale date before purchasing.

**Cutoff Time:** The deadline by which orders must be placed for a specific bake sale date. After cutoff, orders cannot be placed for that date.

**Fulfillment Method:** How the customer receives their order (Collection or Delivery).

**Collection:** Customer picks up order at specified location (default fulfillment method).

**Delivery:** Order is shipped to customer's address (delivery fee applies).

**Payment on Collection:** Customer pays when picking up order (default payment method).

**Voucher Code:** Discount code applied at checkout for percentage or fixed amount discount.

**Product Variant:** Different sizes or options for the same product (e.g., Small, Medium, Large loaf).

**MAU:** Monthly Active Users - number of unique users per month.

**RBAC:** Role-Based Access Control - permission system based on user roles.

**Server Action:** Next.js server-side function for data mutations and queries.

**Mock Data:** Flat file data used during Phases 3-4 for UI development (replaced in Phase 6).

---

## Approval & Sign-Off

**Document Status:** Draft - Awaiting Approval

**Approval Required From:**

- [ ] Product Owner
- [ ] Technical Lead
- [ ] Business Stakeholder

**Next Steps After Approval:**

1. Begin Phase 1 (Project Foundation)
2. Set up development environment
3. Initialize Next.js 15.5+ project
4. Configure Cloudflare infrastructure

---

**Document Version:** 1.0  
**Created:** November 24, 2025  
**Last Updated:** November 24, 2025  
**Next Review:** After Phase 1 Completion
