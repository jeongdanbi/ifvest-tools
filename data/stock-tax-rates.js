/**
 * 증권거래세 세율 데이터
 *
 * 출처:
 * - 기획재정부 2025년 세법개정안 (증권거래세법 시행령)
 * - PwC Tax Summaries Republic of Korea (Other taxes)
 * - 키움투자자산운용 2026 정책 정리
 *
 * 검증일: 2026-05-20
 * 다음 점검 권장 시점: 2026-12 (2027년 세법 개정안 발표 시점)
 *
 * 세율 구성:
 *   - 증권거래세(본세) + 농어촌특별세(부가)
 *   - 사용자에게 노출되는 합계 세율(rate) 기준으로 계산
 */

export const STOCK_TAX_RATES = {
  KOSPI: {
    label: "KOSPI (코스피)",
    2025: {
      rate: 0.0015, // 합계 0.15% (증권거래세 0% + 농특세 0.15%)
      breakdown: { tax: 0, surtax: 0.0015 },
    },
    2026: {
      rate: 0.002, // 합계 0.20% (증권거래세 0.05% + 농특세 0.15%)
      breakdown: { tax: 0.0005, surtax: 0.0015 },
    },
  },
  KOSDAQ: {
    label: "KOSDAQ (코스닥)",
    2025: {
      rate: 0.0015, // 합계 0.15%
      breakdown: { tax: 0.0015, surtax: 0 },
    },
    2026: {
      rate: 0.002, // 합계 0.20%
      breakdown: { tax: 0.002, surtax: 0 },
    },
  },
};

export const MARKET_OPTIONS = [
  { value: "KOSPI", label: "KOSPI" },
  { value: "KOSDAQ", label: "KOSDAQ" },
];
