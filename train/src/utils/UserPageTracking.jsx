// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-WTG14QKHLT', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
};
