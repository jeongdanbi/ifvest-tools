"use client";

import { useMemo, useState } from "react";
import { calcAllScenarios } from "@/lib/ria-calc";
import { OVERSEAS_TAX } from "@/data/ria-rates";
import { formatNumber, formatKorean, parseAmount } from "@/lib/format";

const GAIN_PRESETS = [
  { label: "500만원", value: 5_000_000 },
  { label: "1,000만원", value: 10_000_000 },
  { label: "2,000만원", value: 20_000_000 },
  { label: "5,000만원", value: 50_000_000 },
];

export default function RiaCalculator() {
  const [gainInput, setGainInput] = useState("");

  const gain = useMemo(() => parseAmount(gainInput), [gainInput]);

  const scenarios = useMemo(
    () => (gain > 0 ? calcAllScenarios(gain) : null),
    [gain]
  );

  const handleChange = (e) => {
    const num = parseAmount(e.target.value);
    setGainInput(num ? formatNumber(num) : "");
  };

  return (
    <div className="space-y-4">
      {/* 입력 카드 */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <label
          htmlFor="gain"
          className="block text-xs font-semibold text-slate-500 mb-2"
        >
          양도차익 (매도금액 − 매수원가, 원)
        </label>
        <div className="relative">
          <input
            id="gain"
            type="text"
            inputMode="numeric"
            value={gainInput}
            onChange={handleChange}
            placeholder="예: 10,000,000"
            className="w-full h-14 px-4 pr-12 rounded-lg border border-slate-300 text-lg font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
            원
          </span>
        </div>
        {gain > 0 && (
          <p className="mt-2 text-xs text-slate-500">= {formatKorean(gain)}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {GAIN_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setGainInput(formatNumber(p.value))}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          양도차익이 250만원 이하면 기본공제로 인해 세금이 0원입니다.
        </p>
      </div>

      {scenarios ? (
        <ScenarioComparison scenarios={scenarios} />
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-400">
            양도차익을 입력하면 일반 계좌와 RIA 계좌의 시점별 세금이 자동
            비교됩니다
          </p>
        </div>
      )}
    </div>
  );
}

function ScenarioComparison({ scenarios }) {
  const { general, ria, maxSaving } = scenarios;

  return (
    <div className="space-y-4">
      {/* 최대 절세 요약 */}
      <div className="rounded-2xl bg-emerald-600 text-white px-5 py-4">
        <p className="text-xs opacity-80">
          5월 31일 안에 매도 시 최대 절세 효과
        </p>
        <p className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight">
          +{formatNumber(maxSaving)}원
        </p>
        <p className="mt-1 text-xs opacity-80">
          일반 양도세 {formatNumber(general.tax)}원 → RIA(100% 공제) 0원
        </p>
      </div>

      {/* 일반 계좌 */}
      <ScenarioCard
        title="일반 계좌"
        subtitle="RIA 미적용 시"
        rows={[
          { label: "양도차익", value: general.gain },
          {
            label: `기본공제 (연 ${formatNumber(general.deduction)}원)`,
            value: -general.deduction,
            isDeduction: true,
          },
          { label: "과세표준", value: general.taxable, isTotal: true },
          {
            label: `× ${(OVERSEAS_TAX.rate * 100).toFixed(0)}%`,
            value: null,
            isRate: true,
          },
        ]}
        tax={general.tax}
        taxColor="slate"
      />

      {/* RIA 3시점 */}
      {ria.map((p) => (
        <ScenarioCard
          key={p.key}
          title={`RIA · ${p.shortLabel} 매도`}
          subtitle={p.label}
          rows={[
            { label: "양도차익", value: p.result.gain },
            {
              label: `RIA 공제 ${(p.discountRate * 100).toFixed(0)}%`,
              value: -p.result.riaDeduction,
              isDeduction: true,
              accent: "emerald",
            },
            { label: "공제 후 차익", value: p.result.adjustedGain },
            {
              label: `기본공제 (연 ${formatNumber(
                p.result.basicDeduction
              )}원)`,
              value: -p.result.basicDeduction,
              isDeduction: true,
            },
            { label: "과세표준", value: p.result.taxable, isTotal: true },
            {
              label: `× ${(OVERSEAS_TAX.rate * 100).toFixed(0)}%`,
              value: null,
              isRate: true,
            },
          ]}
          tax={p.result.tax}
          taxColor="emerald"
          saving={p.saving}
        />
      ))}

      {/* 한도 안내 */}
      {general.gain > 50_000_000 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
          <p className="font-semibold mb-1">⚠️ 매도금액 한도 안내</p>
          <p>
            입력하신 양도차익이 5,000만원을 초과합니다. RIA 양도소득 공제는
            <strong> 1인당 매도금액 5,000만원 한도</strong>로 적용되므로,
            한도를 넘는 부분은 일반 양도세(22%)가 적용됩니다. 본 계산기는 단순
            공제율만 적용해 비교하므로 실제로는 절세 효과가 더 작을 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}

function ScenarioCard({ title, subtitle, rows, tax, taxColor, saving }) {
  const isEmerald = taxColor === "emerald";

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="px-5 py-3 space-y-1.5">
        {rows.map((row, i) => (
          <Row key={i} row={row} />
        ))}
      </div>

      <div
        className={`px-5 py-3 border-t ${
          isEmerald
            ? "bg-emerald-50 border-emerald-100"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700">세금</span>
          <span
            className={`text-xl font-bold ${
              isEmerald ? "text-emerald-700" : "text-slate-900"
            }`}
          >
            {formatNumber(tax)}원
          </span>
        </div>
        {saving > 0 && (
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xs text-emerald-700">절세 효과</span>
            <span className="text-sm font-semibold text-emerald-700">
              +{formatNumber(saving)}원
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ row }) {
  if (row.isRate) {
    return (
      <div className="flex items-baseline justify-end">
        <span className="text-xs text-slate-500">{row.label}</span>
      </div>
    );
  }

  const isNegative = row.value !== null && row.value < 0;
  const accentClass =
    row.accent === "emerald"
      ? "text-emerald-700 font-semibold"
      : isNegative
      ? "text-slate-500"
      : "text-slate-700";

  return (
    <div
      className={`flex items-baseline justify-between ${
        row.isTotal ? "pt-1.5 mt-1 border-t border-slate-100" : ""
      }`}
    >
      <span
        className={`text-xs ${
          row.isTotal ? "font-semibold text-slate-700" : "text-slate-500"
        }`}
      >
        {row.label}
      </span>
      <span
        className={`text-sm ${accentClass} ${
          row.isTotal ? "font-bold text-slate-900" : ""
        }`}
      >
        {row.value !== null
          ? (isNegative ? "−" : "") + formatNumber(Math.abs(row.value)) + "원"
          : ""}
      </span>
    </div>
  );
}
