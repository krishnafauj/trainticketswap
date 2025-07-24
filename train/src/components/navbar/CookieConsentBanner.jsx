import React, { useEffect, useState } from 'react';

function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setShowBanner(true);
    else if (consent === 'granted') {
      loadAnalytics();
    }
  }, []);

  const handleConsent = () => {
    localStorage.setItem('cookieConsent', 'granted');
    setShowBanner(false);
    loadAnalytics();
  };

  const loadAnalytics = () => {
    if (window.gtag) {
      window.gtag('config', 'G-WTG14QKHLT', {
        anonymize_ip: true,
        page_path: window.location.pathname,
      });
    }
  };

  return (
    showBanner && (
      <div className="fixed bottom-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center z-50">
        <p className="mr-4">We use cookies to improve your experience.</p>
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleConsent}
        >
          Accept
        </button>
      </div>
    )
  );
}

export default CookieConsentBanner;
