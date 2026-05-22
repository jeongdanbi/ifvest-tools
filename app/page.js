import Link from "next/link";

const calculators = [
  {
    href: "/stock-tax",
    badge: "2026 신규",
    title: "증권거래세 계산기",
    desc: "2026년 1월부터 0.20%로 오른 증권거래세, 2025년 대비 얼마 더 떼이는지 1초 만에 비교",
    available: true,
  },
  {
    href: "/isa-irp",
    badge: "2026 신규",
    title: "ISA · IRP · 연금저축 절세 계산기",
    desc: "한도 다 채우면 최대 148만원, 소득 구간 한 번 골라 즉시 환급액과 권장 배분 확인",
    available: true,
  },
  {
    href: "/overseas-stock",
    badge: "2026 한시",
    title: "해외주식 양도세 · RIA 계좌",
    desc: "양도차익 입력 → 일반 22% vs RIA 시점별 공제(100%/80%/50%) 절세액 즉시 비교",
    available: true,
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <section className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          2026 금융 계산기 모음
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
          2026년 개정 세법을 반영한 금융 계산기. 모든 계산은 브라우저 안에서
          이뤄지며, 입력하신 어떤 정보도 서버에 저장되지 않습니다.
        </p>
      </section>

      <section className="space-y-3">
        {calculators.map((calc) =>
          calc.available ? (
            <Link
              key={calc.href}
              href={calc.href}
              className="block rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-900 hover:shadow-sm"
            >
              <CalcCard calc={calc} />
            </Link>
          ) : (
            <div
              key={calc.href}
              className="block rounded-xl border border-slate-200 bg-slate-50 p-5 opacity-60 cursor-not-allowed"
            >
              <CalcCard calc={calc} />
            </div>
          )
        )}
      </section>

      <section className="mt-12 rounded-xl bg-white border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">
          이 사이트 소개
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          ifvest 계산기는 투자 시뮬레이션 서비스{" "}
          <a
            href="https://ifvest.kr"
            className="underline hover:text-slate-900"
          >
            ifvest
          </a>
          의 자매 서비스입니다. 세법 개정 시 데이터를 즉시 업데이트하며, 모든
          세율의 출처를 페이지 하단에 명시합니다.
        </p>
      </section>
    </div>
  );
}

function CalcCard({ calc }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            calc.available
              ? "bg-slate-900 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {calc.badge}
        </span>
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-slate-900">
        {calc.title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{calc.desc}</p>
    </>
  );
}
