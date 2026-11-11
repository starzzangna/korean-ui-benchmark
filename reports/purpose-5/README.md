# 목적별 상단·색면 검증

[B와 비교](../../purpose/index.html) · [변경 명세](../../docs/PURPOSE_5.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 실제 기능·모바일·글자만200%·글자/행간200%·터치 | 101/101 |
| 필수 선택값과 연결 결과 | 62/62 |
| 정렬·GNB 겹침/잘림·역할색·모션·함께 이동/동시 스크롤 | 80/80 |
| 마지막 서비스 예시 변경 후 기능/확대 재검사 | 14/14 |
| 마지막 식당 사진 크롭 변경 후 기능/확대 재검사 | 14/14 |
| 이전 실행 파일·데이터 | 88개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 일치 |

320/390/768/1024/1440px 및390/768px200% 확대를 확인했다. 함께 이동은 바깥 비교 페이지를 움직이지 않고 모든 프레임의 해당 구간을 이동한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 검증했다. 모달 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [추가 검증](design-and-sync-checks.json) · [최종 서비스 재검사](final-professional-checks.json) · [최종 식당 재검사](final-restaurant-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

같은 작성자의 후속 개선이며 객관적 미적 우위의 증명은 아니다. 로컬 데모로 실제 예약·전송을 하지 않는다. 실기기·브라우저 메뉴 확대·사진 위 모든 픽셀 대비는 별도 검토 대상이다. GitHub Pages에는 배포하지 않았다.
