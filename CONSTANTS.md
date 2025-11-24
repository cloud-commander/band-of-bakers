# Constants Documentation

This document provides a comprehensive guide to all application constants used in Band of Bakers v2.

## Table of Contents

1. [Frontend Constants](#frontend-constants)
2. [Backend Constants](#backend-constants)
3. [Usage Examples](#usage-examples)
4. [Adding New Constants](#adding-new-constants)

---

## Frontend Constants

Frontend constants are defined in [`src/lib/constants/frontend.ts`](src/lib/constants/frontend.ts) and control UI behavior, animations, and styling.

### Animation Durations

Controls the duration of animation effects throughout the application.

```typescript
import { ANIMATION_DURATIONS } from "@/lib/constants";

// Available durations (in seconds)
ANIMATION_DURATIONS.FADE_IN; // 0.6s - Fade-in animation
ANIMATION_DURATIONS.BENTO_GRID; // 0.5s - Bento grid item animation
ANIMATION_DURATIONS.FEATURE_GRID; // 0.6s - Feature grid item animation
```

**Usage Example:**

```typescript
<motion.div transition={{ duration: ANIMATION_DURATIONS.FADE_IN }}>Content</motion.div>
```

### Animation Delays

Controls stagger delays between animated items.

```typescript
import { ANIMATION_DELAYS } from "@/lib/constants";

// Available delays (in seconds)
ANIMATION_DELAYS.STAGGER; // 0.1s - Delay between items in sequence
```

**Usage Example:**

```typescript
{
  items.map((item, index) => (
    <motion.div key={item.id} transition={{ delay: index * ANIMATION_DELAYS.STAGGER }}>
      {item.content}
    </motion.div>
  ));
}
```

### UI Thresholds

Controls UI behavior thresholds like scroll distances.

```typescript
import { UI_THRESHOLDS } from "@/lib/constants";

// Available thresholds (in pixels)
UI_THRESHOLDS.SCROLL_NAVBAR; // 10px - Scroll distance to trigger navbar background
```

**Usage Example:**

```typescript
const handleScroll = () => {
  setIsScrolled(window.scrollY > UI_THRESHOLDS.SCROLL_NAVBAR);
};
```

### Layout Constants

Controls layout dimensions and spacing.

```typescript
import { LAYOUT } from "@/lib/constants";

// Available layout values
LAYOUT.MAX_WIDTH; // 1400px - Maximum content width
LAYOUT.PADDING; // 16px - Standard padding
LAYOUT.GAP; // 32px - Standard gap between elements
```

### Breakpoints

Responsive design breakpoints.

```typescript
import { BREAKPOINTS } from "@/lib/constants";

// Available breakpoints (in pixels)
BREAKPOINTS.MOBILE; // 640px
BREAKPOINTS.TABLET; // 768px
BREAKPOINTS.DESKTOP; // 1024px
BREAKPOINTS.LARGE; // 1280px
```

### Colors

CSS variable references for consistent theming.

```typescript
import { COLORS } from "@/lib/constants";

// Available colors
COLORS.BG_WARM; // var(--bg-warm)
COLORS.TEXT_MAIN; // var(--text-main)
COLORS.ACCENT; // var(--accent)
COLORS.CARD_BG; // var(--card-bg)
```

### Fonts

CSS variable references for typography.

```typescript
import { FONTS } from "@/lib/constants";

// Available fonts
FONTS.DM_SERIF; // var(--font-dm-serif)
FONTS.GEIST_SANS; // var(--font-geist-sans)
```

### Form Validation

Form field constraints.

```typescript
import { FORM_VALIDATION } from "@/lib/constants";

// Available constraints
FORM_VALIDATION.MIN_PASSWORD_LENGTH; // 8
FORM_VALIDATION.MAX_EMAIL_LENGTH; // 254
FORM_VALIDATION.MIN_NAME_LENGTH; // 2
FORM_VALIDATION.MAX_NAME_LENGTH; // 100
```

### API Endpoints

API endpoint URLs.

```typescript
import { API_ENDPOINTS } from "@/lib/constants";

// Available endpoints
API_ENDPOINTS.BASE; // /api
API_ENDPOINTS.PRODUCTS; // /api/products
API_ENDPOINTS.ORDERS; // /api/orders
API_ENDPOINTS.USERS; // /api/users
API_ENDPOINTS.AUTH; // /api/auth
```

### Feature Flags

Feature toggles for experimental or upcoming features.

```typescript
import { FEATURE_FLAGS } from "@/lib/constants";

// Available flags
FEATURE_FLAGS.NEW_CHECKOUT; // false
FEATURE_FLAGS.PRODUCT_REVIEWS; // false
FEATURE_FLAGS.WISHLIST; // false
```

**Usage Example:**

```typescript
{
  FEATURE_FLAGS.PRODUCT_REVIEWS && <ReviewsSection />;
}
```

### Messages

User-facing messages.

```typescript
import { MESSAGES } from "@/lib/constants";

// Available messages
MESSAGES.SUCCESS; // "Operation completed successfully"
MESSAGES.ERROR; // "An error occurred. Please try again."
MESSAGES.LOADING; // "Loading..."
MESSAGES.NO_DATA; // "No data available"
```

---

## Backend Constants

Backend constants are defined in [`src/lib/constants/backend.ts`](src/lib/constants/backend.ts) and control business logic, data validation, and server-side behavior.

### Database Constraints

Field length constraints for database validation.

```typescript
import { DB_CONSTRAINTS } from "@/lib/constants";

// Available constraints
DB_CONSTRAINTS.MAX_PRODUCT_NAME; // 255
DB_CONSTRAINTS.MAX_PRODUCT_DESCRIPTION; // 2000
DB_CONSTRAINTS.MAX_CATEGORY_NAME; // 100
DB_CONSTRAINTS.MAX_USER_NAME; // 255
DB_CONSTRAINTS.MAX_EMAIL_LENGTH; // 254
DB_CONSTRAINTS.MAX_ORDER_NOTES; // 500
```

### Pricing

Pricing and financial constants.

```typescript
import { PRICING } from "@/lib/constants";

// Available pricing values
PRICING.MIN_ORDER_VALUE; // 5.0 GBP
PRICING.DELIVERY_FEE; // 5.0 GBP
PRICING.FREE_DELIVERY_THRESHOLD; // 50.0 GBP
PRICING.MAX_DISCOUNT_PERCENTAGE; // 100
PRICING.CURRENCY; // "GBP"
```

### Order Statuses

Valid order status values.

```typescript
import { ORDER_STATUSES } from "@/lib/constants";

// Available statuses
ORDER_STATUSES.PENDING; // "pending"
ORDER_STATUSES.PROCESSING; // "processing"
ORDER_STATUSES.READY; // "ready"
ORDER_STATUSES.FULFILLED; // "fulfilled"
ORDER_STATUSES.CANCELLED; // "cancelled"
ORDER_STATUSES.REFUNDED; // "refunded"
```

**Usage Example:**

```typescript
if (order.status === ORDER_STATUSES.FULFILLED) {
  // Order is complete
}
```

### Payment Methods

Valid payment method values.

```typescript
import { PAYMENT_METHODS } from "@/lib/constants";

// Available methods
PAYMENT_METHODS.STRIPE; // "stripe"
PAYMENT_METHODS.PAYPAL; // "paypal"
PAYMENT_METHODS.BANK_TRANSFER; // "bank_transfer"
PAYMENT_METHODS.PAYMENT_ON_COLLECTION; // "payment_on_collection"
```

### Payment Statuses

Valid payment status values.

```typescript
import { PAYMENT_STATUSES } from "@/lib/constants";

// Available statuses
PAYMENT_STATUSES.PENDING; // "pending"
PAYMENT_STATUSES.COMPLETED; // "completed"
PAYMENT_STATUSES.FAILED; // "failed"
PAYMENT_STATUSES.REFUNDED; // "refunded"
```

### Fulfillment Methods

Valid fulfillment method values.

```typescript
import { FULFILLMENT_METHODS } from "@/lib/constants";

// Available methods
FULFILLMENT_METHODS.COLLECTION; // "collection"
FULFILLMENT_METHODS.DELIVERY; // "delivery"
```

### User Roles

Valid user role values.

```typescript
import { USER_ROLES } from "@/lib/constants";

// Available roles
USER_ROLES.CUSTOMER; // "customer"
USER_ROLES.STAFF; // "staff"
USER_ROLES.MANAGER; // "manager"
USER_ROLES.OWNER; // "owner"
```

**Usage Example:**

```typescript
if (user.role === USER_ROLES.OWNER) {
  // Show admin features
}
```

### Stripe Configuration

Stripe API configuration.

```typescript
import { STRIPE } from "@/lib/constants";

// Available configuration
STRIPE.API_VERSION; // "2024-04-10"
STRIPE.WEBHOOK_TIMEOUT; // 5000ms
```

### Email Templates

Email template identifiers.

```typescript
import { EMAIL_TEMPLATES } from "@/lib/constants";

// Available templates
EMAIL_TEMPLATES.ORDER_CONFIRMATION; // "order-confirmation"
EMAIL_TEMPLATES.ORDER_SHIPPED; // "order-shipped"
EMAIL_TEMPLATES.ORDER_DELIVERED; // "order-delivered"
EMAIL_TEMPLATES.PASSWORD_RESET; // "password-reset"
EMAIL_TEMPLATES.WELCOME; // "welcome"
```

### Rate Limits

API rate limiting thresholds.

```typescript
import { RATE_LIMITS } from "@/lib/constants";

// Available limits
RATE_LIMITS.AUTH_ATTEMPTS_PER_MINUTE; // 5
RATE_LIMITS.API_READ_PER_MINUTE; // 100
RATE_LIMITS.API_WRITE_PER_MINUTE; // 10
RATE_LIMITS.PAYMENT_PER_SECOND; // 1
RATE_LIMITS.IMAGE_UPLOADS_PER_DAY; // 10
```

### Cache TTL

Cache time-to-live values (in seconds).

```typescript
import { CACHE_TTL } from "@/lib/constants";

// Available TTL values
CACHE_TTL.SESSION; // 86400 (24 hours)
CACHE_TTL.AUTH_TOKEN; // 3600 (1 hour)
CACHE_TTL.QUERY; // 900 (15 minutes)
CACHE_TTL.PRODUCT; // 600 (10 minutes)
CACHE_TTL.USER; // 300 (5 minutes)
CACHE_TTL.TEMPORARY; // 3600 (1 hour)
```

### Business Rules

Business logic constants.

```typescript
import { BUSINESS_RULES } from "@/lib/constants";

// Available rules
BUSINESS_RULES.BAKE_SALE_CUTOFF_DAYS; // 2
BUSINESS_RULES.MAX_ITEMS_PER_ORDER; // 100
BUSINESS_RULES.MIN_ITEMS_PER_ORDER; // 1
BUSINESS_RULES.ORDER_HISTORY_RETENTION_DAYS; // 365
BUSINESS_RULES.VOUCHER_CODE_LENGTH; // 10
```

### Pagination

Pagination configuration.

```typescript
import { PAGINATION } from "@/lib/constants";

// Available configuration
PAGINATION.DEFAULT_PAGE_SIZE; // 20
PAGINATION.MAX_PAGE_SIZE; // 100
PAGINATION.MIN_PAGE_SIZE; // 1
```

### Error Codes

Application error codes.

```typescript
import { ERROR_CODES } from "@/lib/constants";

// Available error codes
ERROR_CODES.UNAUTHORIZED; // "UNAUTHORIZED"
ERROR_CODES.FORBIDDEN; // "FORBIDDEN"
ERROR_CODES.NOT_FOUND; // "NOT_FOUND"
ERROR_CODES.VALIDATION_ERROR; // "VALIDATION_ERROR"
ERROR_CODES.INTERNAL_ERROR; // "INTERNAL_ERROR"
ERROR_CODES.PAYMENT_FAILED; // "PAYMENT_FAILED"
ERROR_CODES.OUT_OF_STOCK; // "OUT_OF_STOCK"
```

### Logging

Logging level constants.

```typescript
import { LOGGING } from "@/lib/constants";

// Available levels
LOGGING.DEBUG; // "debug"
LOGGING.INFO; // "info"
LOGGING.WARNING; // "warning"
LOGGING.ERROR; // "error"
```

---

## Usage Examples

### Example 1: Using Constants in a Component

```typescript
import { ANIMATION_DURATIONS, ANIMATION_DELAYS, UI_THRESHOLDS } from "@/lib/constants";
import { motion } from "framer-motion";

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATIONS.FADE_IN }}
    >
      Content
    </motion.div>
  );
}
```

### Example 2: Using Constants in Server Actions

```typescript
import { ORDER_STATUSES, PRICING, CACHE_TTL } from "@/lib/constants";

export async function createOrder(items: OrderItem[]) {
  // Validate minimum order value
  const total = items.reduce((sum, item) => sum + item.price, 0);
  if (total < PRICING.MIN_ORDER_VALUE) {
    throw new Error(`Minimum order value is £${PRICING.MIN_ORDER_VALUE}`);
  }

  // Create order with initial status
  const order = await db.orders.create({
    status: ORDER_STATUSES.PENDING,
    total,
  });

  // Cache the order
  await cache.set(`order:${order.id}`, order, CACHE_TTL.QUERY);

  return order;
}
```

### Example 3: Using Constants for Validation

```typescript
import { DB_CONSTRAINTS, FORM_VALIDATION } from "@/lib/constants";

export function validateProductName(name: string): boolean {
  return name.length > 0 && name.length <= DB_CONSTRAINTS.MAX_PRODUCT_NAME;
}

export function validatePassword(password: string): boolean {
  return password.length >= FORM_VALIDATION.MIN_PASSWORD_LENGTH;
}
```

### Example 4: Using Constants for Conditional Rendering

```typescript
import { FEATURE_FLAGS, USER_ROLES } from "@/lib/constants";

export function Dashboard({ user }) {
  return (
    <div>
      {FEATURE_FLAGS.PRODUCT_REVIEWS && <ReviewsSection />}

      {user.role === USER_ROLES.OWNER && <AdminPanel />}

      {[USER_ROLES.MANAGER, USER_ROLES.OWNER].includes(user.role) && <ReportsSection />}
    </div>
  );
}
```

---

## Adding New Constants

When adding new constants, follow these guidelines:

### 1. Determine the Category

- **Frontend:** UI, animations, styling, form validation
- **Backend:** Business logic, database, pricing, payment

### 2. Add to Appropriate File

```typescript
// src/lib/constants/frontend.ts or src/lib/constants/backend.ts

export const MY_NEW_CONSTANTS = {
  VALUE_ONE: "value1",
  VALUE_TWO: 42,
  VALUE_THREE: true,
} as const;
```

### 3. Export from Index

```typescript
// src/lib/constants/index.ts

export { MY_NEW_CONSTANTS } from "./frontend"; // or "./backend"
```

### 4. Document in This File

Add a new section documenting the constants with examples.

### 5. Use in Code

```typescript
import { MY_NEW_CONSTANTS } from "@/lib/constants";

// Use the constant
if (value === MY_NEW_CONSTANTS.VALUE_ONE) {
  // ...
}
```

---

## Best Practices

1. **Use `as const`** - Ensures TypeScript infers literal types
2. **Group Related Constants** - Organize by feature or domain
3. **Add JSDoc Comments** - Document purpose and usage
4. **Use Descriptive Names** - Make purpose clear from name
5. **Avoid Magic Numbers** - Always use constants instead
6. **Keep Values Centralized** - Single source of truth
7. **Type Exports** - Export types alongside constants
8. **Update Documentation** - Keep this file in sync with code

---

## Environment-Specific Constants (Future)

When the project scales, consider creating environment-specific constants:

```typescript
// src/lib/constants/development.ts
// src/lib/constants/production.ts
// src/lib/constants/staging.ts

// Load based on NODE_ENV
const constants =
  process.env.NODE_ENV === "production" ? require("./production") : require("./development");
```

---

## Related Files

- [`src/lib/constants/frontend.ts`](src/lib/constants/frontend.ts) - Frontend constants
- [`src/lib/constants/backend.ts`](src/lib/constants/backend.ts) - Backend constants
- [`src/lib/constants/index.ts`](src/lib/constants/index.ts) - Constants index/exports
- [`src/lib/mocks/`](src/lib/mocks/) - Mock data (separate from constants)
- [`src/lib/validators/`](src/lib/validators/) - Zod validators (separate from constants)
