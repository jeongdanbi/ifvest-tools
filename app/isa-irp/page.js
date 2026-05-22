import PensionCalculator from "./calculator";

export const metadata = {
  title:
    "ISA · IRP · 연금저축 · 국민성장 ISA 통합 절세 계산기 — 2026",
  description:
    "2026년 5월 22일 출시 국민성장 ISA까지 반영. 연금저축·IRP·일반 ISA·국민성장 ISA 4개 계좌의 한도와 환급액을 한 화면에서 비교합니다. ISA는 일반형 기준.",
  keywords: [
    "국민성장 ISA 계산기",
    "국민성장펀드 소득공제",
    "연금저축 세액공제 계산기",
    "IRP 환급액 계산기",
    "ISA 세액공제",
    "13월의 월급",
    "연말정산 환급",
    "2026 절세 계좌",
  ],
  openGraph: {
    title: "ISA·IRP·연금저축·국민성장 ISA 통합 계산기",
    description: "4계좌 한도와 환급액을 한 화면에서 비교",
    type: "article",
  },
};

export default function PensionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          ISA · IRP · 연금저축 · 국민성장 ISA <br className="sm:hidden" />
          통합 절세 계산기
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          종합소득 과세표준을 입력하면 4개 계좌의{" "}
          <strong className="text-slate-900">정확한 환급액</strong>이
          자동으로 계산됩니다. 국민성장 ISA 소득공제는{" "}
          <strong className="text-slate-900">한계세율 구간을 가로질러도</strong>{" "}
          구간별로 정확히 적용됩니다. 각 계좌에 얼마씩 넣을지 직접 정하려면
          아래 &lsquo;계좌별 직접 입력&rsquo;을 펼치세요.
        </p>

        <div className="mt-4 space-y-2">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-900">
            <strong>2026년 5월 22일 신규 출시</strong> — 국민성장 ISA는
            연령·소득 제한 없이 누구나 가입 가능. 투자금 최대 7,000만원에
            소득공제 1,800만원까지 받을 수 있습니다.
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-900">
            <strong>ISA는 일반형 기준</strong>으로 계산합니다 (비과세 한도
            200만원). 서민형·농어민형은 비과세 한도가 400만원으로 다르며 가입
            조건이 별도입니다.
          </div>
        </div>
      </header>

      <PensionCalculator />

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">자주 묻는 질문</h2>
        <div className="space-y-3">
          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              국민성장 ISA는 기존 ISA와 어떻게 다른가요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <div className="mt-3 text-sm text-slate-600 leading-relaxed space-y-2">
              <p>
                국민성장 ISA(국민성장펀드)는 2026년 5월 22일 출시된 별도
                계좌로, 기존 ISA와 함께 보유할 수 있습니다. 핵심 차이는
                <strong> 소득공제와 배당 분리과세율</strong>입니다.
              </p>
              <p>
                · <strong>소득공제</strong>: 기존 ISA는 없음. 국민성장 ISA는
                투자금 3,000만 이하 40%, 3,000~5,000만 20%, 5,000~7,000만 10%
                구간 누진으로 <strong>최대 1,800만원</strong>까지.
              </p>
              <p>
                · <strong>분리과세</strong>: 기존 ISA는 비과세 한도(일반형
                200만원) 초과분에 9.9% / 국민성장 ISA는 배당소득에{" "}
                <strong>9%</strong>.
              </p>
              <p>
                · <strong>가입</strong>: 기존 ISA는 만 19세 이상 / 국민성장
                ISA는 연령·소득 제한 없음.
              </p>
              <p>
                · <strong>의무 유지</strong>: 둘 다 3년. 조기 양도 시 공제분
                추징.
              </p>
            </div>
          </details>

          <details className="rounded-xl border border-slate-200 bg-white p-4 group">
            <summary className="font-medium text-sm cursor-pointer text-slate-900 list-none flex justify-between items-center">
              왜 연금저축 → IRP → ISA 순서로 추천되나요?
              <span className="text-slate-400 group-open:rotate-180 transition">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              연금저축은 단독 600만원, IRP를 합치면 900만원까지 즉시
              세액공제(16.5% 또는 13.2%)가 가능합니다. ISA는 즉시 환급은 없으나
              운용 수익 비과세와 만기 후 연금계좌 전환 시 추가 공제 혜택이
              있습니다. 국민성장 ISA는 소득공제 효과가 매우 크지만 7,000만원
              납입 시 최대 효과가 나오므로 자금 여유와 3년 보유 의무를 함께
              고려해야 합니다.
            </p>
          </details>
        </div>
      </section>

      <section className="mt-10 rounded-xl bg-slate-100 border border-slate-200 p-4 text-xs text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">근거 및 출처</p>
        <ul className="space-y-1">
          <li>· 국세청 「연금계좌 세액공제 한도」 (소득세법 §59의3)</li>
          <li>· 조세특례제한법 §91의26 (국민성장펀드 소득공제)</li>
          <li>· 금융위원회 ISA 세제혜택 안내, 2026 경제성장전략</li>
          <li>
            · 일반 ISA 한도: 2024년 개정 기준 (연 4,000만원·총 2억원)
          </li>
          <li>· 세액공제율·한계세율: 지방소득세 포함</li>
          <li>
            · 국민성장 ISA 절세액은 과세표준 입력값 기반으로 구간 횡단 정확
            계산
          </li>
        </ul>
        <p className="mt-3">
          본 계산기는 참고용입니다. 국민성장 ISA 소득공제는 다른 소득공제(연금
          저축 등)와 합산 종합한도가 연 2,500만원입니다. 55세 이전 중도 인출
          또는 3년 이내 양도 시 받은 공제·환급액이 추징되므로 가입 전 의무
          유지기간을 반드시 확인하시기 바랍니다. 정확한 환급액은 거래 금융사
          또는 세무 전문가에게 확인하시기 바랍니다.
        </p>
      </section>
    </div>
  );
}
