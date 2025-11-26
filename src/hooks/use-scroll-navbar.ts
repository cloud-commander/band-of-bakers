import { useState, useEffect, useCallback } from 'react';

interface UseScrollNavbarOptions {
  threshold?: number;
}

/**
 * Custom hook to track scroll position for navbar styling
 * @param options - Configuration options
 * @param options.threshold - Scroll threshold in pixels (default: 10)
 * @returns boolean indicating if page is scrolled past threshold
 */
export function useScrollNavbar(options: UseScrollNavbarOptions = {}) {
  const { threshold = 10 } = options;
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position after mount
    const timer = setTimeout(() => {
      handleScroll();
    }, 0);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll]);

  return isScrolled;
}
