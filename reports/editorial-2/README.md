# 새 28개 시안의 검증

보강한 스킬과 별도 페이지 구성 파일로 다시 제작한 결과다. 이전 보고서를 최신 실행으로 덮어쓰지 않고 이 폴더에 기록한다.

| 검사 | 결과와 범위 |
|---|---|
| 기본 기능·복구·5개 폭·두 글자 확대·터치·모션·비교 UI | 401개 통과 |
| 필수 선택값의 실제 확인/초안 연결 | 248개 통과 |
| 그룹/컨트롤/카드 정렬·확대·회전·실제 글꼴·모션/복귀/감소·구성 분리·보존본 실행 | 295개 통과 |
| SaaS 카드/메뉴·추가/수정 집계·모바일 키보드·확대 | 8개 시나리오 통과 |
| 직전 실행 파일·자료·기록 원본 바이트 | 217개 SHA-256 일치 |

기본 폭은320/390/768/1024/1440px, 글자 확대는390/768px에서 글자만200%와 글자/행간200%를 구분했다. 추가 정렬 검사는5개 폭의 그룹/필드/동등 카드 제목 축과390/768px의 글자/행간 확대를 본다. 회전은 열린 아이콘의 SVG와 클릭 영역을 따로 검사한다. 장식 아이콘의 고정 그림 크기와 확대한 의미 있는 문구를 구분한다.

실제 transform은7카테고리×4군에서 시작/동작/복귀와 모션 감소를 관찰했다. no skill/A의 변화 유무도 기록하며 효과 수를 점수로 삼지 않는다. 카드/컨트롤 전체 상태나 모든 광학 정렬을 인증하는 것은 아니다.

대표 PC/모바일과 전체 페이지 캡처를 직접 검토했다. 정지 캡처는 모션 감소 상태다. 브라우저의 정상 모션 설정에서는 실제 hover·펼침·복귀를 볼 수 있다.

[비교 화면](../../index.html) · [직전 비교본](../../archive/before-editorial-rebuild/index.html) · [제작 명세](../../docs/EDITORIAL_REBUILD.md) · [요약](summary.json)

[기본 검사](browser-checks.json) · [선택값](selection-checks.json) · [정렬/모션](layout-motion-checks.json) · [SaaS](saas-cards.json) · [원본 보존](preservation.json)

화면 비교: [SaaS PC](previews/saas-pc.jpg) / [모바일](previews/saas-mobile.jpg) · [브랜드 PC](previews/brand-pc.jpg) / [모바일](previews/brand-mobile.jpg) · [로컬 PC](previews/local-pc.jpg) / [모바일](previews/local-mobile.jpg) · [식당 PC](previews/restaurant-pc.jpg) / [모바일](previews/restaurant-mobile.jpg) · [포트폴리오 PC](previews/portfolio-pc.jpg) / [모바일](previews/portfolio-mobile.jpg) · [전문 서비스 PC](previews/professional-pc.jpg) / [모바일](previews/professional-mobile.jpg) · [행사 PC](previews/event-pc.jpg) / [모바일](previews/event-mobile.jpg)

같은 작성자의 지침 적용 사례다. 기능·기하·DOM 분리 통과를 독립 생성/스킬의 인과 효과/미적 우위/전체 접근성 인증으로 해석하지 않는다. 폼은 전송 없는 로컬 데모이며 실기기·브라우저 메뉴 확대는 별도 검사다.
