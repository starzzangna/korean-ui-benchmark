# Korean UI Design Skill

한국어 웹사이트의 구도·사진·조판·색면·정렬·모션을 콘텐츠와 행동에 맞게 설계하는 재사용 가능한 디자인 스킬입니다. 기본 글꼴은 한글·영문·숫자 모두 **Pretendard**이며 유료 서비스 없이 실행할 수 있습니다.

**[GitHub Pages에서 최신 4종 비교 보기](https://starzzangna.github.io/korean-ui-benchmark/?v=renewal-14)**

같은 데이터와 기능으로 작성한 **no skill / A / B / 자체 스킬**의7개 카테고리, 총28개 새 시안을 비교합니다.4군·2군 보기, PC/모바일 폭, 함께 이동과 동시 스크롤을 지원하며 각 화면의 검색·선택·모달 확대·신청을 직접 조작할 수 있습니다.

[제작 조건·구성 선택](docs/RENEWAL_14.md) · [기능·모바일 검증](reports/renewal-14/README.md) · [스킬](skills/korean-ui-design/SKILL.md) · [DESIGN.md 템플릿](skills/korean-ui-design/assets/DESIGN.md)

## 이번 자체 시안

- SaaS: 좌측 메뉴·대기/진행/완료 카드·간결한 업무 목록과 보라색 역할색.
- 브랜드·로컬·식당: 실제 참고 사진, 재료에 맞는 바탕, 구분되는 상품·수업·메뉴/예약 구간.
- 포트폴리오: 모바일 대표 작품과 핵심 크롭, 전체/세부 확대·이동·오류 재시도.
- 전문 서비스: 가정·결과 예시·선택 근거·문의 동기화와 전환 시 읽기 위치 유지.
- 행사: 포스터와 참여 활동에서 정확한 날짜·세션으로 연결하고 반복 정보 축소.

선택지 누락·네이티브 셀렉트 화살표·폼 높이·카드/아이콘 정렬·모달 내부 스크롤도 기능 계약과 함께 검토합니다.

## 실행과 검사

Node.js22 이상이 필요합니다.

```sh
npm ci
npm run build
npm run dev
```

로컬 주소는 `http://127.0.0.1:4300`입니다.

```sh
npm run check
npx playwright install chromium
npm test
npm run test:branches
npm run test:saas
```

기본 검사는 새28개 화면을 대상으로 검사 서버를 실행합니다. 추가 화면 검사는 실행 중인 서버의 `BASE_URL`을 설정한 뒤 `npm run test:renewal`로 실행합니다. 로컬 Chrome을 사용하려면 `CHROME_PATH`를 지정합니다. 예: PowerShell에서 `$env:BASE_URL='http://127.0.0.1:4331'`. 테스트 캡처와 로그는 Git에서 제외되는 `artifacts/`에 저장됩니다.

`build`는 저장된 코드와 데이터로 화면을 재현하며 AI를 다시 호출하지 않습니다. 실제 예약·계정·결제·메일 전송은 없고 새로고침하면 입력은 초기화됩니다.

## 비교 범위

한 작성자가 전체를 제작했고 사실·기능 부품·사용 가능한 에셋을 공유합니다. 새 레이아웃 코드로 다시 작성한 후속 비교이며 독립 에이전트 실험이나 통계적 우위의 증명이 아닙니다. 원본 스킬의 모든 도구/규칙을 무수정 인증한 결과로 해석하지 않습니다. A/B는 화면 표기용 별칭이며 [출처·라이선스](docs/SOURCES.md)와 [고정 입력 기록](docs/input-provenance.json)을 공개합니다.

모든 브랜드·상품·작품·일정은 가상이며 사진은 참고 이미지입니다. [에셋 출처](docs/ASSETS.md)를 확인하세요. 자체 지침에 다른 패키지의 소개/비교 문구를 포함하지 않습니다.

## 보존한 비교본

- [직전4종](archive/pre-renewal-14/index.html)
- [직전 자체 개선과 B](clarity/index.html)
- [이전 독립 구성4종의 전 단계](archive/before-editorial-rebuild/index.html)

이전 결과는 보존하고 새28종은 `results/renewal/`에 둡니다. 카테고리별 지침은 `skills/korean-ui-design/references/categories/`, 실행 예제·에셋 기준은 같은 스킬의 `assets/`에 있습니다. 라이선스는 [LICENSE](LICENSE), 외부 자료는 각 출처 고지를 따릅니다.
