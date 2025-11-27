'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/monitoring/web-vitals';

/**
 * Web Vitals Provider Component
 * Initializes Web Vitals monitoring on the client
 */
export function WebVitalsProvider() {
  useEffect(() => {
    // Initialize Web Vitals monitoring
    initWebVitals();
  }, []);

  return null;
}
