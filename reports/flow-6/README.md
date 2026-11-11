# 탐색·강조·묶음 모션 검증

[새 비교](../../flow/index.html) · [변경 명세](../../docs/FLOW_6.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | 101/101 |
| 필수 선택값의 실제 연결 | 62/62 |
| 정렬·색면·상황별 모션·함께 이동/동시 스크롤 | 80/80 |
| PC/모바일 묶음 진입·초점 중단·재진입·모션 감소 | 12/12 |
| 이전 실행 파일/자료 보존 | 100개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 동일 |

폭320/390/768/1024/1440px과390/768px 두 확대 방식을 확인했다. 글자 확대는 CSS 계측이며 브라우저 메뉴 확대와 구분한다. 콘텐츠 진입은1440/390px에서 실제 화면 아래 대상에 스크롤하여16px/780ms의 실행을 확인했다. 묶음의 자식에는 중첩 진입이 없고, 초점을 주면 이동이 중단되며 재진입과 모션 감소에서도 내용을 유지한다.

함께 이동은 각 프레임의 해당 구간을 이동하고 바깥 페이지 위치를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 확인했다. 모달/확대 이미지 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [묶음 모션](content-motion-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

실제 디자인 평가는 캡처와 조작 검토에 근거한 판단이며 검사 수가 미적 우위를 증명하지 않는다. 같은 작성자의 후속 개선이다. 실제 신청/예약/전송이 없는 로컬 데모이며 실기기·전체 접근성 인증은 별도다. GitHub Pages에 배포하지 않았다.
