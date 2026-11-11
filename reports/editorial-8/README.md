# 선택·대표 장면·행사 편집 검증

[B와 비교](../../editorial/index.html) · [변경 내용](../../docs/EDITORIAL_8.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 검사 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | 101/101 |
| 필수 선택값 실제 연결 | 62/62 |
| 정렬·역할색·모션·함께 이동/동시 스크롤 | 80/80 |
| 묶음 진입·초점 중단·재진입·감소 설정 | 12/12 |
| 단일 서비스 선택·작품 상세/복귀·포스터/대비/이동 | 6/6 |
| 기존 실행 파일·자료 | 127개 SHA-256 일치 |
| SaaS·브랜드·로컬·식당 | 직전 HTML과 바이트 동일 |

## 모바일 문서 높이

390px·같은 자료·글꼴 로드 후 모션 감소 상태다. 길이가 짧다는 것만으로 미적 우위를 판단하지 않는다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
| professional | 3003px | 2400px |
| portfolio | 3704px | 3543px |
| event | 2785px | 2669px |

첫 구간 링크와 실제 서비스 선택 위치는 별도 계측했다. 서비스 선택은 하나의 버튼 그룹에서 예시/결과물/문의 값에 연결되고, 폼 변경도 역방향으로 반영된다. 포트폴리오 주/보조 이미지의 컨테이너·크기 관계·하단 축·정확한 상세·초점 복귀를 확인했다. 행사는 제목/날짜 중복 제거, 포스터 버튼의 계산된 대비4.5:1 이상, 키보드로 실제 프로그램 이동과 구간 배경 연결을 확인했다.

기본 폭320/390/768/1024/1440px, 두 확대 방식은390/768px이다. 함께 이동은 각 프레임의 해당 구간으로 이동하고 바깥 페이지를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 포함한다. 모달 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [편집 흐름/계측](editorial-flow-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

같은 작성자의 후속 개선이다. 검사 수는 미적 우위나 스킬의 최초 생성 성능을 증명하지 않는다. 실기기·브라우저 메뉴 확대·전체 접근성 인증은 별도다. 로컬 데모로 실제 신청/전송을 하지 않으며 GitHub Pages에는 배포하지 않았다.
