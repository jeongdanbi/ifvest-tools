// lib/analytics/fire-gtag.js
import { trackEvent } from "./gtag";

/**
 * @typedef {"under_100m" | "100m_300m" | "300m_500m" | "500m_1b" | "1b_2b" | "over_2b"} AssetRange
 */

/**
 * @param {number} amountKrw
 * @returns {AssetRange}
 */
export function getAssetRange(amountKrw) {
  if (amountKrw < 100_000_000) return "under_100m";
  if (amountKrw < 300_000_000) return "100m_300m";
  if (amountKrw < 500_000_000) return "300m_500m";
  if (amountKrw < 1_000_000_000) return "500m_1b";
  if (amountKrw < 2_000_000_000) return "1b_2b";
  return "over_2b";
}

export function trackFireCalcStart() {
  if (typeof window === "undefined") return;
  if (window.sessionStorage?.getItem("fire_calc_started") === "1") return;
  trackEvent("fire_calc_start");
  try { window.sessionStorage?.setItem("fire_calc_started", "1"); } catch {}
}

export function trackFireCalcComplete(input) {
  trackEvent("fire_calc_complete", input);
}

export function trackFireCalcCtaClick(input) {
  trackEvent("fire_calc_cta_click", input);
}

export function trackFireCalcToggleRate(input) {
  trackEvent("fire_calc_toggle_rate", input);
}
