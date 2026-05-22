/**
 * 금액 포맷팅 유틸
 */

/**
 * 1234567 -> "1,234,567"
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return "0";
  return Math.round(value).toLocaleString("ko-KR");
}

/**
 * 1234567 -> "123만 4,567"
 * 12345 -> "1만 2,345"
 * 999 -> "999"
 */
export function formatKorean(value) {
  if (!value || isNaN(value)) return "0원";
  const rounded = Math.round(value);
  if (rounded === 0) return "0원";

  const eok = Math.floor(rounded / 100000000);
  const man = Math.floor((rounded % 100000000) / 10000);
  const rest = rounded % 10000;

  const parts = [];
  if (eok > 0) parts.push(`${formatNumber(eok)}억`);
  if (man > 0) parts.push(`${formatNumber(man)}만`);
  if (rest > 0) parts.push(`${formatNumber(rest)}`);

  return parts.join(" ") + "원";
}

/**
 * 0.0015 -> "0.15%"
 */
export function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return "0%";
  return (value * 100).toFixed(decimals).replace(/\.?0+$/, "") + "%";
}

/**
 * 입력값에서 콤마·공백 제거하고 숫자로
 */
export function parseAmount(input) {
  if (typeof input === "number") return input;
  if (!input) return 0;
  const cleaned = String(input).replace(/[^\d]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}
