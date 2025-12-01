# Order Data Update Summary

## Date: December 1, 2025

### Overview

Updated the real products mock data to include realistic historical and upcoming orders with various fulfillment states, all using **collection** fulfillment method and **payment on collection**.

---

## Order Statistics

### Total Orders: **113**
- **95** fulfilled (historical orders)
- **12** pending (upcoming orders)
- **5** processing (being prepared)
- **1** ready (ready for collection)

### Customer Distribution
- **58 unique customers** across all orders
- **441 total order items**

---

## Order States Breakdown

### 1. Historical Orders (Fulfilled)
**95 orders** from past bake sales (June 2024 - November 2024)
- All marked as `fulfilled` status
- Payment status: `completed`
- 2-5 orders per bake sale
- Spread across 26 past bake sales

### 2. Upcoming Orders - December 13, 2025
**7 orders** for the next bake sale
- **3** pending (just placed)
- **2** processing (being prepared)
- **2** pending (awaiting processing)
- Orders range from £7 - £42.50

### 3. Upcoming Orders - December 21, 2025
**5 orders** for holiday bake sale
- **2** processing (in preparation)
- **3** pending (awaiting processing)
- Orders range from £44 - £100

### 4. Upcoming Orders - January 10, 2026
**4 orders** for new year bake sale
- **1** ready (ready for collection!)
- **1** processing (being prepared)
- **2** pending (awaiting processing)
- Orders range from £11.50 - £53.50

### 5. Future Orders - February 7, 2026
**2 orders** for future bake sale
- All `pending` (early bird orders)

---

## Payment Details

All orders use:
- **Fulfillment Method**: `collection` (in-person pickup)
- **Payment Method**: `payment_on_collection` (pay when you collect)
- **Delivery Fee**: £0 (no delivery for collection orders)

### Payment Status Logic
```
pending    → payment_status: pending
processing → payment_status: pending
ready      → payment_status: pending
fulfilled  → payment_status: completed (paid on collection)
```

---

## Order Items

Each order contains **2-6 products** randomly selected from the 28 real products, with quantities of 1-3 per item.

### Popular Products in Orders
- Focaccia
- Sourdough
- Croissants
- Apple Pies (small & large)
- Portuguese Custard Tarts
- Lemon Drizzle Cake
- Cinnamon Knots
- Eccles Cakes
- Flapjacks
- Curried Beef Pasties
- Millionaire Shortbread

Some products have variants (e.g., Apple Pies: Small vs Extra Large, Frangipane: Slice vs Whole), which are randomly selected for orders.

---

## Sample Orders

### Order #96 (Pending - Dec 13)
- Status: `pending`
- Items: 4 products
- Total: £42.50
- Payment: Pending until collection

### Order #108 (Ready - Jan 10)
- Status: `ready` ✅
- Items: 3 products
- Total: £53.50
- Payment: Pending until collection
- **Ready for customer pickup!**

### Order #103 (Processing - Dec 21)
- Status: `processing`
- Items: Multiple products
- Total: £100.00
- Payment: Pending until collection
- Currently being prepared

---

## Files Modified

### [src/lib/real-products-mock-data.ts](../src/lib/real-products-mock-data.ts)

**Lines 458-505**: Updated order generation logic
- Replaced simple pending orders with diverse order states
- Added specific logic for each upcoming bake sale
- Created realistic progression: pending → processing → ready → fulfilled

**Key Changes:**
```typescript
// OLD: All upcoming orders were just "pending"
createOrder(bakeSale.id, bakeSale.date, userId, 1, "pending");

// NEW: Mix of statuses based on bake sale proximity
- Dec 13 sale: 7 orders (3 pending, 2 processing, 2 pending)
- Dec 21 sale: 5 orders (2 processing, 3 pending)
- Jan 10 sale: 4 orders (1 ready, 1 processing, 2 pending)
- Feb 7 sale:  2 orders (all pending)
```

**Lines 416-421**: Improved payment status logic
- Added explicit payment status determination
- Ensures `payment_on_collection` orders only complete when fulfilled
- Payment remains pending through pending/processing/ready states

---

## Benefits

### For Admin Testing
- ✅ **Realistic order pipeline**: See orders at various stages
- ✅ **Order management**: Test transitions between states
- ✅ **Ready orders**: Practice collection workflow
- ✅ **Historical data**: Review past performance

### For Customer Testing
- ✅ **Active orders**: See pending/processing orders
- ✅ **Order history**: View fulfilled orders
- ✅ **Collection workflow**: Test payment on collection
- ✅ **Order tracking**: Monitor status changes

### For Development
- ✅ **State transitions**: Test status change logic
- ✅ **Payment handling**: Verify payment on collection flow
- ✅ **Order filtering**: Test by status, date, customer
- ✅ **Analytics**: Calculate metrics from real data

---

## Next Steps

### To Populate Database
```bash
# Reseed database with updated order data
npx tsx scripts/seed.ts --real-products
```

### To Test Order Workflows

1. **Admin Panel**:
   - View orders by status
   - Move orders from pending → processing → ready → fulfilled
   - Test payment on collection completion

2. **Customer Portal**:
   - View active orders (pending/processing/ready)
   - View order history (fulfilled)
   - Track order status

3. **Collection Process**:
   - Find ready orders (status: `ready`)
   - Mark as fulfilled on collection
   - Complete payment (payment_status: `pending` → `completed`)

---

## Database Queries

### View Upcoming Orders by Status
```sql
SELECT o.order_number, o.status, o.total, bs.date
FROM orders o
JOIN bake_sales bs ON o.bake_sale_id = bs.id
WHERE bs.date >= '2025-12-01'
ORDER BY bs.date, o.status;
```

### Find Ready Orders
```sql
SELECT o.order_number, u.name, o.total, bs.date, l.name as location
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN bake_sales bs ON o.bake_sale_id = bs.id
JOIN locations l ON bs.location_id = l.id
WHERE o.status = 'ready'
ORDER BY bs.date;
```

### Order Status Distribution
```sql
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status
ORDER BY status;
```

---

## Notes

- All orders use **collection** (no delivery orders)
- All orders use **payment_on_collection** (no online payments)
- Payment completes only when order status changes to `fulfilled`
- Order items correctly reference real products with proper variants
- Order totals accurately reflect product prices and quantities

This provides a realistic dataset for testing the full order management lifecycle! 🎉
