/**
 * Google Analytics 4 기본 래퍼
 */

export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  try {
    window.gtag("event", eventName, params);
  } catch (error) {
    console.error("GA4 trackEvent failed:", error);
  }
}
