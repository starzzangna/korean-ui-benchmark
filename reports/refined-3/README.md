# 자체 개선본7개 검증

| 검사 | 최종 결과 |
|---|---|
| 기능·오류 복구·5개 폭·두 글자 확대·터치·기본 모션·기존 비교 UI | 101개 통과 |
| 모든 필수 선택값의 실제 확인/초안 결과 | 62개 통과 |
| 그룹/카드/아이콘 정렬·내부 확대·색인·자료 크기/크롭·상황별 모션·새 비교 UI·스킬 예제·보존 | 76개 통과 |
| SaaS 카드/메뉴·수정/추가 집계·모바일 키보드·확대 | 2개 시나리오 통과 |
| 기존28개 시안 실행 파일/자료 | 64개 원본 SHA-256 일치 |
| 수정 직전 스킬 보존 | 112개 파일이 이전 소스 기록과 일치 |
| 추가 개념 SVG | 4개 파일/해시 검사 통과 |

기본 화면은320/390/768/1024/1440px, 글자 확대는390/768px에서 글자만200%와 글자/행간200%를 구분했다. 추가 검사는 실제 제목·본문·색인 내부 손실, 동등 카드 제목 축, 입력/검색 높이, 아이콘/문구 중심, 열린 회전 아이콘의 경계를 확인한다. 메뉴 확대·실기기·모든 보조기술의 인증은 아니다.

상품/분야 색인 각각을 키보드로 선택해 필터→실제 항목→상세→Escape 복귀를 실행했다. 서비스 색인·본문·문의 선택은 예시와 결과물까지 양방향 대조했다. 수업 선택은 신청 수업/초점/금액, 행사 날짜는 실제 프로그램과 연결했다. 모달 닫기 직후 다음 색인으로 옮긴 초점을 가로채던 정책을 개선본에서 보완했다.

모션은 대표 자료·선택 결과·집계 등 실제 대상의 진행 중 변화와 모션 감소에서의 즉시 결과를 확인했다. 효과 수와 크기를 미적 점수로 취급하지 않는다. PC/모바일과 전체 페이지 캡처를 직접 검토했다.

[비교 화면](../../refinement/index.html) · [변경 명세](../../docs/REFINEMENT_3.md) · [요약](summary.json) · [기준 해시](baseline.json)

[기본 검사](browser-checks.json) · [선택값](selection-checks.json) · [정렬/의미 연결/모션](design-checks.json) · [SaaS](saas-checks.json) · [자료](asset-checks.json)

캡처는 왼쪽부터 B / 개선 전 자체 / 개선 후 자체다. 정지 화면은 모션 감소 설정이며 정상 모션은 비교 화면에서 조작할 수 있다.

- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

새 개념 그림과 가상 예시가 추가된 후속 개선이다. 기존 비교본이나 원본 지침만의 인과 효과·모든 과제에서의 우위를 입증하는 결과로 설명하지 않는다. 실제 신청·예약·전송은 없는 로컬 데모다.
