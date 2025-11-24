# Band of Bakers - Admin Interface & Operations Guide

This document describes the complete admin dashboard experience, management interfaces, and administrative workflows.

---

## Admin Dashboard Entry

**Entry Point:** `/admin` or `/dashboard`

**Access Requirements:**

- Admin role in system
- Authentication required
- Role-based access controls (Owner, Manager, Staff)

---

## 📊 Dashboard Overview

**Main Dashboard:**

- Quick stats showing:
  - Today's orders (count and revenue)
  - Upcoming bake sale dates
  - Products availability overview
  - Recent orders
  - Low stock alerts
  - Cutoff alerts (items approaching cutoff)

**Navigation Menu:**

- Dashboard
- Products
- Bake Sales
- Orders
- Customers
- News & Events
- Settings
- Reports
- Analytics

---

## 📦 Bake Sale Management (`/admin/bake-sales`)

### Viewing Bake Sales

**List View:**

- All bake sale dates (past and upcoming)
- Date and cutoff time
- Status (Active/Inactive)
- Number of orders for each date
- Revenue for each date
- Actions menu

### Creating New Bake Sale

**Form Fields:**

1. **Date** - Calendar picker for bake sale date
2. **Location** - Select from defined bake sale locations (defaults to "Station Road, Cressage")
3. **Cutoff Time** - Time by which orders must be placed
4. **Name** - Optional human-readable name (e.g., "Holiday Special")
5. **Description** - Optional description visible to customers
6. **Status** - Toggle Active/Inactive
7. **Fulfillment Methods** - Select enabled methods (Collection, Delivery)
8. **Settings**
   - Capacity per product (if applicable)
   - Special instructions
   - Pricing adjustments (if any)

**Actions:**

- Save and create
- Preview how it appears to customers
- Set as featured
- Copy from previous bake sale

### Editing Bake Sale

**Before Cutoff:**

- Can edit all fields
- Changes immediately visible to customers
- Cutoff warning if nearing cutoff time

**After Cutoff:**

- Cannot accept new orders
- Can view orders for this date
- Can mark as complete/archived
- Can view analytics for this sale

### Viewing Orders by Bake Sale

- Table of all orders for this specific date
- Customer names and contact info
- Order status
- Fulfillment method breakdown
- Total items and revenue
- Export to CSV
- Print picking lists

---

## 📰 News & Events Management (`/admin/news-events`)

### Viewing News & Events

**List View:**

- All posts (news and events)
- Post title and excerpt
- Post type badge (News or Event)
- Status badge (Draft, Published, Archived)
- Featured image thumbnail
- Publication date
- Author (admin who created it)
- View count
- Actions menu

**Filters:**

- Filter by type (News or Event)
- Filter by status (Draft, Published, Archived)
- Search by title or content
- Date range filter

### Creating News Post

**Form Fields:**

1. **Title** - Post headline
2. **Excerpt** - Short summary (appears on listing page)
3. **Content** - Full post body with rich text editor
4. **Featured Image** - Upload image for preview
5. **Type** - Select "News"
6. **Status** - Draft or Publish immediately
7. **Publication Date** - Auto-set to current date, can be scheduled for future

**Preview:**

- See how post appears on public news page before publishing
- Mobile and desktop preview

### Creating Event Post

**Form Fields:**

1. **Title** - Event name
2. **Excerpt** - Short event summary
3. **Content** - Full event details and description
4. **Featured Image** - Event image/poster
5. **Type** - Select "Event"
6. **Event Date** - Date and time of the event
7. **Event Location** - Physical location or "Online"
8. **Status** - Draft or Publish
9. **Publication Date** - When to show the event

**Preview:**

- See how event appears on public page
- Shows event date and location prominently

### Editing Posts

- All fields editable
- Change status from Draft to Published
- Archive old posts instead of deleting
- Update featured image
- Modify publication date
- Track edit history

### Archiving Posts

- Archive old news and past events
- Archived posts hidden from public page
- Can be restored if needed
- Cannot permanently delete (data retention)

---

## 🎟️ Voucher Management (`/admin/vouchers`)

### Viewing Vouchers

**List View:**

- All vouchers (active, inactive, expired)
- Voucher code
- Voucher type (Fixed amount or Percentage)
- Discount value
- Status badge (Active/Inactive/Expired)
- Usage count and limit
- Expiration date
- Creation date
- Actions menu

**Filters:**

- Filter by status (Active, Inactive, Expired)
- Filter by type (Percentage, Fixed Amount)
- Search by code
- Date range filter

### Creating Voucher

**Form Fields:**

1. **Voucher Code** - Unique code customer enters (e.g., SAVE15)
2. **Discount Type** - Percentage (%) or Fixed amount (£)
3. **Discount Value** - Amount or percentage to discount
4. **Minimum Order Value** - Minimum cart value required
5. **Maximum Discount** - Max discount cap (if percentage)
6. **Applicable Products** - All products or specific selection
7. **Applicable Categories** - All or select categories
8. **Usage Limit** - Unlimited or set maximum uses
9. **Per Customer Limit** - How many times per customer
10. **Start Date** - When voucher becomes active
11. **Expiration Date** - When voucher expires
12. **Status** - Active/Inactive

**Preview:**

- See discount calculation examples
- Test code in test checkout

### Editing Voucher

- All fields editable (except code)
- View usage history
- Deactivate voucher
- Extend expiration date
- Change discount value

### Viewing Usage

- List of all customers who used voucher
- Date used
- Order number
- Discount amount applied
- Customer email

---

## 🎁 Loyalty Program Management (`/admin/loyalty`)

### Program Settings

**Loyalty Configuration:**

- Points per £1 spent (default: 1)
- Points per purchase (bonus flat amount)
- Special promotion points
- Points expiration (if enabled)

**Tier Configuration:**

- Bronze tier: Points multiplier and benefits
- Silver tier: Points multiplier and benefits
- Gold tier: Points multiplier and benefits
- Tier upgrade thresholds

**Redemption Rules:**

- Points to currency conversion (e.g., 100 points = £5)
- Redemption increments
- Minimum points required
- Maximum points per transaction

### Viewing Loyalty Members

**Member List:**

- Customer name and email
- Current tier (Bronze, Silver, Gold)
- Points balance
- Lifetime points earned
- Points redeemed
- Last activity date
- Join date

**Filters:**

- Filter by tier
- Search by customer name
- Filter by points range

### Member Details

- Points history (earned/redeemed)
- Tier progression timeline
- Benefits enjoyed
- Referral history
- Special offers given
- Contact customer

### Points Management

**Adjust Points:**

- Manually add/remove points
- Reason for adjustment
- Create promotional point bonuses
- Award birthday bonus points

**Bulk Actions:**

- Award anniversary bonus to all members
- Remove expired points
- Send tier upgrade notifications

### Reports

- Total points distributed
- Total points redeemed
- Member distribution by tier
- Tier upgrade trends
- Points redemption trends
- Revenue impact of loyalty program

---

## 🔄 Subscription Management (`/admin/subscriptions`)

### Viewing Subscriptions

**Active Subscriptions:**

- Customer name and email
- Subscription frequency
- Next delivery date
- Products included
- Subscription value
- Status (Active, Paused, Cancelled)
- Start date
- Actions menu

**Filters:**

- Filter by status
- Filter by frequency
- Filter by next delivery date
- Search by customer name

### Subscription Details

- Customer information
- Subscription history
- Items included
- Upcoming deliveries (12-month view)
- Pause/skip history
- Revenue from subscription
- Cancellation reason (if applicable)

**Actions:**

- Pause subscription
- Resume paused subscription
- Cancel subscription
- Modify items for next delivery
- Change frequency
- Send reminder email
- View customer communication history

### Managing Deliveries

**Upcoming Deliveries:**

- View next 3 months of scheduled deliveries
- Items for each delivery
- Customer modification deadline
- Fulfillment status
- Adjust items before cutoff
- Skip specific delivery

### Bulk Actions

- Send all customers delivery reminders
- Pause all subscriptions (if issues)
- Export subscription list
- Generate picking list for all subscriptions

### Reports

- Total active subscriptions
- Revenue from subscriptions (recurring)
- Churn rate (cancellations)
- Average subscription lifetime
- Popular subscription items
- Subscription frequency distribution

---

## 🛍️ Product Management (`/admin/products`)

### Product List

**Columns:**

- Product name and image thumbnail
- Category
- Price
- Stock status
- Visibility (active/inactive)
- Last updated
- Actions

**Filters:**

- Category filter
- Status filter (Active/Inactive)
- Search by name or SKU

### Creating Product

**Basic Information:**

- Product name
- SKU
- Description (short and long)
- Category selection
- Price
- Cost (for margin calculations)

**Images:**

- Upload primary image
- Upload additional images
- Drag to reorder
- Set as primary

**Inventory:**

- Track inventory (yes/no)
- Current stock level
- Allow backorders (yes/no)
- Reorder point

**Availability:**

- Select which bake sale dates product is available
- Set quantity available per date (if limited)
- Mark as available/unavailable

**Fulfillment:**

- Select fulfillment methods available (Collection, Delivery)
- Weight (for shipping calculations)

**SEO:**

- Meta title
- Meta description
- SEO slug

**Publishing:**

- Status (Draft/Published)
- Visibility (Public/Private)
- Schedule publish date (optional)

### Editing Product

- All fields editable
- Preview how it appears on website
- View sales history for this product
- See which bake sales it's available for

### Inventory Management

**Quick Updates:**

- Inline quantity editing
- Quick mark as sold out
- Bulk actions (update multiple at once)

**Availability by Date:**

- Matrix view showing product × bake sale dates
- Set quantities available for each combination
- Track how many have been ordered
- See remaining inventory

---

## 📋 Order Management (`/admin/orders`)

### Orders List

**View:**

- All orders (can filter by status, date, customer)
- Order number
- Customer name and email
- Order date
- Order status (Pending, Processing, Shipped, Delivered, Cancelled, Refunded)
- Total amount
- Payment status
- Fulfillment date(s)

**Filters:**

- Status filter
- Date range picker
- Payment status
- Fulfillment method
- Bake sale date

**Actions:**

- View full order details
- Change order status
- Send order to customer
- Print packing slip
- Refund order
- Contact customer

### Order Details

**Order Information:**

- Order number and date
- Customer details (name, email, phone)
- Shipping address
- Billing address
- Payment method used
- Payment status
- Amount paid
- Notes/comments

**Items Breakdown:**

- Table of items
- Organized by bake sale date
- Product name, SKU, quantity, price
- Line totals
- Fulfillment method for each group

**Order Timeline:**

- Order placed (timestamp)
- Payment confirmed (timestamp)
- Order processing
- Items prepared
- Ready for collection/dispatched
- Delivered (timestamp)

**Fulfillment:**

- For each bake sale date:
  - Fulfillment method (Collection/Delivery)
  - Fulfillment address
  - Collection instructions (if applicable)
  - Delivery date/window
  - Status
  - Notes

**Actions Available:**

- Mark as processing
- Mark as shipped/ready for collection
- Send confirmation email
- Generate picking list
- Print packing slip
- Issue refund (full or partial)
- Add internal notes
- Contact customer
- Mark item(s) as unavailable (with email to customer)
- View fulfillment status by method

---

## 🏪 Collection-Specific Workflow

### Marking Order as Ready for Collection

**For Orders with Collection Items:**

1. **Find Order** - Filter by fulfillment method "Collection" or view all orders
2. **Open Order Details** - Click order number to view full details
3. **View Collection Items** - Items grouped by fulfillment method and date
4. **Mark as Ready**
   - Click "Mark Ready for Collection" button
   - System updates order status to **"Ready for Collection"**
   - Customer receives email: "Your order is ready for collection"
   - Email includes:
     - Collection date and time
     - Collection location and address
     - Special collection instructions
     - What to bring (e.g., bag, cooler)
     - Customer's order summary

**Order Status Sequence for Collection:**

1. **Pending** - Order placed, awaiting payment
2. **Processing** - Payment confirmed, items being prepared
3. **Ready for Collection** 🏪 - Items prepared and waiting
4. **Fulfilled** ✅ - Customer has collected items

### Marking Order as Fulfilled (Collected)

**After Customer Collects:**

1. **Mark as Collected**
   - Click "Mark as Fulfilled" or "Collect Completed"
   - Requires confirmation (optional: require staff PIN or signature)
   - System updates status to **"Fulfilled"**
   - Customer receives email: "Thank you for collecting your order"
   - Email includes order summary and thank you message

**Alternative: Quick Collection Completion**

- Staff scan customer's order number or receipt
- One-click mark as fulfilled
- Reduces friction when customer is in-store

---

## 📦 Managing Item Unavailability

### Marking Item as Unavailable

**Scenario:** Item runs out or becomes unavailable after order placement.

**Process:**

1. **Find Order** - Search orders by customer, order number, or date
2. **Open Order Details** - View all items and their status
3. **Select Unavailable Item(s)**
   - Click checkbox next to item(s) that are no longer available
   - Can select one or multiple items
4. **Mark as Unavailable**
   - Click "Mark Item(s) Unavailable" button
   - Opens confirmation dialog showing:
     - Item names and quantities
     - Refund amount for each item
     - Message preview that will be sent to customer
   - Optionally add custom message (e.g., "We apologize - this sold out")
5. **Send to Customer**
   - Click "Mark Unavailable & Notify Customer"
   - System automatically:
     - Updates order items status
     - Reduces order total and refund amount
     - Sends email to customer

**Customer Notification Email:**

Subject: "Item Unavailable - [Order #123]"

Body includes:

- Apologetic message
- List of unavailable items with quantities
- Refund amount (if applicable)
- Replacement options (suggest similar items)
- Admin contact info if customer has questions
- Option to rebook for different date
- Admin's custom message (if added)

**Order Adjustment:**

- Original order remains in system for records
- Unavailable items removed from fulfillment list
- New order total calculated
- Refund automatically processed to original payment method
- Customer can still collect/receive remaining items

**Notes:**

- If ALL items become unavailable, offer full refund and suggest rebooking
- Staff can add custom message for special circumstances
- Email logs stored for auditing
- Customer can reply to email to contact admin

---

## 🔄 Managing Bake Sale Date Changes

### Rescheduling a Bake Sale Date

**Scenario:** An unexpected circumstance requires moving a bake sale to a different date.

**Process:**

1. **Navigate to Bake Sales** - Go to `/admin/bake-sales`
2. **Find Affected Date** - Locate the bake sale that needs rescheduling
3. **Click Edit** - Open the bake sale editor
4. **Change Date**
   - Click the date picker
   - Select new date
   - System shows: "⚠️ There are X orders for the current date"
5. **Review Impact**
   - Count of affected customers shown
   - List of orders that will be impacted
   - Fulfillment methods affected (Collection/Delivery)
6. **Proceed with Date Change**
   - Click "Update Date & Notify Customers"
   - System asks for email template selection or custom message

**Automatic Customer Notification:**

System sends email to all customers with orders for the original date:

**Email Subject:** "Important: Your Order Date Has Been Rescheduled - [Original Date] → [New Date]"

**Email Body Includes:**

1. **Apology and Explanation**

   - Professional explanation of why date changed
   - Option to add admin's custom message

2. **Three Options for Customer:**

   **Option A: Accept New Date**

   - Click "Accept New Date"
   - Order automatically rescheduled
   - Confirmation email sent

   **Option B: Change to Different Date**

   - Click "Choose Different Date"
   - Shows available bake sale dates
   - Can select new preferred date
   - New confirmation with updated details

   **Option C: Cancel Order (Get Refund)**

   - Click "Cancel & Refund"
   - Full refund processed immediately
   - Cancellation confirmation email
   - Option to rebook for future date

3. **Customer Response Deadline**
   - "Please respond by [date/time]"
   - Default: 48 hours from email sent
   - Customizable by admin

**Admin Dashboard for Date Changes:**

- View which customers have responded
- See response summary:
  - X customers accepted new date
  - Y customers chose different date
  - Z customers cancelled (pending refunds)
- Send reminder emails to non-responders
- Manually update any special cases
- View refund status for cancellations

**What Happens After Deadline:**

- Non-responders:
  - Automatic reminder email sent
  - Admin alerted to manually contact them
  - Order status flagged as "Awaiting Customer Response"
- Cancellations:
  - All refunds processed automatically
  - Orders marked as "Cancelled by Customer"
  - Customer notes added for records

**System Safeguards:**

- Cannot complete reschedule until most customers respond
- Automatic backup notification if response rate < 50%
- Log all customer responses for auditing
- Undo option (up to 24 hours) if needed
- Fulfillment settings maintained (Collection/Delivery method stays same)

---

## 👥 Customer Management (`/admin/customers`)

### Customer List

**View:**

- All customers (registered accounts only)
- Name and email
- Total orders placed
- Total revenue
- Last order date
- Signup date
- Status (Active, Inactive)

**Filters:**

- Search by name or email
- Sort by different columns
- Filter by signup date range
- Filter by order count

### Customer Profile

**Customer Details:**

- Name, email, phone
- Account creation date
- Total spent
- Order count
- Preferences and notes

**Address Book:**

- Saved addresses
- Default shipping/billing addresses

**Order History:**

- List of all orders by this customer
- Quick access to order details

**Communication:**

- Send marketing email
- Send order confirmation (if needed)
- Send custom message
- View communication history

**Actions:**

- Edit customer details
- Reset password
- Suspend account
- Delete account (with confirmation)
- Add internal notes

---

## ⚙️ Settings & Configuration

### Business Settings (`/admin/settings`)

**Store Information:**

- Store name
- Description
- Contact email
- Phone number
- Address
- Business hours
- Logo and favicon

### Global Payment Settings (`/admin/settings/payment`)

**Payment Methods Configuration:**

Globally manage which payment methods customers can use across all orders.

**Available Methods:**

1. **Credit/Debit Card** (Stripe)

   - Enable/disable card payments
   - Configure Stripe API keys
   - Set webhook endpoints
   - View transaction history
   - Test mode vs. Live mode toggle

2. **PayPal**

   - Enable/disable PayPal
   - Configure PayPal credentials
   - Configure sandbox vs. live

3. **Apple Pay / Google Pay**
   - Enable/disable digital wallet payments
   - Configure payment processor settings

**Settings:**

- Default payment method (if customer hasn't selected)
- Currency and localization
- Transaction logging and monitoring

---

### Bake Sale Locations Management (`/admin/settings/locations`)

**Purpose:** Define and manage physical locations where bake sales take place. Each bake sale must be associated with a location for clear customer communication about where to collect orders.

**Viewing Locations:**

**List View:**

- All defined bake sale locations
- Location name and full address
- Status (Active/Inactive)
- Number of upcoming bake sales using this location
- Actions menu (Edit, Deactivate, Delete)

**Default Locations:**

- **Station Road, Cressage** - Primary default location
- **Bannatyne Shrewsbury** - Secondary location

**Adding a New Location:**

**Form Fields:**

1. **Location Name** - Display name (e.g., "Station Road, Cressage")
2. **Full Address**
   - Address line 1
   - Address line 2 (optional)
   - City
   - Postcode
   - Coordinates (latitude/longitude for maps)
3. **Contact Information**
   - Phone number
   - Email (optional)
4. **Collection Hours**
   - Days of week (Mon-Sun)
   - Opening and closing times
   - Closed dates/holidays
5. **Special Instructions** - Customer-facing guidance (e.g., "Parking available on Station Road")
6. **Status** - Active/Inactive
7. **Default Location** - Toggle to set as default for new bake sales

**Editing Locations:**

- All fields editable
- Cannot delete locations with associated bake sales
- Can deactivate instead
- Update coordinates for map accuracy

**Location Validation:**

- Address fields required
- Postcode format validation
- Duplicate location names prevented

### Global Fulfillment Settings (`/admin/settings/fulfillment`)

**Fulfillment Methods Configuration:**

Globally enable/disable fulfillment methods that will be available for all bake sales and customers.

**Method 1: Collection (🏪)**

- **Enable/Disable Toggle** - Turn collection on/off globally
- **Collection Location** - Now references bake sale locations defined above
  - Address pulled from selected bake sale location
  - Hours pulled from location settings
- **Special Instructions** - Customer-facing guidance (e.g., "Use side entrance")
- **Collection Limit** - Max items per collection slot (if applicable)

**Method 2: Delivery (🚚)**

- **Enable/Disable Toggle** - Turn delivery on/off globally
- **Delivery Settings**
  - Flat rate fee vs. zone-based pricing
  - Minimum order value for free delivery (if applicable)
  - Delivery lead time (e.g., "Ready in 2 days")
  - Delivery window (e.g., "9am-5pm" or "Friday 2-6pm")
  - Weekend delivery options
  - Maximum delivery distance/postcode validation
- **Special Handling**
  - Fragile items handling
  - Delivery instructions template
  - Photo requirement for proof of delivery (optional)

**Global Behavior:**

- If **both methods enabled**: Customers choose at checkout
- If **only Collection enabled**: Collection auto-selected, no address form needed
- If **only Delivery enabled**: Delivery auto-selected, address form required
- If **both disabled**: Cannot create orders or complete checkouts (system warning shown)

**Validation:**

- At least one method must be enabled to accept orders
- System warns if both disabled
- Changes to global settings affect new orders only (existing orders keep their method)

**Packaging:**

- Packaging options
- Gift message options
- Special handling instructions

### Shipping Settings

**Delivery Configuration:**

- Enable/disable shipping
- Shipping methods available
- Shipping zones and rates
- Free shipping threshold
- Shipping address validation

**Collection Configuration:**

- Collection address/location
- Collection hours
- Collection instructions for customers

### Tax Settings

**Tax Configuration:**

- Enable/disable tax
- Tax rate percentage
- Tax name (VAT, Sales Tax, etc.)
- Apply to specific product categories
- Tax calculation method

### Email Settings

**Email Configuration:**

- Email service provider
- From address
- Email templates customization
- Test email functionality

**Automated Emails:**

- Order confirmation
- Shipping/ready for collection notice
- Delivery confirmation
- Customer feedback request

### Integration Settings

**Connected Services:**

- Inventory sync
- Accounting software
- Marketing tools
- Analytics platforms
- Social media posting

---

## 📊 Reports & Analytics (`/admin/reports`)

### Sales Reports

**Overview:**

- Total revenue (all time, this year, this month)
- Order count trends
- Average order value
- Revenue by fulfillment method (Collection vs Delivery)
- Revenue by category

**By Date:**

- Revenue breakdown by bake sale date
- Best performing dates
- Customer count per date
- Order status distribution

**By Product:**

- Top selling products
- Products by revenue
- Products by quantity sold
- Products with declining sales

**By Customer:**

- Top customers by revenue
- Customer acquisition trends
- Repeat purchase rate
- Customer lifetime value

### Export Options

- Download as CSV
- Download as PDF
- Schedule automated reports (email weekly/monthly)

---

## 🔔 Notifications & Alerts

### Order Alerts

**For Admins:**

- New order notification
- Payment confirmation
- Order shipped
- Customer requests help

### Inventory Alerts

- Low stock warning (approaching reorder point)
- Out of stock notification
- Stock reaching full capacity

### Cutoff Alerts

- Bake sale cutoff approaching (48 hours)
- Bake sale cutoff reached
- Orders for date nearing fulfillment

### Performance Alerts

- Unusual sales spike
- Payment failures
- System errors
- High refund rate

---

## 🛠️ Staff vs Manager vs Owner Permissions

### Staff Role

- View-only access to orders and products
- Can update order status
- Can print packing lists and labels
- Can contact customers
- Cannot edit products or prices
- Cannot create bake sales
- Cannot access financial reports
- Cannot access settings

### Manager Role

- Full product management
- Full order management
- Can create and edit bake sales
- Can view reports and analytics
- Can manage fulfillment
- Can manage customers
- Cannot access financial settings
- Cannot manage user accounts
- Cannot access security settings

### Owner/Admin Role

- Full system access
- All features available
- User account management
- System settings and integrations
- Payment and tax configuration
- Can grant/revoke permissions
- Access to all reports and data

---

## 📱 Admin Mobile Experience

**Dashboard:**

- Simplified mobile dashboard
- Key metrics visible
- Limited data table columns
- Full functionality available but interface adapts

**Management Tasks:**

- Can view orders on mobile
- Can update order status
- Can contact customers
- Can create bake sales (with optimized form)
- Can view reports (charts responsive)

---

## Summary

The Band of Bakers admin interface provides comprehensive tools for managing the entire operation from bake sale scheduling through order fulfillment, inventory management, and customer communications. Role-based access ensures appropriate team members have the tools they need while maintaining security and data integrity.
