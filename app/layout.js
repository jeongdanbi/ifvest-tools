import "./globals.css";
import Link from "next/link";
import Script from "next/script";

const ADSENSE_CLIENT = "ca-pub-7844168923539235";

export const metadata = {
  metadataBase: new URL("https://tools.ifvest.kr"),
  title: {
    default: "ifvest 금융 계산기 — 2026 세금·절세 도구 모음",
    template: "%s | ifvest 금융 계산기",
  },
  description:
    "2026년 개정 세법을 반영한 금융 계산기 모음. 증권거래세·ISA·IRP·연금저축·해외주식 양도세까지 한 화면에서 빠르게 계산합니다.",
  keywords: [
    "증권거래세 계산기",
    "2026 증권거래세",
    "ISA 계산기",
    "IRP 계산기",
    "연금저축 세액공제",
    "해외주식 양도세",
    "금융 계산기",
  ],
  openGraph: {
    title: "ifvest 금융 계산기",
    description: "2026년 개정 세법을 반영한 금융 계산기 모음",
    url: "https://tools.ifvest.kr",
    siteName: "ifvest 금융 계산기",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "eAu3gWPCLH-XF3BY3UJJF1pEd9-b6gAtoOcCj9fuQKg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              ifvest <span className="text-slate-400 font-normal">계산기</span>
            </Link>
            <a
              href="https://ifvest.kr"
              className="text-xs text-slate-500 hover:text-slate-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              ifvest 본 사이트 →
            </a>
          </div>
        </header>

        <main className="flex-1 w-full">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-6 text-xs text-slate-500 space-y-2">
            <p>
              본 계산기는 참고용이며, 실제 세금은 거래 증권사 또는 세무 전문가를
              통해 확인하시기 바랍니다.
            </p>
            <p>
              © {new Date().getFullYear()} ifvest. 자매 서비스{" "}
              <a
                href="https://ifvest.kr"
                className="underline hover:text-slate-900"
              >
                ifvest 투자 시뮬레이션
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
