# Reference

Technical reference documentation for Band of Bakers v2. These documents provide detailed information about system components, APIs, and configurations.

## Application Constants

- **[Constants Reference](constants-reference.md)** - Complete guide to all application constants, including frontend UI constants, backend business rules, database constraints, and API endpoints

## Analytics & Monitoring

- **[Analytics Monitoring](analytics-monitoring.md)** - Google Analytics and Logflare monitoring setup and configuration

## Project Phases & Reviews

- **[Day One Launch Review](day-one-launch-review.md)** - Comprehensive review of features included in the initial launch
- **[Phase 1 Completion](phase-1-completion.md)** - Project foundation setup and configuration
- **[Phase 2 Completion](phase-2-completion.md)** - Data layer implementation with schemas and mocks
- **[Phase 3 Completion](phase-3-completion.md)** - UI implementation with all user and admin pages

## Design System

- **[Design System Implementation](design-system-implementation.md)** - "Tactile Brutalism" design system and component architecture

## Reference Categories

### Constants & Configuration

- Application constants for UI, business logic, and API endpoints
- Database constraints and validation rules
- Feature flags and configuration options

### Analytics & Monitoring

- Google Analytics setup and event tracking
- Logflare logging configuration
- Web Vitals and performance monitoring

### Project Documentation

- Phase completion reviews and implementation details
- Launch readiness assessments
- Feature scope and requirements documentation

### Design & Architecture

- Design system specifications
- Component architecture
- Styling and theming constants

## Usage Examples

### Using Constants in Code

```typescript
import { ORDER_STATUSES, PRICING, API_ENDPOINTS } from "@/lib/constants";

// Check order status
if (order.status === ORDER_STATUSES.FULFILLED) {
  // Order is complete
}

// Apply pricing rules
const total = subtotal + (subtotal >= PRICING.FREE_DELIVERY_THRESHOLD ? 0 : PRICING.DELIVERY_FEE);

// Make API calls
const products = await fetch(API_ENDPOINTS.PRODUCTS);
```

### Analytics Implementation

```typescript
import { logInfo, logError } from "@/lib/logger";

// Log user actions
await logInfo("User completed purchase", {
  orderId: order.id,
  total: order.total,
  items: order.items.length,
});

// Track errors
await logError("Payment failed", {
  orderId: order.id,
  error: error.message,
  userId: user.id,
});
```

Each reference document includes:

- Complete technical specifications
- Usage examples and code samples
- Configuration options
- Implementation details
- Related files and dependencies
