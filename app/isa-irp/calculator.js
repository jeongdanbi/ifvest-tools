"use client";

import { useMemo, useState } from "react";
import {
  PENSION_LIMITS,
  PENSION_DEDUCTION_THRESHOLD,
  ISA_LIMITS,
  MARGINAL_TAX_BRACKETS,
} from "@/data/pension-tax-rates";
import { calcMaxScenario, calcCustomScenario } from "@/lib/pension-calc";
import { formatNumber, formatKorean, parseAmount } from "@/lib/format";

const TAXABLE_PRESETS = [
  { label: "3,000만 (저소득)", value: 30_000_000 },
  { label: "4,500만 (16.5% 경계)", value: 45_000_000 },
  { label: "6,000만 (중위)", value: 60_000_000 },
  { label: "9,000만 (고소득)", value: 90_000_000 },
];

export default function PensionCalculator() {
  const [taxableInput, setTaxableInput] = useState("");
  const [customOpen, setCustomOpen] = useState(false);

  // 4계좌 직접 입력
  const [pensionInput, setPensionInput] = useState("");
  const [irpInput, setIrpInput] = useState("");
  const [isaInput, setIsaInput] = useState("");
  const [growthIsaInput, setGrowthIsaInput] = useState("");

  const taxableBase = parseAmount(taxableInput);

  const maxResult = useMemo(() => calcMaxScenario(taxableBase), [taxableBase]);

  const customAmounts = {
    pensionSaving: parseAmount(pensionInput),
    irp: parseAmount(irpInput),
    isa: parseAmount(isaInput),
    growthIsa: parseAmount(growthIsaInput),
  };

  const customTotal =
    customAmounts.pensionSaving +
    customAmounts.irp +
    customAmounts.isa +
    customAmounts.growthIsa;

  const customResult = useMemo(
    () =>
      customTotal > 0
        ? calcCustomScenario({ ...customAmounts, taxableBase })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      customAmounts.pensionSaving,
      customAmounts.irp,
      customAmounts.isa,
      customAmounts.growthIsa,
      taxableBase,
      customTotal,
    ]
  );

  const handleAmountChange = (setter) => (e) => {
    const num = parseAmount(e.target.value);
    setter(num ? formatNumber(num) : "");
  };

  return (
    <div className="space-y-4">
      {/* 과세표준 입력 */}
      <TaxableBaseInput
        value={taxableInput}
        onChange={handleAmountChange(setTaxableInput)}
        taxableBase={taxableBase}
      />

      {/* 한도 가득 채운 시나리오 */}
      <MaxScenarioCard result={maxResult} />

      {/* 직접 입력 */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => setCustomOpen(!customOpen)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              계좌별 직접 입력
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              각 계좌에 얼마 넣을지 직접 정해서 환급액 확인
            </p>
          </div>
          <span
            className={`text-slate-400 transition ${
              customOpen ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </button>

        {customOpen && (
          <div className="border-t border-slate-200 p-5 space-y-4 bg-slate-50/50">
            <AccountInput
              name="연금저축"
              limitLabel="한도 600만원 (단독)"
              value={pensionInput}
              onChange={handleAmountChange(setPensionInput)}
              presets={[3_000_000, 6_000_000]}
              limitAmount={PENSION_LIMITS.PENSION_SAVING_ONLY}
              currentAmount={customAmounts.pensionSaving}
            />
            <AccountInput
              name="IRP"
              limitLabel="연금저축 합산 900만원까지"
              value={irpInput}
              onChange={handleAmountChange(setIrpInput)}
              presets={[1_500_000, 3_000_000]}
              limitAmount={
                PENSION_LIMITS.COMBINED_MAX - customAmounts.pensionSaving
              }
              currentAmount={customAmounts.irp}
            />
            <AccountInput
              name="일반 ISA"
              limitLabel="연 4,000만원"
              value={isaInput}
              onChange={handleAmountChange(setIsaInput)}
              presets={[10_000_000, 20_000_000, 40_000_000]}
              limitAmount={ISA_LIMITS.annualContribution}
              currentAmount={customAmounts.isa}
            />
            <AccountInput
              name="국민성장 ISA"
              limitLabel="공제 최대 효과는 7,000만원"
              value={growthIsaInput}
              onChange={handleAmountChange(setGrowthIsaInput)}
              presets={[30_000_000, 50_000_000, 70_000_000]}
              limitAmount={70_000_000}
              currentAmount={customAmounts.growthIsa}
              accent="emerald"
            />

            {customResult ? (
              <CustomResultCard
                result={customResult}
                hasTaxableBase={!!taxableBase}
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
                <p className="text-sm text-slate-400">
                  한 계좌라도 금액을 입력하면 결과가 표시됩니다
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TaxableBaseInput({ value, onChange, taxableBase }) {
  // 현재 위치 한계세율과 연금저축 공제율 미리보기
  const previewBracket = useMemo(() => {
    if (!taxableBase) return null;
    const bracket = MARGINAL_TAX_BRACKETS.find((b) => taxableBase <= b.upTo);
    return bracket;
  }, [taxableBase]);

  const pensionRate =
    taxableBase && taxableBase <= PENSION_DEDUCTION_THRESHOLD ? 16.5 : 13.2;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <label
        htmlFor="taxable-base"
        className="block text-xs font-semibold text-slate-500 mb-2"
      >
        종합소득 과세표준 (원)
        <span className="ml-1 font-normal text-slate-400">
          — 모든 계좌 환급 계산에 사용
        </span>
      </label>
      <div className="relative">
        <input
          id="taxable-base"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          placeholder="예: 60,000,000"
          className="w-full h-12 px-3 pr-10 rounded-md border border-slate-300 text-base font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
          원
        </span>
      </div>

      {taxableBase > 0 && (
        <p className="mt-1.5 text-[11px] text-slate-500">
          = {formatKorean(taxableBase)}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        {TAXABLE_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => onChange({ target: { value: String(p.value) } })}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:border-slate-400 transition"
          >
            {p.label}
          </button>
        ))}
      </div>

      {taxableBase > 0 && previewBracket && (
        <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700 space-y-0.5">
          <p>
            · 한계세율 (소득공제용):{" "}
            <strong>{(previewBracket.rate * 100).toFixed(1)}%</strong>
          </p>
          <p>
            · 연금저축·IRP 세액공제율:{" "}
            <strong>{pensionRate.toFixed(1)}%</strong>
            <span className="text-slate-500">
              {" "}
              ({taxableBase <= PENSION_DEDUCTION_THRESHOLD
                ? "4,500만 이하"
                : "4,500만 초과"}
              )
            </span>
          </p>
        </div>
      )}

      <p className="mt-2 text-[11px] text-slate-400">
        과세표준은 연말정산·종합소득세 신고 자료에서 확인. 모르시면 대략 총급여
        − 근로소득공제 − 인적공제 등으로 계산됩니다.
      </p>
    </div>
  );
}

function AccountInput({
  name,
  limitLabel,
  value,
  onChange,
  presets,
  limitAmount,
  currentAmount,
  accent = "slate",
}) {
  const accentBg = accent === "emerald" ? "bg-emerald-50" : "bg-white";
  const accentBorder =
    accent === "emerald" ? "border-emerald-200" : "border-slate-200";

  const isOver = currentAmount > limitAmount && limitAmount >= 0;

  return (
    <div className={`rounded-lg border ${accentBorder} ${accentBg} p-4`}>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-semibold text-slate-900">{name}</label>
        <span className="text-[11px] text-slate-500">{limitLabel}</span>
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          placeholder="0"
          className={`w-full h-11 px-3 pr-10 rounded-md border text-base font-semibold focus:outline-none focus:ring-1 bg-white ${
            isOver
              ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500"
              : "border-slate-300 focus:border-slate-900 focus:ring-slate-900"
          }`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
          원
        </span>
      </div>
      {currentAmount > 0 && (
        <p className="mt-1.5 text-[11px] text-slate-500">
          = {formatKorean(currentAmount)}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange({ target: { value: String(p) } })}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition"
          >
            {formatNumber(p / 10000)}만
          </button>
        ))}
      </div>
    </div>
  );
}

function MaxScenarioCard({ result }) {
  const noBase = result.taxableBase === null;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <div
        className={`px-5 py-4 ${
          noBase ? "bg-slate-700 text-white" : "bg-emerald-600 text-white"
        }`}
      >
        <p className="text-xs opacity-80">4개 계좌 한도 가득 채울 때 환급액</p>
        <p className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
          {noBase ? "—" : `${formatNumber(result.totalRefund)}원`}
        </p>
        <p className="mt-1 text-xs opacity-80">
          {noBase
            ? "과세표준을 입력하면 정확한 환급액이 계산됩니다"
            : `연 납입 ${formatKorean(result.totalContribution)} 기준`}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        <AccountRow
          name="연금저축"
          amount={result.pensionSaving}
          refund={result.pensionRefund}
          rateLabel={
            noBase
              ? "세액공제 (과세표준 입력 후 산출)"
              : `세액공제 ${(result.pensionRate * 100).toFixed(1)}%`
          }
        />
        <AccountRow
          name="IRP"
          amount={result.irp}
          refund={result.irpRefund}
          rateLabel={
            noBase
              ? "세액공제 (과세표준 입력 후 산출)"
              : `세액공제 ${(result.pensionRate * 100).toFixed(1)}%`
          }
          note="연금저축과 합산 900만원까지"
        />
        <AccountRow
          name="일반 ISA"
          amount={result.isa}
          refund={0}
          rateLabel="즉시 환급 없음"
          note="비과세 + 만기 시 연금 전환 추가 혜택"
        />
        <AccountRow
          name="국민성장 ISA"
          amount={result.growthIsa}
          refund={result.growthIsaRefund}
          rateLabel={
            noBase
              ? `소득공제 ${formatNumber(
                  result.growthIsaDeduction
                )}원 (과세표준 입력 시 환급액 산출)`
              : `소득공제 ${formatNumber(
                  result.growthIsaDeduction
                )}원 × 한계세율 적용 (구간 횡단 정확 계산)`
          }
          note="구간 누진 (40% / 20% / 10%)"
          highlight
        />
      </div>

      <div className="bg-amber-50 border-t border-amber-200 px-5 py-4 text-xs text-amber-900 space-y-1.5">
        <p className="font-semibold">💡 일반 ISA 추가 절세 효과 (즉시 환급 외)</p>
        <p>
          · 운용 수익 200만원까지 비과세 → 일반 계좌 대비 약{" "}
          <strong>{formatNumber(result.isaTaxSaving)}원 절세</strong> (수익이
          200만원 발생한다고 가정)
        </p>
        {!noBase && (
          <p>
            · 3년 만기 후 연금계좌로 3,000만원 이상 전환 시 추가 환급{" "}
            <strong>{formatNumber(result.isaToPensionBonus)}원</strong>
          </p>
        )}
      </div>
    </div>
  );
}

function AccountRow({ name, amount, refund, rateLabel, note, highlight }) {
  const isNull = refund === null;
  return (
    <div className={`px-5 py-4 ${highlight ? "bg-emerald-50/50" : ""}`}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-semibold text-slate-900">{name}</span>
        <span className="text-sm font-semibold text-slate-900">
          {formatNumber(amount)}원
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-slate-500">{rateLabel}</span>
        {isNull ? (
          <span className="text-xs text-slate-300">—</span>
        ) : refund > 0 ? (
          <span className="text-sm font-semibold text-emerald-700">
            환급 +{formatNumber(refund)}원
          </span>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        )}
      </div>
      {note && <p className="mt-1 text-[11px] text-slate-400">{note}</p>}
    </div>
  );
}

function CustomResultCard({ result, hasTaxableBase }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3">
        <p className="text-xs opacity-70">즉시 환급액</p>
        <p className="mt-0.5 text-2xl font-bold">
          {hasTaxableBase ? `${formatNumber(result.totalRefund)}원` : "—"}
        </p>
        <p className="mt-1 text-[11px] opacity-60">
          {hasTaxableBase
            ? `연 납입 ${formatKorean(result.totalContribution)}`
            : "과세표준 입력 시 환급액 계산됨"}
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {result.pensionSaving > 0 && (
          <AccountRow
            name="연금저축"
            amount={result.pensionSaving}
            refund={result.pensionRefund}
            rateLabel={
              hasTaxableBase
                ? `공제 대상 ${formatNumber(result.pensionEligible)}원 × ${(
                    result.pensionRate * 100
                  ).toFixed(1)}%`
                : "공제 대상 산출 대기"
            }
          />
        )}
        {result.irp > 0 && (
          <AccountRow
            name="IRP"
            amount={result.irp}
            refund={result.irpRefund}
            rateLabel={
              hasTaxableBase
                ? `공제 대상 ${formatNumber(result.irpEligible)}원 × ${(
                    result.pensionRate * 100
                  ).toFixed(1)}%`
                : "공제 대상 산출 대기"
            }
          />
        )}
        {result.isa > 0 && (
          <AccountRow
            name="일반 ISA"
            amount={result.isa}
            refund={0}
            rateLabel="즉시 환급 없음, 비과세 효과"
          />
        )}
        {result.growthIsa > 0 && (
          <AccountRow
            name="국민성장 ISA"
            amount={result.growthIsa}
            refund={result.growthIsaRefund}
            rateLabel={
              hasTaxableBase
                ? `소득공제 ${formatNumber(
                    result.growthIsaDeduction
                  )}원 × 구간별 한계세율`
                : `소득공제 ${formatNumber(result.growthIsaDeduction)}원 (환급액 대기)`
            }
            highlight
          />
        )}
      </div>

      {result.warnings.length > 0 && (
        <div className="bg-amber-50 border-t border-amber-200 px-5 py-3 text-xs text-amber-900 space-y-1">
          <p className="font-semibold">⚠️ 한도 안내</p>
          {result.warnings.map((w, i) => (
            <p key={i}>· {w}</p>
          ))}
        </div>
      )}
    </div>
  );
}
