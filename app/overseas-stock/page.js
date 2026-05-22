import RiaCalculator from "./calculator";

export const metadata = {
  title:
    "해외주식 양도세 · RIA 계좌 절세 계산기 — 2026 한시 제도",
  description:
    "해외주식 양도차익 입력 → 일반 계좌 22% 양도세 vs RIA 계좌 시점별 공제(100%/80%/50%) 절세액을 즉시 비교. 2026년 한시 제도, 매도금액 5,000만원 한도.",
  keywords: [
    "RIA 계좌 계산기",
    "국내시장복귀계좌",
    "해외주식 양도세 계산기",
    "서학개미 세금",
    "2026 RIA 세제",
    "해외주식 22%",
  ],
  openGraph: {
    title: "RIA 계좌 절세 계산기",
    description: "해외주식 22% 양도세, RIA로 얼마 깎이는지 즉시 비교",
    type: "article",
  },
};

export default function OverseasStockPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          해외주식 양도세 · RIA 계좌 절세 계산기
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          양도차익(매도금액 − 매수원가)을 입력하면 일반 계좌 22% 양도세와
          RIA 계좌 시점별 공제 효과를{" "}
          <strong className="text-slate-900">한 화면에서 비교</strong>합니다.
          매도 시점이 늦을수록 공제율이 줄어드니 5월·7월·12월 시점별 절세액
          차이를 확인할 수 있습니다.
        </p>

        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 space-y-1">
            <p>
              <strong>RIA는 2026년 한시 제도</strong>입니다. 2026.01.01 ~
              2026.12.31 매도분에 한해 적용되며, 시점이 늦을수록 공제율이
              단계적으로 줄어듭니다.
            </p>
            <p>
              · 2025.12.23 <strong>이전</strong> 보유분만 대상 (그 이후 매수분
              제외)
            </p>
            <p>
              · 매도 결제일로부터 <strong>1년 유지 의무</strong> (위반 시 받은
              혜택 전액 회수)
            </p>
            <p>· 1인당 매도금액 5,000만원 한도까지만 공제</p>
          </div>
        </div>
      </header>

      <RiaCalculator />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              2025년 12월 24일 이후에 산 해외주식도 RIA가 적용되나요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              <strong>적용되지 않습니다.</strong> RIA는{" "}
              <strong>2025년 12월 23일 기준 보유 중이던 해외주식</strong>에
              한해서만 양도소득 공제가 적용됩니다. 그 이후에 신규 매수한
              해외주식은 RIA 계좌로 이체하더라도 일반 양도세(22%)가 그대로
              부과됩니다. 이는 &lsquo;서학개미 자금의 국내 시장 복귀&rsquo;라는
              제도 취지에 따른 것입니다.
            </p>
          </details>

          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              RIA 계좌에서 1년 안에 인출하면 어떻게 되나요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              매도 결제일로부터 1년이 지나기 전에 단{" "}
              <strong>1원이라도 인출하면 받은 양도세 혜택이 전액 회수</strong>
              됩니다. 인출일이 속하는 달의 말일부터 2개월 이내에 다시 양도세를
              납부해야 하므로, RIA의 절세 효과는 1년 보유를 전제로만
              유효합니다. 인출 시점에 본세에 가산세까지 붙을 수 있어 단기 자금
              운용 목적의 사용은 권장되지 않습니다.
            </p>
          </details>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">근거 및 출처</p>
        <ul className="space-y-1">
          <li>· 조세특례제한법 §16의5 (국내시장복귀계좌 양도소득 과세특례)</li>
          <li>
            · 토스뱅크·KB국민은행·미래에셋증권·신한투자증권 RIA 공식 안내
          </li>
          <li>· 해외주식 양도세: 22% (소득세 20% + 지방소득세 2%)</li>
          <li>· 양도소득 기본공제: 연 250만원</li>
          <li>· 시행 기간: 2026.01.01 ~ 2026.12.31 (한시 제도)</li>
        </ul>
        <p className="mt-3">
          본 계산기는 참고용입니다. 매도금액 5,000만원 한도 내의 양도차익을
          기준으로 계산하며, 한도 초과분은 RIA 혜택 없이 일반 양도세가
          적용됩니다. 환율 변동, 종목별 거래수수료, 동일 연도 다른 양도차익과의
          합산 등 실제 변수가 있으므로 정확한 세액은 거래 증권사 또는 세무
          전문가에게 확인하시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
