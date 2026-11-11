# 배경과 대표 장면 개선 검증

SaaS는 직전 개선본과 같은 HTML/실행 자원을 사용하며6개 카테고리를 수정했다. B와 이전 시안의 실행 파일은 원본 해시로 대조했다.

| 검사 | 최종 결과 |
|---|---|
| 기능·오류 복구·모바일·5개 폭·두 글자 확대·기본 모션·터치 | 101개 통과 |
| 역할색·상단 균형·정렬·내부 확대·실제 선택·모션·비교 UI/동시 이동·보존 | 80개 통과 |
| 필수 선택값→확인/초안 결과 | 62개 통과 |
| 기존 비교 실행 파일·자료 | 63개 SHA-256 일치 |
| SaaS 유지 | 직전/새 시안 HTML SHA-256 일치 |

기본 폭은320/390/768/1024/1440px이다. 글자만200%와 글자/행간200%는390/768px에서 구분했다. 카드·상태 묶음·아이콘/문구 중심·검색/선택 높이·내부 텍스트 손실·열린 회전 표식을 확인했다.

새 역할색은 실제 body·읽기 면·신청 면의 computed 색에서 본문/보조 문구 대비4.5:1 이상을 확인했다. 사진 위 모든 픽셀의 대비 인증과는 구분하며 전면 음식 사진은 실제 PC/모바일 캡처도 검토했다.

함께 이동은 첫 화면/주요 목록/하단에서 모든 프레임이 움직이고 바깥 비교 페이지가 유지되는지 검사했다. 동시 스크롤은 실제 마우스 휠·양방향 진행률·꺼짐·3종 보기·비교군 전환·모바일을 포함한다. 모달/확대 이미지 내부는 독립 조작이다.

[새 비교](../../atmosphere/index.html) · [변경 명세](../../docs/ATMOSPHERE_4.md) · [직전 비교](../../refinement/index.html) · [요약](summary.json) · [보존 기준](baseline.json)

[기본 검사](browser-checks.json) · [정렬/색면/동시 이동](design-and-sync-checks.json) · [필수 선택값](selection-checks.json)

캡처는 B / 직전 개선본 / 새 개선본 순서다.

- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

같은 작성자의 후속 개선이다. 검사 건수는 미적 선호·독립 생성·모든 접근성 상태의 인증이 아니다. 실제 신청·예약·전송은 없는 로컬 데모이며 실기기·브라우저 메뉴 확대는 별도다.
