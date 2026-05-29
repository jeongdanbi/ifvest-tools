/**
 * FIRE 계산기 핵심 로직
 * 태연 산출물 3 기반
 */

// 지역별 생활비 보정 비율
const REGION_RATIO = {
  서울: 1.0,
  광역시: 0.85,
  지방: 0.7,
};

// 세금 상수 (윤아 정정: 소득세법 §104 ① 11호 - 해외주식 양도소득세 22%)
const TAX_RATE = 0.22; // 해외주식 양도세 + 지방세
const PROFIT_RATIO = 0.5; // 보수 가정: 원금 50% / 차익 50%
const HEALTH_INSURANCE = 12; // 만원 (피부양자 탈락 후 지역가입자 추정치)

/**
 * FIRE 필요 자산 및 시뮬레이션 계산
 * @param {object} input - 사용자 입력
 * @returns {object} - 계산 결과
 */
export function calculateFIRE(input) {
  const {
    currentAge,
    retireAge,
    currentAsset, // 만원
    monthlySaving, // 만원
    monthlyExpense, // 만원
    region,
    inflation, // 소수 (0.025 = 2.5%)
    annualReturn, // 소수 (0.07 = 7%)
    withdrawalRate, // 소수 (0.04 = 4%)
    taxEnabled,
    lifeEndAge, // 수명 종료 나이
  } = input;

  // (1) 지역 보정
  const adjustedMonthly = monthlyExpense * REGION_RATIO[region];

  // (2) 은퇴 시점 인플레 반영
  const years = retireAge - currentAge;
  const futureMonthlyExpense = adjustedMonthly * Math.pow(1 + inflation, years);

  // (3) 필요 자산 (4% 룰 or 3.5% 룰)
  const neededAssetMan = (futureMonthlyExpense * 12) / withdrawalRate;

  // (3-1) 현재 가치 필요 자산 (인플레 반영 X)
  const neededAssetPresent = (adjustedMonthly * 12) / withdrawalRate;

  // (4) 은퇴 시점 누적 자산 (현재자산 증식 + 적립식)
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const currentGrown = currentAsset * Math.pow(1 + annualReturn, years);
  const months = years * 12;
  const savingsAccum =
    months > 0
      ? monthlySaving * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn)
      : 0;
  const totalAtRetire = currentGrown + savingsAccum;

  // (5) 부족액 → 필요 월저축 역산
  const shortage = neededAssetMan - totalAtRetire;
  const additionalMonthly =
    shortage > 0 && months > 0
      ? (shortage * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1)
      : 0;

  // (6) 세금 반영
  let netMonthly = futureMonthlyExpense;
  let tax = 0;
  if (taxEnabled) {
    const monthlyWithdrawal = futureMonthlyExpense;
    tax = monthlyWithdrawal * PROFIT_RATIO * TAX_RATE;
    netMonthly = monthlyWithdrawal - tax - HEALTH_INSURANCE;
  }

  // (7) 시뮬레이션 (은퇴 시점부터 수명 종료 시점까지)
  const simulationYears = Math.max(0, lifeEndAge - retireAge);
  const series = [];
  let balance = totalAtRetire;
  let assetDepletedAt = null;

  for (let i = 0; i <= simulationYears; i++) {
    series.push({
      year: i,
      age: retireAge + i,
      balanceMan: Math.round(balance),
    });
    const yearlyWithdrawal =
      futureMonthlyExpense * 12 * Math.pow(1 + inflation, i);
    const yearlyReturn = balance * annualReturn;
    balance = balance + yearlyReturn - yearlyWithdrawal;
    if (balance < 0 && assetDepletedAt === null) {
      assetDepletedAt = retireAge + i;
      break;
    }
  }

  return {
    neededAssetMan: Math.round(neededAssetMan),
    neededAssetPresent: Math.round(neededAssetPresent),
    totalAtRetire: Math.round(totalAtRetire),
    shortage: Math.round(shortage),
    additionalMonthly: Math.round(additionalMonthly),
    futureMonthlyExpense: Math.round(futureMonthlyExpense),
    netMonthly: Math.round(netMonthly),
    tax: Math.round(tax),
    series,
    years,
    inflationRate: inflation,
    simulationYears,
    lifeEndAge,
    assetDepletedAt,
  };
}

/**
 * 본진 시드 매칭 로직
 */
export function pickIfvestSeed(neededAssetMan) {
  if (neededAssetMan < 10000) {
    return "S04-deposit-vs-sp500-10y"; // 1억 미만 → 1000만 시드
  } else if (neededAssetMan < 50000) {
    return "S01-seoul-apt-vs-sp500-10y"; // 1~5억 → 4억 영끌
  } else {
    return "S01-seoul-apt-vs-sp500-10y"; // 5억+ → 4억 영끌 + 적립식
  }
}

/**
 * CTA URL 생성 (UTM 포함)
 */
export function buildCtaUrl(seedId) {
  return `https://ifvest.kr/scenario/${seedId}?utm_source=fire-calc&utm_medium=tools&utm_campaign=cta-${seedId}`;
}
