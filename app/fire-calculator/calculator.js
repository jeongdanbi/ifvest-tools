"use client";

import { useState, useMemo, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { calculateFIRE, pickIfvestSeed, buildCtaUrl } from "@/lib/fire-calc";
import { formatNumber, formatKorean } from "@/lib/format";
import {
  trackFireCalcStart,
  trackFireCalcComplete,
  trackFireCalcCtaClick,
  trackFireCalcToggleRate,
  getAssetRange,
} from "@/lib/analytics/fire-gtag";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 섹션 1: 기본 정보 입력
function BasicInfoSection({
  currentAge,
  setCurrentAge,
  retireAge,
  setRetireAge,
  currentAsset,
  setCurrentAsset,
  monthlySaving,
  setMonthlySaving,
  onFirstFocus,
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">기본 정보</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            현재 나이
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(parseInt(e.target.value) || 30)}
            onFocus={onFirstFocus}
            min={20}
            max={70}
            className="w-full h-12 px-3 rounded-lg border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            은퇴 희망 나이
          </label>
          <input
            type="number"
            value={retireAge}
            onChange={(e) => setRetireAge(parseInt(e.target.value) || 45)}
            min={currentAge + 5}
            max={70}
            className="w-full h-12 px-3 rounded-lg border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          현재 자산 (만원)
        </label>
        <input
          type="number"
          value={currentAsset}
          onChange={(e) => setCurrentAsset(parseInt(e.target.value) || 0)}
          min={0}
          max={100000}
          className="w-full h-12 px-3 rounded-lg border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          = {formatKorean(currentAsset * 10000)}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          은퇴 전 월 저축액 (만원)
        </label>
        <input
          type="number"
          value={monthlySaving}
          onChange={(e) => setMonthlySaving(parseInt(e.target.value) || 0)}
          min={0}
          max={10000}
          className="w-full h-12 px-3 rounded-lg border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          = {formatKorean(monthlySaving * 10000)}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          은퇴 시점까지 매달 저축하는 금액. 은퇴 후엔 자산에서 생활비를 인출합니다.
        </p>
      </div>
    </div>
  );
}

// 섹션 2: 은퇴 생활 정보
function RetireLifeSection({
  monthlyExpense,
  setMonthlyExpense,
  region,
  setRegion,
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">은퇴 생활</h3>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          월 생활비 (만원)
        </label>
        <input
          type="number"
          value={monthlyExpense}
          onChange={(e) => setMonthlyExpense(parseInt(e.target.value) || 50)}
          min={50}
          max={5000}
          className="w-full h-12 px-3 rounded-lg border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        <p className="mt-1 text-xs text-slate-500">
          = {formatKorean(monthlyExpense * 10000)}
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-2">
          거주 지역
        </label>
        <div className="grid grid-cols-3 gap-2">
          {["서울", "광역시", "지방"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                region === r
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 섹션 3: 고급 설정
function AdvancedSettingsSection({
  advancedOpen,
  setAdvancedOpen,
  inflation,
  setInflation,
  annualReturn,
  setAnnualReturn,
  withdrawalRate,
  setWithdrawalRate,
  taxEnabled,
  setTaxEnabled,
  lifeEndAge,
  setLifeEndAge,
}) {
  const handleWithdrawalRateChange = (rate) => {
    const fromRate = withdrawalRate;
    setWithdrawalRate(rate);
    trackFireCalcToggleRate({
      from_rate: fromRate === 4.0 ? 4 : 3.5,
      to_rate: rate === 4.0 ? 4 : 3.5,
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="w-full px-5 py-3 flex items-center justify-between text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
      >
        <span>고급 설정</span>
        <span className={`transition ${advancedOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {advancedOpen && (
        <div className="border-t border-slate-200 p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              인플레이션 가정: {inflation.toFixed(1)}%
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              투자 수익률 가정: {annualReturn.toFixed(1)}%
            </label>
            <input
              type="range"
              min={3}
              max={15}
              step={0.5}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">
              인출률
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[4.0, 3.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handleWithdrawalRateChange(rate)}
                  className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                    withdrawalRate === rate
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="font-medium">세금 반영</span>
              <span className="text-xs text-slate-500">
                (해외주식 양도세 22% + 건보료)
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              수명 종료 나이: <span className="font-bold">{lifeEndAge}세</span>
            </label>
            <input
              type="range"
              min={80}
              max={95}
              step={1}
              value={lifeEndAge}
              onChange={(e) => setLifeEndAge(parseInt(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-slate-500 mt-1">
              한국 기대수명 약 84세. 시뮬레이션 종료 시점입니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// 필요 자산 카드
function NeededAssetCard({
  neededAssetMan,
  neededAssetPresent,
  years,
  inflationRate,
}) {
  return (
    <div className="rounded-2xl bg-slate-900 text-white p-6">
      <p className="text-xs opacity-70">은퇴 시점 필요 자산</p>
      <p className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">
        {formatKorean(neededAssetMan * 10000)}
      </p>
      <p className="mt-1 text-xs opacity-70">{years}년 후 시점</p>
      <div className="mt-3 pt-3 border-t border-white/20">
        <p className="text-sm opacity-90">
          = 현재 가치 {formatKorean(neededAssetPresent * 10000)}
        </p>
        <p className="mt-1 text-[11px] opacity-60">
          ※ 인플레 {(inflationRate * 100).toFixed(1)}% 연복리 반영
        </p>
      </div>
    </div>
  );
}

// 부족액 카드
function ShortageCard({
  totalAtRetire,
  neededAssetMan,
  shortage,
  additionalMonthly,
  years,
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-600">은퇴 시 예상 자산</span>
          <span className="text-lg font-bold text-slate-900">
            {formatKorean(totalAtRetire * 10000)}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-600">필요 자산</span>
          <span className="text-lg font-bold text-slate-900">
            {formatKorean(neededAssetMan * 10000)}
          </span>
        </div>

        <div className="h-px bg-slate-200" />

        {shortage > 0 ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-amber-700">
                부족액
              </span>
              <span className="text-xl font-bold text-amber-700">
                {formatKorean(shortage * 10000)}
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-900 mb-1">
                💡 목표 달성을 위한 추가 필요 월저축
              </p>
              <p className="text-2xl font-bold text-amber-900">
                월 {formatKorean(additionalMonthly * 10000)}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-emerald-700">
              ✅ 목표 자산 달성 가능
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              현재 저축 페이스를 유지하면 {years}년 뒤 은퇴 가능합니다
            </p>
          </div>
        )}

        {/* 진행 바 */}
        <div className="mt-4">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                shortage > 0 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(
                  (totalAtRetire / neededAssetMan) * 100,
                  100
                )}%`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500 text-right">
            {((totalAtRetire / neededAssetMan) * 100).toFixed(1)}% 달성
          </p>
        </div>
      </div>
    </div>
  );
}

// 시뮬레이션 차트
function SimulationChart({ series, retireAge, lifeEndAge }) {
  const data = {
    labels: series.map((s) => `${s.year}년차`),
    datasets: [
      {
        label: "자산 잔액 (만원)",
        data: series.map((s) => s.balanceMan),
        borderColor: "rgb(15, 23, 42)",
        backgroundColor: "rgba(15, 23, 42, 0.1)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const item = series[context.dataIndex];
            return `${item.age}세: ${formatKorean(item.balanceMan * 10000)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${(value / 10000).toFixed(0)}억`,
        },
      },
    },
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">
        은퇴 후 자산 시뮬레이션 ({retireAge}세 → {lifeEndAge}세)
      </h3>
      <Line data={data} options={options} />
      <p className="text-xs text-slate-500 mt-2">
        ※ 은퇴 후에는 저축 없이 자산에서만 인출하는 시뮬레이션입니다.
      </p>
    </div>
  );
}

// 세후 실수령액 비교 카드
function TaxComparisonCard({ futureMonthlyExpense, netMonthly, tax }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        세후 실수령액 비교
      </h3>
      <p className="text-[11px] text-slate-500 mb-3">
        해외주식 양도소득세 기준 (소득세법 §104) · 건보료는 개인별로 상이한
        추정치
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-xs text-slate-600 mb-1">세전 월 인출액</p>
          <p className="text-xl font-bold text-slate-900">
            {formatKorean(futureMonthlyExpense * 10000)}
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-3">
          <p className="text-xs text-emerald-700 mb-1">세후 실수령액</p>
          <p className="text-xl font-bold text-emerald-700">
            {formatKorean(netMonthly * 10000)}
          </p>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-500 space-y-1">
        <div className="flex justify-between">
          <span>양도세 (차익 50% 기준 22%)</span>
          <span className="font-semibold">−{formatKorean(tax * 10000)}</span>
        </div>
        <div className="flex justify-between">
          <span>건보료 (추정)</span>
          <span className="font-semibold">−12만원</span>
        </div>
      </div>
    </div>
  );
}

// 본진 CTA 카드
function CtaCard({ ctaUrl, onCtaClick }) {
  return (
    <div className="rounded-2xl bg-slate-100 border border-slate-200 p-5">
      <p className="text-base font-medium text-slate-900">
        💡 그 돈을 10년 전 S&P500에 넣었다면?
      </p>
      <p className="mt-1 text-sm text-slate-600">
        2억 영끌이 5.8억이 되는 과정, 본진에서 확인하세요.
      </p>
      <a
        href={ctaUrl}
        onClick={onCtaClick}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
      >
        다른 타이밍 시나리오 보기 →
      </a>
      <p className="mt-2 text-[11px] text-slate-400">
        * 과거 시뮬레이션 결과이며, 미래 수익을 보장하지 않습니다.
      </p>
    </div>
  );
}

// 결과 섹션
function ResultSection({ result, taxEnabled, retireAge }) {
  const {
    neededAssetMan,
    neededAssetPresent,
    totalAtRetire,
    shortage,
    additionalMonthly,
    futureMonthlyExpense,
    netMonthly,
    tax,
    series,
    years,
    inflationRate,
    lifeEndAge,
  } = result;

  const seedId = pickIfvestSeed(neededAssetMan);
  const ctaUrl = buildCtaUrl(seedId);

  const handleCtaClick = () => {
    const assetKrw = neededAssetMan * 10000;
    trackFireCalcCtaClick({
      seed_id: seedId,
      asset_range: getAssetRange(assetKrw),
      years_to_fire: years,
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        내 FIRE 숫자 — 세금·건보료 빼고 남은 진짜 금액
      </h2>

      <NeededAssetCard
        neededAssetMan={neededAssetMan}
        neededAssetPresent={neededAssetPresent}
        years={years}
        inflationRate={inflationRate}
      />

      <ShortageCard
        totalAtRetire={totalAtRetire}
        neededAssetMan={neededAssetMan}
        shortage={shortage}
        additionalMonthly={additionalMonthly}
        years={years}
      />

      <SimulationChart
        series={series}
        retireAge={retireAge}
        lifeEndAge={lifeEndAge}
      />

      {taxEnabled && (
        <TaxComparisonCard
          futureMonthlyExpense={futureMonthlyExpense}
          netMonthly={netMonthly}
          tax={tax}
        />
      )}

      <h2 className="text-lg font-semibold mt-8">
        과거로 돌아가면? 시드 타이밍 시나리오 비교
      </h2>

      <CtaCard ctaUrl={ctaUrl} onCtaClick={handleCtaClick} />
    </div>
  );
}

// 메인 컴포넌트
export default function FireCalculator() {
  // 섹션 1 — 기본 정보
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(45);
  const [currentAsset, setCurrentAsset] = useState(5000);
  const [monthlySaving, setMonthlySaving] = useState(200);

  // 섹션 2 — 은퇴 생활
  const [monthlyExpense, setMonthlyExpense] = useState(300);
  const [region, setRegion] = useState("서울");

  // 섹션 3 — 고급 설정
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [inflation, setInflation] = useState(2.5);
  const [annualReturn, setAnnualReturn] = useState(7.0);
  const [withdrawalRate, setWithdrawalRate] = useState(4.0);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [lifeEndAge, setLifeEndAge] = useState(85);

  // GA4 추적: 첫 입력 시
  const handleFirstFocus = () => {
    trackFireCalcStart();
  };

  // 계산 결과
  const result = useMemo(() => {
    if (currentAge >= retireAge) return null;
    if (retireAge - currentAge < 5) return null;

    return calculateFIRE({
      currentAge,
      retireAge,
      currentAsset,
      monthlySaving,
      monthlyExpense,
      region,
      inflation: inflation / 100,
      annualReturn: annualReturn / 100,
      withdrawalRate: withdrawalRate / 100,
      taxEnabled,
      lifeEndAge,
    });
  }, [
    currentAge,
    retireAge,
    currentAsset,
    monthlySaving,
    monthlyExpense,
    region,
    inflation,
    annualReturn,
    withdrawalRate,
    taxEnabled,
    lifeEndAge,
  ]);

  // GA4 추적: 결과 계산 완료
  useEffect(() => {
    if (!result) return;
    const assetKrw = result.neededAssetMan * 10000;
    trackFireCalcComplete({
      years_to_fire: result.years,
      asset_range: getAssetRange(assetKrw),
      withdrawal_rate: withdrawalRate === 4.0 ? 4 : 3.5,
    });
  }, [result, withdrawalRate]);

  return (
    <div className="space-y-4">
      <BasicInfoSection
        currentAge={currentAge}
        setCurrentAge={setCurrentAge}
        retireAge={retireAge}
        setRetireAge={setRetireAge}
        currentAsset={currentAsset}
        setCurrentAsset={setCurrentAsset}
        monthlySaving={monthlySaving}
        setMonthlySaving={setMonthlySaving}
        onFirstFocus={handleFirstFocus}
      />

      <RetireLifeSection
        monthlyExpense={monthlyExpense}
        setMonthlyExpense={setMonthlyExpense}
        region={region}
        setRegion={setRegion}
      />

      <AdvancedSettingsSection
        advancedOpen={advancedOpen}
        setAdvancedOpen={setAdvancedOpen}
        inflation={inflation}
        setInflation={setInflation}
        annualReturn={annualReturn}
        setAnnualReturn={setAnnualReturn}
        withdrawalRate={withdrawalRate}
        setWithdrawalRate={setWithdrawalRate}
        taxEnabled={taxEnabled}
        setTaxEnabled={setTaxEnabled}
        lifeEndAge={lifeEndAge}
        setLifeEndAge={setLifeEndAge}
      />

      {result && (
        <ResultSection
          result={result}
          taxEnabled={taxEnabled}
          retireAge={retireAge}
        />
      )}

      {!result && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-400">
            입력을 완료하면 FIRE 필요 자산과 시뮬레이션이 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
}
