# 구체적 과제·작품 자료·읽기 안정성 검증

[B와 비교](../../craft/index.html) · [변경 명세](../../docs/CRAFT_11.md) · [보존 기준](baseline.json) · [요약](summary.json)

기능101 · 선택값62 · 정렬/스크롤80 · 모션12 · 흐름6 · 근거9 · 결과 표현12 · 읽기 안정/새 작품11: **총293건 통과**.

기존 파일 166개의 SHA-256이 일치한다. SaaS·브랜드·로컬·식당은 직전 HTML과 바이트 동일하며, 공통 데이터7종도 동일하다.

## 모바일 길이

390px·글꼴 로드·보조 맥락 닫힘 기준이다. 길이 자체는 미적 우위의 근거가 아니다. 전문 서비스는 상태별 결과와 읽기 위치를 안정시키는 공간이 추가된다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
| professional | 2297px | 2464px |
| portfolio | 3508px | 3508px |
| event | 2803px | 2732px |

전문 서비스는 하나의 가상 서점 과제로 메시지·탐색 흐름·콘텐츠 구조를 구체화했다. 소개/선택 영역은 같은 바탕으로 연결하고, 마지막 문장 아래와 선택 영역 위 간격을 검사했다. 서비스 전환 시 결과·문의 버튼·다음 섹션의 좌표와 스크롤 변화는2px 미만이며,320/390/768/1024/1440px과390/768px의 글자/행간200% 및 열린 맥락에서도 확인했다. 폭·글꼴 변화에 다시 측정하며 고정 높이나 내용 잘림을 사용하지 않는다. 짧은 결과에는 예약 여백이 남을 수 있다.

포트폴리오는 직접 작성한 NEST 전체/세부 SVG를 추가하고 대표·목록·모달의 버전을 일치시켰다. 새 자료의 오류/재시도·상세 보기·초점 복귀도 검사했다. 모든 도서와 서비스는 가상 콘셉트이며 실제 납품이나 성과를 의미하지 않는다. 행사는 반복 소개 문단을 덜고 관심 문구·실제 프로그램명·정확한 세션 연결을 유지한다.

기본 폭5종, 두 방식의200% CSS 글자 확대, 키보드·모션 감소·함께 이동·동시 스크롤을 검사했다. 실기기와 브라우저 메뉴 확대는 별도다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [흐름](editorial-flow-checks.json) · [적용 근거](evidence-checks.json) · [표현](role-checks.json) · [읽기 안정/에셋](stability-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
- saas: [PC](previews/saas-pc.jpg) · [모바일](previews/saas-mobile.jpg)
- brand: [PC](previews/brand-pc.jpg) · [모바일](previews/brand-mobile.jpg)
- local: [PC](previews/local-pc.jpg) · [모바일](previews/local-mobile.jpg)
- restaurant: [PC](previews/restaurant-pc.jpg) · [모바일](previews/restaurant-mobile.jpg)
- portfolio: [PC](previews/portfolio-pc.jpg) · [모바일](previews/portfolio-mobile.jpg)
- professional: [PC](previews/professional-pc.jpg) · [모바일](previews/professional-mobile.jpg)
- event: [PC](previews/event-pc.jpg) · [모바일](previews/event-mobile.jpg)

같은 작성자의 후속 개선이며 최초 생성 성능을 입증하는 독립 실험이 아니다. 새 작품 에셋도 함께 변경되어 순수한 지침 효과만의 비교가 아니다. 실제 예약·계정·외부 전송이 없는 로컬 데모이며 GitHub Pages에는 배포하지 않았다.
