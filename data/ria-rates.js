/**
 * RIA(국내시장복귀계좌) 세제 데이터
 *
 * 출처:
 * - 조세특례제한법 §16의5 (국내시장복귀계좌 양도소득 과세특례)
 * - 토스뱅크·KB·미래에셋·신한투자증권 RIA 공식 안내
 *
 * 검증일: 2026-05-21
 * 시행 기간: 2026.01.01 ~ 2026.12.31 (한시 제도)
 *
 * 핵심:
 *   - 매도금액 5,000만원 한도까지 양도소득 공제
 *   - 매도 시점별 단계 감면 (월말 기준)
 *   - 2025.12.23 이전 보유분만 대상
 *   - 매도 결제일로부터 1년 유지 의무 (위반 시 회수)
 */

// 해외주식 양도소득세 기본
export const OVERSEAS_TAX = {
  basicDeduction: 2_500_000, // 양도소득 기본공제 250만원 (연간)
  rate: 0.22, // 양도소득세 22% (소득세 20% + 지방소득세 2%)
};

// RIA 한도
export const RIA_LIMITS = {
  saleAmountCap: 50_000_000, // 매도금액 5,000만원 한도 (1인당)
  holdingDeadline: "2025-12-23", // 이 날 이전 보유분만 대상
  postSaleHoldYears: 1, // 매도 결제일로부터 1년 유지 의무
};

// 매도 시점별 공제율 (RIA 양도소득 공제)
export const RIA_DISCOUNT_PERIODS = [
  {
    key: "Q1",
    label: "2026년 5월 31일까지 매도",
    shortLabel: "~ 5/31",
    deadline: "2026-05-31",
    discountRate: 1.0, // 100% 공제 (사실상 면제)
  },
  {
    key: "Q2",
    label: "2026년 6월 1일 ~ 7월 31일 매도",
    shortLabel: "6/1 ~ 7/31",
    deadline: "2026-07-31",
    discountRate: 0.8, // 80% 공제
  },
  {
    key: "H2",
    label: "2026년 8월 1일 ~ 12월 31일 매도",
    shortLabel: "8/1 ~ 12/31",
    deadline: "2026-12-31",
    discountRate: 0.5, // 50% 공제
  },
];
