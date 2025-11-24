# Bake Sale Date & Location Requirement Implementation

## Overview

The shopping cart now requires users to select:

1. **A bake sale date** - When the bake sale occurs
2. **A location** - Where the bake sale will be held (with default: Station Road, Cressage)

This ensures all items in the cart are associated with a valid bake sale date AND location. Users must be explicitly aware of where their order will be collected/delivered.

## Changes Made

### 1. **AddToCartButton Component** (`src/features/cart/components/add-to-cart-button.tsx`)

- **Status**: Always disabled for quick add operations
- **Reason**: Quick "Add to Cart" buttons don't have bake sale date context
- **User Experience**: Button shows "Select Date to Add" with tooltip "Please select a bake sale date first"
- **Alternative**: Users must visit the product detail page to add items

### 2. **ProductDetailsClient Component** (`src/components/product/product-details-client.tsx`)

- **Added Validation**:
  - Check that `bakeSaleId` is provided before adding to cart
  - Check that `locationId` is provided before adding to cart
  - Display error toast if bake sale date is not selected
  - Display error toast if location is not selected
  - Clear error messages guide selection
- **Location Display** (Read-Only):
  - Location set by admin for each bake sale date
  - Users **cannot change** the location
  - Location name displayed prominently with "Admin-Selected Location" badge
  - Users must **agree** to the location to proceed
  - Required acknowledgment: Checkbox "I understand this order will be [Location Name]"
  - Location details shown (address, description, parking info if available)
- **Button State**:
  - Disabled until both date AND location acknowledged
  - Button text changes to "Select Date to Add" when incomplete
  - Button text shows "Add to Cart - £X.XX" when ready
  - Location acknowledgment required before adding to cart

### 3. **ProductsContentClient Component** (`src/app/products/products-content-client.tsx`)

- **Quick Add Handler**: Now shows error "Please select a bake sale date from the product details page"
- **Behavior**: Quick add buttons redirect users to product detail page where they must select a date

### 4. **FeaturedProducts Component** (`src/components/storefront/featured-products.tsx`)

- **Quick Add Handler**: Now shows error "Please select a bake sale date from the product details page"
- **Behavior**: Same as products page - redirects to product detail

### 5. **Cart Store** (`src/features/cart/store/cart-store.ts`)

- **Server-Side Validation**: Added validation in `addItem()` method
  - Throws error if `meta.bakeSaleId` is not provided
  - Throws error if `meta.locationId` is not provided
  - Throws error if `meta.fulfillmentMethod` is not provided
  - Error messages: "A bake sale date must be selected" / "A location must be selected"
- **Location Metadata**: All cart items store `meta.location` (location name, not just ID)

### 6. **Admin Location Management** (NEW)

- **Location Configuration**: Admins can define available locations via admin dashboard
- **Location Model** (`src/lib/db/schema/locations.ts`):
  - `id`: Unique location identifier
  - `name`: Display name (e.g., "Station Road, Cressage", "Town Hall", "Market Square")
  - `isDefault`: Boolean (typically true for "Station Road, Cressage")
  - `isActive`: Boolean (inactive locations hidden from user selection)
  - `description`: Optional additional details (postcode, parking info, etc.)
  - `createdAt`, `updatedAt`: Timestamps
- **Admin Endpoints**: CRUD operations for location management (Phase 4+)

### 7. **Cart Item Structure** (UPDATED)

```typescript
interface CartItem {
  productId: string;
  quantity: number;
  meta: {
    bakeSaleId: string; // ✅ Required
    locationId: string; // ✅ Required (NEW)
    location: {
      // ✅ Location details (NEW)
      id: string;
      name: string; // User-visible location
    };
    fulfillmentMethod: "collection" | "delivery"; // ✅ Required
  };
}
```

## User Journey

### ✅ **Correct Flow** - Adding Items to Cart

1. User visits product listing page
2. User clicks on a product to view details
3. On product detail page, user **selects a bake sale date**
4. On product detail page, user sees the **admin-selected location** for that date
   - Location is displayed prominently (address visible)
   - Location name shown with "Admin-Selected Location" label
   - User **cannot change** the location
5. User **acknowledges** the location by checking: "I understand this order will be at [Location Name]"
6. User selects fulfillment method (collection/delivery)
7. User selects quantity
8. User clicks "Add to Cart" - **SUCCESS**
9. Item is added to cart with bake sale date + location metadata
10. Cart shows location clearly: "Pickup at: Station Road, Cressage" or "Delivery to location: [Location Name]"

### ❌ **Prevented Flows**

1. **Quick Add from Product Grid**:

   - User clicks "Add" or "Quick Add" on product card
   - Error message appears: "Please select a bake sale date and location from the product details page"
   - User must navigate to product detail page

2. **Quick Add from Featured Products**:

   - User clicks "Add" on featured product
   - Error message appears: "Please select a bake sale date and location from the product details page"
   - User must navigate to product detail page

3. **Add Without Date Selection**:

   - Even if code bypasses UI validation
   - Cart store `addItem()` method validates both `bakeSaleId` and `locationId`
   - Throws error: "A bake sale date and location must be selected"

4. **Add Without Location Acknowledgment**:
   - User tries to add to cart without acknowledging location
   - Add to Cart button remains disabled
   - Error message: "Please acknowledge the bake sale location to proceed"
   - Location acknowledgment checkbox must be checked

## Benefits

✅ **Data Integrity**: All cart items guaranteed to have valid bake sale date AND location  
✅ **User Awareness**: Location displayed prominently so users know where to collect/receive order  
✅ **Admin Control**: Admins define location per bake sale (users cannot override)  
✅ **User Acknowledgment**: Users must explicitly agree to the location before checkout  
✅ **Clear UX**: Users understand both date and location are required and location is non-negotiable  
✅ **Redundant Validation**: Both UI and store-level validation  
✅ **Order Processing**: No ambiguity about which location an item belongs to  
✅ **Flexibility**: Supports multiple locations for future growth (market stalls, pop-ups, etc.)

## Testing Checklist

- [ ] Quick add buttons on product grid show "Select Date to Add"
- [ ] Quick add on featured products shows error toast mentioning location requirement
- [ ] Product detail page shows admin-selected location (read-only display)
- [ ] Location displayed with "Admin-Selected Location" badge
- [ ] Location name, address, and description are displayed clearly
- [ ] Acknowledgment checkbox visible: "I understand this order will be at [Location Name]"
- [ ] Add to Cart button disabled until both date AND location acknowledged
- [ ] Button text changes when acknowledgment incomplete
- [ ] Adding item to cart shows success message with location
- [ ] Cart displays item with correct bake sale date AND location name
- [ ] Error handling works if store validation catches missing locationId
- [ ] Users cannot select or override the location for a bake sale date
- [ ] Multiple items for same date+location are grouped correctly
- [ ] Multiple items for different locations are tracked separately
- [ ] Admin can assign locations to bake sale dates via admin dashboard
- [ ] Location assignment affects what users see on product detail page
- [ ] Changing bake sale date changes the location accordingly

## Admin Features (Phase 5+)

### Location Management Dashboard

**Admin Endpoints:**

- `POST /api/admin/locations` - Create new location
- `GET /api/admin/locations` - List all locations
- `PATCH /api/admin/locations/:id` - Update location (name, description, active status)
- `DELETE /api/admin/locations/:id` - Deactivate location (soft delete)
- `POST /api/admin/bake-sales/:bakeSaleId/location` - Assign location to bake sale date
- `GET /api/admin/bake-sales/:bakeSaleId/location` - Get location assigned to bake sale date

**Location Properties:**

```json
{
  "id": "loc_123",
  "name": "Station Road, Cressage",
  "description": "Main bake sale location. Parking available.",
  "postcode": "SY5 6AL",
  "isDefault": true,
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

**Admin Workflows:**

1. Create new location for upcoming event (e.g., "Market Hall, Shrewsbury")
2. Set inactive locations to hide from user selection
3. Update location details (e.g., parking info changes)
4. View which bake sale dates use each location

## Files Modified

1. `src/features/cart/components/add-to-cart-button.tsx`
2. `src/components/product/product-details-client.tsx` - **Location selector added**
3. `src/app/products/products-content-client.tsx`
4. `src/components/storefront/featured-products.tsx`
5. `src/features/cart/store/cart-store.ts` - **Location validation added**
6. `src/lib/db/schema/locations.ts` - **NEW: Location schema**
7. `src/lib/validators/location.ts` - **NEW: Location validation**

## Database Schema Changes

**New Table: `locations`**

```sql
CREATE TABLE locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  postcode TEXT,
  isDefault BOOLEAN NOT NULL DEFAULT FALSE,
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(name)
);

-- Initial data
INSERT INTO locations (id, name, postcode, isDefault, isActive)
VALUES ('loc_default', 'Station Road, Cressage', 'SY5 6AL', true, true);
```

**Updated: `cart_items` table**

```sql
-- Add location relationship (if needed for order tracking)
ALTER TABLE cart_items ADD COLUMN locationId TEXT;
ALTER TABLE cart_items ADD FOREIGN KEY (locationId) REFERENCES locations(id);
```

## Implementation Notes

1. **Location Display Component**: Create reusable `LocationDisplay` component (read-only)

   - Fetches assigned location for selected bake sale date
   - Displays location name + description (read-only)
   - Shows "Admin-Selected Location" badge
   - Includes acknowledgment checkbox
   - Does NOT allow user to change location

2. **Cart Metadata Structure**: Update to include location details

   - Store both `locationId` (for database tracking)
   - Store `location` object (for UI display)
   - Include in order confirmation email

3. **Order Processing**: When order created

   - Verify all items have same location (or allow mixed locations per Phase requirements)
   - Store location in order record
   - Include location in delivery/collection instructions

4. **User Communication**: Display location in:
   - Product detail page (prominently)
   - Cart summary
   - Order confirmation
   - Email receipt
5. `src/features/cart/store/cart-store.ts`
