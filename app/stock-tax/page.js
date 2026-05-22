import StockTaxCalculator from "./calculator";

export const metadata = {
  title: "2026 증권거래세 계산기 — KOSPI · KOSDAQ 인상분 비교",
  description:
    "2026년 1월부터 0.15% → 0.20%로 오른 증권거래세, 매도 금액만 입력하면 2025년 대비 얼마 더 떼이는지 1초 만에 확인합니다.",
  keywords: [
    "증권거래세 계산기",
    "2026 증권거래세",
    "주식 매도 세금",
    "코스피 거래세",
    "코스닥 거래세",
    "농어촌특별세",
  ],
  openGraph: {
    title: "2026 증권거래세 계산기",
    description: "2025년 대비 얼마 더 떼이는지 1초 비교",
    type: "article",
  },
};

export default function StockTaxPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          2026 증권거래세 계산기
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          2026년 1월 1일부터 증권거래세 세율이{" "}
          <strong className="text-slate-900">0.15% → 0.20%</strong>로 인상됐습니다.
          매도 금액을 입력하면 2025년 대비 얼마 더 부담하게 되는지 자동으로
          비교합니다.
        </p>
      </header>

      <StockTaxCalculator />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              매수에도 증권거래세가 부과되나요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              아니요. 증권거래세는 <strong>매도(파는) 시점에만</strong> 부과됩니다.
              매수 시에는 거래수수료만 발생합니다. 또한 손실이 발생한 매도라도
              거래세는 동일하게 부과되며, 이 점에서 수익에만 부과되는
              양도소득세와는 성격이 다릅니다.
            </p>
          </details>

          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              KOSPI와 KOSDAQ의 세율 구성이 다른가요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              사용자가 부담하는 합계 세율은 0.20%로 같지만 내부 구성은
              다릅니다. <strong>KOSPI는 증권거래세 0.05% + 농어촌특별세
              0.15%</strong>로 구성되고, <strong>KOSDAQ은 증권거래세 0.20%</strong>{" "}
              단독으로 부과됩니다(농어촌특별세 없음). 실제 결제 금액은 두 시장
              모두 동일합니다.
            </p>
          </details>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">근거 및 출처</p>
        <ul className="space-y-1">
          <li>· 기획재정부 2025년 세법개정안 (증권거래세법 시행령)</li>
          <li>· PwC Tax Summaries Republic of Korea (Other taxes)</li>
          <li>· 시행일: 2026년 1월 1일</li>
        </ul>
        <p className="mt-3">
          본 계산기는 참고용입니다. 실제 세금은 매도 시 증권사에서 원천징수되며,
          정확한 금액은 거래 증권사 또는 세무 전문가에게 확인하시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
