# ifvest 금융 계산기

> 2026년 개정 세법을 반영한 한국 금융 계산기 모음.
> [tools.ifvest.kr](https://tools.ifvest.kr) 에서 사용 가능.

[ifvest](https://ifvest.kr) 의 자매 서비스. 모든 계산은 브라우저 안에서만
이뤄지며 어떤 데이터도 서버에 저장되지 않는다.

## 제공 계산기

- **/stock-tax** — 2026 증권거래세 (KOSPI/KOSDAQ 0.20% 신요율)
- **/isa-irp** — ISA · IRP · 연금저축 · 국민성장 ISA 통합 절세
- **/overseas-stock** — 해외주식 양도세 · RIA 계좌 시점별 절세

## 기술

- Next.js 16 (App Router, Static Generation)
- React 19
- Tailwind CSS 4
- Vercel 배포

## 로컬 개발

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 정적 빌드
```

## 데이터 출처

세율·한도 등 모든 수치는 1차 자료를 인용해 `data/` 폴더에 명시적으로
분리 저장. 정책 변경 시 해당 파일만 수정하면 전체 반영됨.

- 소득세법 / 조세특례제한법
- 국세청 「연금계좌 세액공제 한도」
- 금융위원회 ISA 세제혜택 안내
- PwC Tax Summaries Republic of Korea
- 기획재정부 세법개정안

## 면책

본 계산기는 참고용. 실제 세액은 금융기관·세무 전문가 확인 필요.
