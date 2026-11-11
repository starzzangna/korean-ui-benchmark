# 새4종 검증

[비교 화면](../../index.html) · [제작 범위](../../docs/RENEWAL_14.md) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·실행 오류·모바일·두200% 확대·터치/키보드 |401/401|
| 필수 선택값·금액·제출 연결 |248/248|
| 5개 폭·이미지·컨트롤 높이·읽기 위치·동시 스크롤 |143/143|
| B/자체 구간 진입·모션 감소 |12/12|
| SaaS 집계·카드/메뉴·상태 변경·모바일 탐색 |8/8|
| 합계 |812/812|
| 검색 비율 변경 후 SaaS 브라우저 재검증 |53/53 (합계와 별도)|
| 이전 파일 보존 |149개 SHA-256 일치|

공통 데이터7종×4군이 동일하며 기존28개·후속 개선본은 바꾸지 않았다. 새 파일은 모두 이전 해당 화면과 다르다. 카테고리와 조건별 구성을 새로 작성했지만 같은 작성자·공유 기능·에셋을 사용하는 후속 비교로 최초 생성 인과 효과를 증명하지 않는다. A/B는 원본 전체 도구/규칙의 무수정 인증 결과가 아니다.

| 카테고리 | PC | 모바일 |
|---|---|---|
|saas|[보기](previews/saas-pc.jpg)|[보기](previews/saas-mobile.jpg)|
|brand|[보기](previews/brand-pc.jpg)|[보기](previews/brand-mobile.jpg)|
|local|[보기](previews/local-pc.jpg)|[보기](previews/local-mobile.jpg)|
|restaurant|[보기](previews/restaurant-pc.jpg)|[보기](previews/restaurant-mobile.jpg)|
|portfolio|[보기](previews/portfolio-pc.jpg)|[보기](previews/portfolio-mobile.jpg)|
|professional|[보기](previews/professional-pc.jpg)|[보기](previews/professional-mobile.jpg)|
|event|[보기](previews/event-pc.jpg)|[보기](previews/event-mobile.jpg)|

캡처 순서는 no skill/A/B/자체 스킬이다. 모바일은 에뮬레이션, 확대는 CSS 글자만/글자와 행간200%다. 실기기·브라우저 메뉴 확대·종합 접근성 인증은 별도다. 실제 계정·예약·메일 전송이 없는 데모다.

[기능](browser-checks.json) · [선택](selection-checks.json) · [화면/정렬](design-checks.json) · [모션](motion-checks.json) · [SaaS](saas-checks.json) · [최종 SaaS 재검사](saas-browser-checks.json) · [보존 기준](baseline.json)
