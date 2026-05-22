"use client";

import { useMemo, useState } from "react";
import { STOCK_TAX_RATES, MARKET_OPTIONS } from "@/data/stock-tax-rates";
import { formatNumber, formatKorean, parseAmount } from "@/lib/format";

const PRESETS = [
  { label: "100만원", value: 1000000 },
  { label: "1,000만원", value: 10000000 },
  { label: "1억원", value: 100000000 },
];

export default function StockTaxCalculator() {
  const [amountInput, setAmountInput] = useState("");
  const [market, setMarket] = useState("KOSPI");

  const amount = useMemo(() => parseAmount(amountInput), [amountInput]);

  const result = useMemo(() => {
    if (!amount) return null;
    const rates = STOCK_TAX_RATES[market];
    const tax2025 = amount * rates[2025].rate;
    const tax2026 = amount * rates[2026].rate;
    const diff = tax2026 - tax2025;
    const diffRate = tax2025 > 0 ? (diff / tax2025) * 100 : 0;
    return {
      tax2025,
      tax2026,
      diff,
      diffRate,
      net2025: amount - tax2025,
      net2026: amount - tax2026,
    };
  }, [amount, market]);

  const handleAmountChange = (e) => {
    const raw = e.target.value;
    const num = parseAmount(raw);
    setAmountInput(num ? formatNumber(num) : "");
  };

  return (
    <div className="space-y-4">
      {/* 입력 카드 */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-5">
        {/* 시장 선택 */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            시장 선택
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MARKET_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMarket(m.value)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition ${
                  market === m.value
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 매도 금액 */}
        <div>
          <label
            htmlFor="amount"
            className="block text-xs font-semibold text-slate-500 mb-2"
          >
            매도 금액 (원)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="text"
              inputMode="numeric"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder="예: 10,000,000"
              className="w-full h-14 px-4 pr-14 rounded-lg border border-slate-300 text-lg font-semibold focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
              원
            </span>
          </div>
          {amount > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              = {formatKorean(amount)}
            </p>
          )}

          <div className="mt-3 flex gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setAmountInput(formatNumber(p.value))}
                className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 결과 카드 */}
      {result && <ResultCard result={result} market={market} amount={amount} />}

      {!result && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-400">
            매도 금액을 입력하면 세금 비교 결과가 표시됩니다
          </p>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, market, amount }) {
  const rates = STOCK_TAX_RATES[market];

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-slate-900 text-white px-5 py-3">
        <p className="text-xs opacity-70">
          {market} · 매도 금액 {formatKorean(amount)}
        </p>
      </div>

      {/* 비교 테이블 */}
      <div className="divide-y divide-slate-100">
        <YearRow
          label="2025년 (구 세율)"
          rate={rates[2025].rate}
          tax={result.tax2025}
          net={result.net2025}
        />
        <YearRow
          label="2026년 (신 세율)"
          rate={rates[2026].rate}
          tax={result.tax2026}
          net={result.net2026}
          highlight
        />
      </div>

      {/* 차이 강조 */}
      <div className="bg-amber-50 border-t border-amber-200 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-900 font-medium">
              2026년 추가 부담
            </p>
            <p className="mt-0.5 text-2xl font-bold text-amber-900">
              +{formatNumber(result.diff)}원
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-700">인상폭</p>
            <p className="mt-0.5 text-lg font-bold text-amber-700">
              +{result.diffRate.toFixed(1)}%
            </p>
          </div>
        </div>
        {amount >= 100000000 && (
          <p className="mt-3 text-xs text-amber-800">
            💡 1억원 매도 기준 5만원이 추가로 부과됩니다
          </p>
        )}
      </div>
    </div>
  );
}

function YearRow({ label, rate, tax, net, highlight = false }) {
  return (
    <div className={`px-5 py-4 ${highlight ? "bg-slate-50" : ""}`}>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-500">
          세율 {(rate * 100).toFixed(2)}%
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-slate-500">세금</span>
        <span
          className={`text-lg font-bold ${
            highlight ? "text-slate-900" : "text-slate-600"
          }`}
        >
          {formatNumber(tax)}원
        </span>
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-xs text-slate-400">세후 수령액</span>
        <span className="text-sm text-slate-500">{formatNumber(net)}원</span>
      </div>
    </div>
  );
}
