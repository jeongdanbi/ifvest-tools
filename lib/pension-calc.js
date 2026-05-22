/**
 * 연금저축·IRP·일반 ISA·국민성장 ISA 절세 계산 로직
 *
 * 입력: 과세표준(taxableBase) 단일 + 각 계좌 납입액
 * 출력: 정확한 환급액
 *
 * 모든 함수는 순수 함수.
 */

import {
  TAX_DEDUCTION_RATES,
  PENSION_LIMITS,
  PENSION_DEDUCTION_THRESHOLD,
  ISA_LIMITS,
  GROWTH_ISA,
  MARGINAL_TAX_BRACKETS,
} from "@/data/pension-tax-rates";

/**
 * 과세표준 기반으로 연금저축·IRP 세액공제율 자동 판정
 *
 * 법령 기준: 종합소득금액 4,500만원 이하 → 16.5%, 초과 → 13.2%
 * (본 계산기는 과세표준 ≈ 종합소득금액으로 간주)
 */
export function findPensionDeductionRate(taxableBase) {
  if (taxableBase <= PENSION_DEDUCTION_THRESHOLD) {
    return TAX_DEDUCTION_RATES.HIGH.rate; // 16.5%
  }
  return TAX_DEDUCTION_RATES.LOW.rate; // 13.2%
}

/**
 * 과세표준에서 한계세율(현재 위치 구간) 찾기
 */
export function findMarginalRate(taxableBase) {
  if (!taxableBase || taxableBase <= 0) return 0;
  for (const bracket of MARGINAL_TAX_BRACKETS) {
    if (taxableBase <= bracket.upTo) return bracket.rate;
  }
  return MARGINAL_TAX_BRACKETS[MARGINAL_TAX_BRACKETS.length - 1].rate;
}

/**
 * 과세표준 base에서 deduction 만큼 소득공제 받았을 때 절세액 계산
 *
 * 구간 횡단 정확 계산.
 * 예: 과세표준 6,000만, 공제 1,800만 → 새 과세표준 4,200만
 *   - 5,000만 ~ 6,000만 구간(26.4%): 1,000만 × 26.4% = 2,640,000
 *   - 4,200만 ~ 5,000만 구간(16.5%): 800만 × 16.5% = 1,320,000
 *   - 총 절세 = 3,960,000원
 */
export function calcTaxSavingFromDeduction(taxableBase, deduction) {
  if (!taxableBase || taxableBase <= 0) return 0;
  if (!deduction || deduction <= 0) return 0;

  const newBase = Math.max(0, taxableBase - deduction);

  let saving = 0;
  let prevCap = 0;

  for (const bracket of MARGINAL_TAX_BRACKETS) {
    const segmentLow = Math.max(prevCap, newBase);
    const segmentHigh = Math.min(bracket.upTo, taxableBase);
    if (segmentHigh > segmentLow) {
      saving += (segmentHigh - segmentLow) * bracket.rate;
    }
    prevCap = bracket.upTo;
    if (prevCap >= taxableBase) break;
  }

  return saving;
}

/**
 * 국민성장 ISA 소득공제액 계산 (구간 누진)
 * 3,000만 이하 40% / 3,000~5,000만 20% / 5,000~7,000만 10% / 7,000만 초과 0%
 */
export function calcGrowthIsaDeduction(amount) {
  if (!amount || amount <= 0) return 0;

  let deduction = 0;
  let remaining = amount;
  let prevCap = 0;

  for (const bracket of GROWTH_ISA.brackets) {
    const bracketSize = bracket.upTo - prevCap;
    const taxable = Math.min(remaining, bracketSize);
    deduction += taxable * bracket.rate;
    remaining -= taxable;
    prevCap = bracket.upTo;
    if (remaining <= 0) break;
  }

  return Math.min(deduction, GROWTH_ISA.maxDeduction);
}

/**
 * 한도 가득 채울 때 환급액 계산
 * 과세표준이 없으면 환급액은 null (UI에서 안내)
 */
export function calcMaxScenario(taxableBase) {
  const pensionSaving = PENSION_LIMITS.PENSION_SAVING_ONLY; // 600만원
  const irp = PENSION_LIMITS.COMBINED_MAX - pensionSaving; // 300만원
  const isa = ISA_LIMITS.annualContribution; // 4,000만원
  const growthIsa = 70_000_000; // 7,000만 (1,800만 공제 최대치)

  const growthIsaDeduction = calcGrowthIsaDeduction(growthIsa);

  // 과세표준 입력 안 됐을 때
  if (!taxableBase || taxableBase <= 0) {
    return {
      taxableBase: null,
      pensionRate: null,
      marginalRate: null,
      pensionSaving,
      irp,
      isa,
      growthIsa,
      pensionRefund: null,
      irpRefund: null,
      growthIsaDeduction,
      growthIsaRefund: null,
      totalRefund: null,
      isaTaxSaving: ISA_LIMITS.taxFreeReturn * ISA_LIMITS.generalTaxRate,
      isaToPensionBonus: null,
      totalContribution: pensionSaving + irp + isa + growthIsa,
    };
  }

  const pensionRate = findPensionDeductionRate(taxableBase);
  const marginalRate = findMarginalRate(taxableBase);

  const pensionRefund = pensionSaving * pensionRate;
  const irpRefund = irp * pensionRate;
  const growthIsaRefund = calcTaxSavingFromDeduction(
    taxableBase,
    growthIsaDeduction
  );

  const isaTaxSaving = ISA_LIMITS.taxFreeReturn * ISA_LIMITS.generalTaxRate;
  const isaToPensionBonus =
    ISA_LIMITS.pensionTransferBonus.maxDeduction * pensionRate;

  const totalRefund = pensionRefund + irpRefund + growthIsaRefund;

  return {
    taxableBase,
    pensionRate,
    marginalRate,
    pensionSaving,
    irp,
    isa,
    growthIsa,
    pensionRefund,
    irpRefund,
    growthIsaDeduction,
    growthIsaRefund,
    totalRefund,
    isaTaxSaving,
    isaToPensionBonus,
    totalContribution: pensionSaving + irp + isa + growthIsa,
  };
}

/**
 * 사용자가 4계좌 각각 입력한 금액으로 계산
 */
export function calcCustomScenario({
  pensionSaving = 0,
  irp = 0,
  isa = 0,
  growthIsa = 0,
  taxableBase,
}) {
  const warnings = [];

  // 한도 체크
  const pensionEligible = Math.min(
    pensionSaving,
    PENSION_LIMITS.PENSION_SAVING_ONLY
  );
  if (pensionSaving > PENSION_LIMITS.PENSION_SAVING_ONLY) {
    warnings.push(
      `연금저축은 단독 600만원까지만 세액공제 (입력한 ${formatMan(
        pensionSaving - PENSION_LIMITS.PENSION_SAVING_ONLY
      )}만원은 공제 대상 아님)`
    );
  }

  const combinedRoom = PENSION_LIMITS.COMBINED_MAX - pensionEligible;
  const irpEligible = Math.min(irp, combinedRoom);
  if (irp > combinedRoom) {
    warnings.push(
      `연금저축+IRP 합산 900만원 한도 초과 (IRP ${formatMan(
        irp - irpEligible
      )}만원은 공제 대상 아님)`
    );
  }

  const isaEligible = Math.min(isa, ISA_LIMITS.annualContribution);
  if (isa > ISA_LIMITS.annualContribution) {
    warnings.push(
      `일반 ISA 연 납입 한도 4,000만원 초과 (${formatMan(
        isa - ISA_LIMITS.annualContribution
      )}만원 초과)`
    );
  }

  const growthIsaDeduction = calcGrowthIsaDeduction(growthIsa);
  if (growthIsa > 70_000_000) {
    warnings.push(
      `국민성장 ISA 7,000만원 초과분은 소득공제율 0% (납입은 가능하나 공제 한도 도달)`
    );
  }

  // 종합 소득공제 한도 체크 (2,500만원)
  if (growthIsaDeduction > GROWTH_ISA.combinedDeductionCap) {
    warnings.push(
      `국민성장 ISA 단독으로는 1,800만원이지만 연금저축 등과 합산 종합한도는 연 2,500만원`
    );
  }

  // 과세표준 없으면 환급액 미산정
  if (!taxableBase || taxableBase <= 0) {
    return {
      taxableBase: null,
      pensionRate: null,
      marginalRate: null,
      pensionSaving,
      pensionEligible,
      irp,
      irpEligible,
      isa,
      isaEligible,
      growthIsa,
      growthIsaDeduction,
      pensionRefund: null,
      irpRefund: null,
      growthIsaRefund: null,
      totalRefund: null,
      totalContribution: pensionSaving + irp + isa + growthIsa,
      warnings,
    };
  }

  const pensionRate = findPensionDeductionRate(taxableBase);
  const marginalRate = findMarginalRate(taxableBase);

  const pensionRefund = pensionEligible * pensionRate;
  const irpRefund = irpEligible * pensionRate;
  const growthIsaRefund = calcTaxSavingFromDeduction(
    taxableBase,
    growthIsaDeduction
  );
  const totalRefund = pensionRefund + irpRefund + growthIsaRefund;

  return {
    taxableBase,
    pensionRate,
    marginalRate,
    pensionSaving,
    pensionEligible,
    irp,
    irpEligible,
    isa,
    isaEligible,
    growthIsa,
    growthIsaDeduction,
    pensionRefund,
    irpRefund,
    growthIsaRefund,
    totalRefund,
    totalContribution: pensionSaving + irp + isa + growthIsa,
    warnings,
  };
}

function formatMan(value) {
  return Math.round(value / 10000).toLocaleString("ko-KR");
}
