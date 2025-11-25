# Analytics & Monitoring Setup Guide

## Overview

Band of Bakers now has comprehensive monitoring across all pages with three integrated services:

1. **Google Analytics** - User behavior and traffic analytics
2. **Rollbar** - Real-time error tracking and reporting
3. **Logflare** - Structured logging for debugging and analytics

## Google Analytics Setup

### Configuration

Google Analytics is loaded globally on every page via the `<GoogleAnalytics />` component in the root layout.

**Required Environment Variable:**

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G_XXXXXXXXXX
```

### How It Works

- **Measurement ID**: Get from [Google Analytics 4](https://analytics.google.com)
- **Public Variable**: Safe to expose in frontend code (prefixed with `NEXT_PUBLIC_`)
- **Tracking**: Automatic page views via gtag
- **File**: `/src/components/analytics/google-analytics.tsx`

### Features

- Automatic page view tracking
- Event tracking support (can be extended)
- Custom dimensions and metrics
- User engagement metrics
- Conversion tracking

### Usage Examples

```typescript
// Track custom events (available globally in browser)
gtag("event", "add_to_cart", {
  currency: "GBP",
  value: 19.99,
  items: [{ item_id: "1", item_name: "Sourdough" }],
});

// Track form submissions
gtag("event", "form_submit", {
  form_name: "contact",
});

// Track purchases
gtag("event", "purchase", {
  transaction_id: "12345",
  value: 49.99,
  currency: "GBP",
  items: [
    /* items array */
  ],
});
```

---

## Rollbar Setup

### Client-Side Configuration

**Required Environment Variables:**

```env
NEXT_PUBLIC_ROLLBAR_TOKEN=your_browser_token_here
NEXT_PUBLIC_ROLLBAR_DISABLED=false
NEXT_PUBLIC_ROLLBAR_DEBUG=false
```

### Server-Side Configuration

**Required Environment Variables:**

```env
ROLLBAR_SERVER_TOKEN=your_server_token_here
```

### How It Works

- **Browser Token**: Public token for client-side error tracking
- **Server Token**: Secret token for server-side error tracking
- **File (Client)**: `/src/components/analytics/rollbar-provider.tsx`
- **File (Server)**: `/src/lib/logger/server-rollbar.ts`

### Features

- **Client-Side**: Captures uncaught exceptions and promise rejections
- **Server-Side**: Tracks API errors and server-side exceptions
- **Source Maps**: Enabled for better stack traces
- **Automatic Reporting**: Errors are automatically reported

### Usage Examples

**Server-Side:**

```typescript
import { serverRollbar, reportError } from "@/lib/logger/server-rollbar";

// Log an error
await serverRollbar.error("Payment processing failed", {
  orderId: "12345",
  amount: 49.99,
});

// Log a warning
await serverRollbar.warn("High API latency detected", {
  endpoint: "/api/checkout",
  responseTime: 5000,
});

// Report error with details
try {
  // Some operation
} catch (error) {
  await reportError(error, "error", {
    context: "checkout",
    userId: "123",
  });
}
```

**Client-Side:**

```typescript
// Rollbar is automatically initialized
// Errors are captured automatically

// Manual reporting (if needed)
if (typeof window !== "undefined" && (window as any).Rollbar) {
  (window as any).Rollbar.error("Custom error", {
    customData: "value",
  });
}
```

---

## Logflare Setup

### Configuration

**Required Environment Variables:**

```env
# Server-side logging
BANDOFBAKERS_LOGFLARE_API_KEY=your_api_key_here
BANDOFBAKERS_LOGFLARE_SOURCE_ID=your_source_id_here

# Client-side logging
NEXT_PUBLIC_LOGFLARE_API_KEY=your_api_key_here
NEXT_PUBLIC_LOGFLARE_SOURCE_ID=your_source_id_here
NEXT_PUBLIC_LOGFLARE_DEBUG=false
```

### How It Works

- **API Key**: Authentication for Logflare API
- **Source ID**: Identifies which log stream to send to
- **File (Client)**: `/src/components/analytics/logflare-provider.tsx`
- **File (Server)**: `/src/lib/logger/server-logger.ts`

### Features

- **Structured Logging**: JSON-formatted logs with metadata
- **Client-Side**: Automatic page view logging and error capture
- **Server-Side**: Application event logging
- **Metadata**: Automatic inclusion of URL, user agent, timestamp

### Usage Examples

**Server-Side:**

```typescript
import { serverLogger, logInfo, logWarn, logError } from "@/lib/logger/server-logger";

// Log info
await logInfo("User signed up", {
  userId: "123",
  email: "user@example.com",
});

// Log warning
await logWarn("Stock low for product", {
  productId: "456",
  quantity: 2,
});

// Log error
await logError("Database connection failed", {
  database: "postgres",
  error: error.message,
});

// Using the logger object
await serverLogger.debug("Debug info", { data: "value" });
```

**Client-Side:**

```typescript
// Logflare is automatically initialized
// Page views are automatically logged

// Manual logging (if needed)
if (typeof window !== "undefined" && (window as any).Logflare) {
  (window as any).Logflare.info("User completed checkout", {
    orderId: "12345",
    total: 49.99,
  });
}
```

---

## Integration Points

### In Root Layout (`src/app/layout.tsx`)

```typescript
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { RollbarProvider } from "@/components/analytics/rollbar-provider";
import { LogflareProvider } from "@/components/analytics/logflare-provider";

// Inside the body component:
<GoogleAnalytics /> {/* In <head> */}
<RollbarProvider />
<LogflareProvider />
```

### Available Everywhere

All three services are initialized globally:

- **Google Analytics**: Available via `gtag()` function
- **Rollbar**: Available via `window.Rollbar` on client-side
- **Logflare**: Available via `window.Logflare` on client-side
- **Server Logger**: Import in any server component or API route

---

## Environment Variables Summary

| Variable                          | Type   | Purpose                      | Required              |
| --------------------------------- | ------ | ---------------------------- | --------------------- |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Public | GA4 measurement ID           | Yes for analytics     |
| `NEXT_PUBLIC_ROLLBAR_TOKEN`       | Public | Client-side error tracking   | Yes for client errors |
| `ROLLBAR_SERVER_TOKEN`            | Secret | Server-side error tracking   | Yes for server errors |
| `NEXT_PUBLIC_ROLLBAR_DISABLED`    | Public | Disable Rollbar (true/false) | No (default: false)   |
| `NEXT_PUBLIC_ROLLBAR_DEBUG`       | Public | Debug mode (true/false)      | No (default: false)   |
| `BANDOFBAKERS_LOGFLARE_API_KEY`   | Secret | Server logging API key       | Yes for server logs   |
| `BANDOFBAKERS_LOGFLARE_SOURCE_ID` | Secret | Server logs stream ID        | Yes for server logs   |
| `NEXT_PUBLIC_LOGFLARE_API_KEY`    | Public | Client logging API key       | Yes for client logs   |
| `NEXT_PUBLIC_LOGFLARE_SOURCE_ID`  | Public | Client logs stream ID        | Yes for client logs   |
| `NEXT_PUBLIC_LOGFLARE_DEBUG`      | Public | Debug mode (true/false)      | No (default: false)   |

---

## Best Practices

### When to Log vs Track

- **Google Analytics**: User interactions, page navigation, conversions
- **Rollbar**: Errors, warnings, critical issues
- **Logflare**: Debug info, performance data, system events

### Error Handling Example

```typescript
try {
  await processPayment(order);
  await logInfo("Payment processed", { orderId: order.id });
} catch (error) {
  // Logflare logs the error automatically
  await logError("Payment failed", {
    orderId: order.id,
    error: error.message,
  });

  // Rollbar also tracks it
  await reportError(error, "error", {
    context: "payment_processing",
    orderId: order.id,
  });

  // Notify user
  throw new Error("Payment processing failed");
}
```

### Performance Considerations

- **Logflare**: Has 5-second timeout to avoid blocking requests
- **Rollbar**: Asynchronous reporting doesn't block execution
- **GA**: Loads asynchronously after page interaction

---

## Monitoring Dashboard Access

### Google Analytics

- URL: https://analytics.google.com
- Get your Measurement ID from: Admin → Data Streams → Web

### Rollbar

- URL: https://rollbar.com
- Dashboard shows real-time errors with full stack traces

### Logflare

- URL: https://logflare.app
- Real-time logs with search and filtering capabilities

---

## Troubleshooting

### Logs Not Appearing in Logflare

- Verify API key and Source ID in environment variables
- Check `NEXT_PUBLIC_LOGFLARE_DEBUG=true` for browser console logs
- Ensure the Logflare Source exists and accepts logs

### Errors Not in Rollbar

- Check if `NEXT_PUBLIC_ROLLBAR_DISABLED=false`
- Verify tokens are correct in environment variables
- Check browser console for initialization messages with debug mode on

### Google Analytics Not Tracking

- Verify `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` format: `G-XXXXXXXXXX`
- Check GA settings allow events from your domain
- Wait 24-48 hours for first data to appear in GA dashboard

---

## Next Steps

1. **Get Service Credentials**: Sign up for each service if not already done
2. **Set Environment Variables**: Update `.env.local` with your credentials
3. **Test Integration**: Start dev server and verify logs/errors appear in dashboards
4. **Monitor Dashboards**: Regularly check Rollbar for errors, Logflare for trends
5. **Extend Tracking**: Add custom events to GA as needed for business metrics
