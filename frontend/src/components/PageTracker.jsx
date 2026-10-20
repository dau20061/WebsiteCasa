import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GA_MEASUREMENT_ID = 'G-NTM6NJ07V5';

/**
 * PageTracker listens to client-side route changes in React Router (SPA)
 * and dispatches Google Analytics 4 page_view hits so all subpage navigations
 * are properly tracked without full page reloads.
 */
export default function PageTracker() {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial mount: index.html already fires the first page_view on load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Delay slightly (100ms) to ensure child SEO components have updated document.title
    const timer = setTimeout(() => {
      if (typeof window.gtag === 'function') {
        const pagePath = location.pathname + location.search;
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: pagePath,
          page_title: document.title,
          page_location: window.location.href,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
}
