/**
 * 해외주식 양도세 + RIA 계좌 절세 계산
 *
 * 입력: 양도차익 (매도금액 − 매수원가) 단일
 * 출력: 일반 계좌 세금 vs RIA 계좌 세금 (시점별 3종)
 *
 * 공식:
 *   일반 계좌:
 *     과세표준 = max(0, 양도차익 - 250만 기본공제)
 *     세금 = 과세표준 × 22%
 *
 *   RIA 계좌 (매도 시점별 공제율 d):
 *     공제 후 양도차익 = 양도차익 × (1 - d)
 *     과세표준 = max(0, 공제 후 양도차익 - 250만 기본공제)
 *     세금 = 과세표준 × 22%
 *
 * ※ 본 계산기는 매도금액 5,000만 한도 내 양도차익으로 가정.
 *    한도 초과분은 일반 양도세 적용되므로 면책에 명시.
 */

import { OVERSEAS_TAX, RIA_DISCOUNT_PERIODS } from "@/data/ria-rates";

/**
 * 일반 해외주식 양도세 계산
 */
export function calcGeneralTax(gain) {
  if (!gain || gain <= 0) {
    return { gain: 0, taxable: 0, tax: 0, net: 0 };
  }
  const taxable = Math.max(0, gain - OVERSEAS_TAX.basicDeduction);
  const tax = taxable * OVERSEAS_TAX.rate;
  return {
    gain,
    deduction: OVERSEAS_TAX.basicDeduction,
    taxable,
    tax,
    net: gain - tax,
  };
}

/**
 * RIA 계좌 양도세 계산 (시점별 공제율 적용)
 */
export function calcRiaTax(gain, discountRate) {
  if (!gain || gain <= 0) {
    return {
      gain: 0,
      riaDeduction: 0,
      adjustedGain: 0,
      taxable: 0,
      tax: 0,
      net: 0,
      discountRate,
    };
  }
  const riaDeduction = gain * discountRate; // 시점별 양도소득 공제
  const adjustedGain = gain - riaDeduction;
  const taxable = Math.max(0, adjustedGain - OVERSEAS_TAX.basicDeduction);
  const tax = taxable * OVERSEAS_TAX.rate;
  return {
    gain,
    discountRate,
    riaDeduction,
    adjustedGain,
    basicDeduction: OVERSEAS_TAX.basicDeduction,
    taxable,
    tax,
    net: gain - tax,
  };
}

/**
 * 전 시나리오 비교 (일반 + RIA 3시점)
 */
export function calcAllScenarios(gain) {
  const general = calcGeneralTax(gain);
  const ria = RIA_DISCOUNT_PERIODS.map((period) => ({
    ...period,
    result: calcRiaTax(gain, period.discountRate),
    saving: general.tax - calcRiaTax(gain, period.discountRate).tax,
  }));

  return {
    general,
    ria,
    maxSaving: ria.length > 0 ? ria[0].saving : 0, // 100% 공제(5/31)가 최대 절세
  };
}
