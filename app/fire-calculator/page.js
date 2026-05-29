import FireCalculator from "./calculator";

export const metadata = {
  title: "조기은퇴 계산기 | 양도세 22% 반영 한국 세법 맞춤형 FIRE 툴",
  description:
    "해외주식 양도세 22%, 피부양자 탈락 건보료까지 반영한 현실 반영형 시뮬레이션. 4% 룰 기반으로 필요 자산과 기대수명 기준 인출 시뮬레이션을 확인하세요.",
  keywords: [
    "FIRE 계산기",
    "조기은퇴 계산기",
    "파이어족",
    "경제적 자유",
    "은퇴 계산기",
    "양도세",
    "4% 룰",
  ],
  openGraph: {
    title: "FIRE 계산기 한국형",
    description: "양도세 22% + 건보료까지 반영 / 현실 반영형 시뮬레이션",
    type: "article",
    images: [
      {
        url: "/og/fire-calculator.png",
        width: 1200,
        height: 630,
        alt: "FIRE 계산기",
      },
    ],
  },
};

export default function FireCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          한국 세법 반영 FIRE 계산기 — 내가 모은 돈으로 몇 살에 은퇴?
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          해외주식 양도세 22%, 피부양자 탈락 건보료까지 반영한 현실 반영형
          시뮬레이션. 4% 룰 기반으로 필요 자산과 30년 인출 시뮬레이션을
          확인하세요.
        </p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">
          현재 자산과 월 저축액 입력 (30초면 끝)
        </h2>
        <FireCalculator />
      </section>

      {/* 면책 박스 (윤아 HTML 그대로) */}
      <div
        className="disclaimer"
        style={{
          marginTop: "2rem",
          padding: "1.25rem",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#f9fafb",
          fontSize: "0.85rem",
          color: "#4b5563",
          lineHeight: "1.7",
        }}
      >
        <p style={{ fontWeight: "700", marginBottom: "0.5rem", color: "#374151" }}>
          안내 및 면책 사항
        </p>
        <ul style={{ paddingLeft: "1.2rem", margin: "0" }}>
          <li>
            이 계산기는 <strong>참고용 시뮬레이션 도구</strong>이며, 세무 자문,
            재무 설계, 투자 권유 또는 투자 자문에 해당하지 않습니다.
          </li>
          <li>
            적용 세율 및 건강보험료 기준:{" "}
            <strong>
              2026년 5월 기준 국세청 고시 및 국민건강보험공단 고시
            </strong>
            를 참고하였으며, 법령 개정 시 실제 결과와 차이가 발생할 수 있습니다.
          </li>
          <li>
            계산 결과의 정확성 및 완전성을 보장하지 않으며, 이를 근거로 한
            의사결정에 대해 ifvest.kr 및 운영자는 어떠한 법적 책임도 부담하지
            않습니다.
          </li>
          <li>
            실제 세무 신고 및 재무 설계는 반드시{" "}
            <strong>세무사 또는 공인재무설계사(CFP)</strong>와 상담하시기
            바랍니다.
          </li>
          <li>
            본 서비스는 「자본시장과 금융투자업에 관한 법률」상 금융투자업에
            해당하지 않으며, 특정 금융투자상품의 매매를 권유하지 않습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
