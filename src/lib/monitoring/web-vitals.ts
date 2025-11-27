import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from "web-vitals";

/**
 * Web Vitals Monitoring
 * Tracks Core Web Vitals and sends them to analytics platforms
 */

// Extend window interface for analytics libraries
declare global {
  interface Window {
    Logflare?: {
      info: (event: string, data: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Send metric to Logflare
 */
function sendToLogflare(metric: Metric): void {
  if (typeof window !== "undefined" && window.Logflare) {
    window.Logflare.info("web_vital", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });
  }
}

/**
 * Send metric to Google Analytics
 */
function sendToGA(metric: Metric): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      event_category: "Web Vitals",
      event_label: metric.id,
      non_interaction: true,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    });
  }
}

/**
 * Send metric to analytics platforms
 */
function sendToAnalytics(metric: Metric): void {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
    });
  }

  // Send to analytics platforms
  sendToLogflare(metric);
  sendToGA(metric);
}

/**
 * Initialize Web Vitals monitoring
 * Should be called once on app initialization
 */
export function initWebVitals(): void {
  // Core Web Vitals
  onCLS(sendToAnalytics); // Cumulative Layout Shift
  onINP(sendToAnalytics); // Interaction to Next Paint (replaces FID)
  onLCP(sendToAnalytics); // Largest Contentful Paint

  // Other Web Vitals
  onFCP(sendToAnalytics); // First Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
}

/**
 * Web Vitals thresholds for ratings
 * https://web.dev/vitals/
 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  INP: {
    good: 200,
    needsImprovement: 500,
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
};

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  metricName: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needsImprovement) return "needs-improvement";
  return "poor";
}
