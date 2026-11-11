# 예시 근거와 작품 가독성

[비교 화면](../../clarity/index.html) · [변경·판단·실행](../../docs/CLARITY_13.md) · [요약](summary.json)

| 검사 | 통과 |
|---|---|
| [browser-checks](browser-checks.json) | 101/101 |
| [design-and-sync-checks](design-and-sync-checks.json) | 80/80 |
| [stability-checks](stability-checks.json) | 11/11 |
| [role-checks](role-checks.json) | 12/12 |
| [content-motion-checks](content-motion-checks.json) | 12/12 |
| [content-checks](content-checks.json) | 8/8 |

총224건 통과. Compact12 실행 파일 12개와11종 보존 기준을 확인했다. SaaS·브랜드·로컬·식당은 직전 HTML과 바이트 동일하다. 공통 데이터와 새 크롭/원본 출처의 SHA-256도 일치한다.

전문 서비스의 기본 패널은477px로 유지하며, 열린 판단 근거·200% 확대·서비스 변경에서 읽기 기준점/CTA/다음 구간의 변동2px 미만과 열린 상태의 유지도 확인했다.1440×768/1280×800에서 기본 패널 전체가 첫 화면에 들어온다.

390px 모바일 대표 작품은350px로 커지고 같은 원본의 핵심 크롭을 사용한다. 핵심 제목은약14px이며 작은 본문 전체를 읽을 수 있다는 뜻은 아니다. 모달 전체/세부·오류 재시도와 보조 작품 선택은 유지한다. 작품 페이지 길이는3508→3646px로138px 늘었다. 행사는 참여 맥락을 남기면서 프로그램명 반복을 덜어2732→2635px로97px 짧아졌다. 세션의 정확한 날짜·열림·초점은 유지한다.

| 비교 | PC | 모바일 | 전체 |
|---|---|---|---|
| professional | [보기](previews/professional-pc.jpg) | [보기](previews/professional-mobile.jpg) | [보기](previews/professional-overview.jpg) |
| portfolio | [보기](previews/portfolio-pc.jpg) | [보기](previews/portfolio-mobile.jpg) | [보기](previews/portfolio-overview.jpg) |
| event | [보기](previews/event-pc.jpg) | [보기](previews/event-mobile.jpg) | [보기](previews/event-overview.jpg) |

캡처는 B / Compact12 / Clarity13 순서다. 기능/모바일/글자 확대는 CSS 두 방식이며 실제 기기·브라우저 메뉴 확대는 별도다. 모션 검사와 페이지 길이는 미적 우위나 종합 접근성을 증명하지 않는다. 같은 작성자의 후속 개선으로 지침만의 최초 생성 통제 실험은 아니다. 실제 계정/예약/전송이 없는 로컬 데모이며 이번 개선은 GitHub Pages에 배포하지 않았다.
