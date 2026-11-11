# 밀도·배경 경계 보완 검증

[새 비교](../../polish/index.html) · [개선 방향](../../docs/POLISH_7.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | 101/101 |
| 필수 선택값의 실제 연결 | 62/62 |
| 정렬·역할색·모션·함께 이동/동시 스크롤 | 80/80 |
| 묶음 진입·초점 중단·재진입·감소 설정 | 12/12 |
| 행사 경계·고정 배경·모바일 길이 | 7/7 |
| 기존 실행 파일·자료 | 114개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 동일 |

## 모바일 문서 높이

390px·같은 자료·글꼴 로드·모션 감소 상태에서 측정했다. 길이가 짧다는 것만으로 미적 우위를 판단하지 않는다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
| brand | 3383px | 3089px |
| local | 3563px | 3089px |
| portfolio | 3756px | 3704px |

폭320/390/768/1024/1440px과390/768px의 두 확대 방식을 검사했다. 행사 프로그램→신청 부모 사이에 빈 좌표가 없고 바탕색이 같음을 확인했다. 간격은 부모 내부로 포함되며, 실행 중 신청 배경/부모는 움직이지 않고 내부 묶음만 도착한다. PC/모바일 경계는 실제 캡처도 확인했다.

함께 이동은 각 프레임의 해당 구간을 이동하며 바깥 페이지를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종 보기·카테고리 전환·모바일을 포함한다. 모달/확대 이미지 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [경계/길이](boundary-and-length-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

같은 작성자의 후속 개선이다. 검사 수는 미적 우위·전체 접근성 인증을 뜻하지 않는다. 실기기·브라우저 메뉴 확대는 별도다. 로컬 데모로 실제 전송/예약을 하지 않으며 GitHub Pages에는 배포하지 않았다.
