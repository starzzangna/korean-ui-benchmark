# 구체적 과제와 안정적인 읽기

[비교 화면](../craft/index.html) · [검사 기록](../reports/craft-11/README.md)

## 변경 내용

- 전문 서비스: 가상의 동네 서점이라는 한 과제로 메시지 초안·책 탐색 흐름·콘텐츠 구조를 구체화한다. 허구의 성과나 고객 증언을 만들지 않는다. 예시·제공 결과물·문의 선택의 동기화를 유지한다.
- 상단 경계: 소개 문장 바로 아래에서 배경이 끊기던 원인을 없애고 소개와 서비스 선택을 같은 옅은 녹색 바탕으로 연결한다. 문장 아래24px, 선택 앞12/16px의 내부 간격을 두고 문의에서 배경 면을 구분한다.
- 읽기 안정: 실제 폭·현재 글자 크기·펼침 상태에서 각 결과를 임시로 측정해 필요한 최소 공간을 확보한다. 전환 전 결과가 보이던 경우에만 위치를 보정한다. 고정 높이/내용 잘림은 사용하지 않는다. 문의 선택과 키보드 조작에서도 상태를 유지한다.
- 포트폴리오: NEST의 주제 탐색 화면과 책 소개/내 서가 상세를 직접 작성한 SVG로 보강한다. 대표·목록·모달 전체/세부·오류 재시도에서 같은 버전을 사용한다. 모든 도서·화면은 가상 콘셉트다.
- 행사: 관심 문구와 프로그램명은 남기고 중복 소개 문단을 덜어낸다. 각 관심 문구에서 해당 날짜·세션으로 연결되는 행동을 유지한다.

SaaS·브랜드·로컬·식당은 직전 개선본과 HTML이 동일하다. 기존 결과·자원166개와 이전 단계의 보존 해시를 확인한다. 함께 이동·동시 스크롤·모달 내부 독립 조작을 유지한다.

## 스킬과 에셋 기준

스킬 본문과 카테고리별 MD, 배경/정렬/에셋 가이드에 과제의 구체성·소개 경계·읽기 기준점·자료 버전 일치를 반영했다. 모든 사이트에 특정 과제나 배색을 강제하는 규칙은 아니다. 짧은 상태에 남는 예약 여백과 문의 도달 길이를 함께 검토하도록 명시했다.

새 자료는 `src/craft/assets/manifest.json`에 역할·작성 출처·SHA-256·허구 여부를 기록한다. 라이선스는 프로젝트 LICENSE를 따른다. 기본 데이터는 그대로이며 B와 새 개선본의 에셋은 다르다. 에셋 제작까지 포함한 같은 작성자의 후속 개선으로, 독립 최초 생성이나 순수한 지침 효과만의 실험은 아니다.

모션 실행 모듈은 `src/craft/motion.js`와 `content-reveal.js`, 상태 피드백은 `actions.js`에 있다. 진입은 콘텐츠 묶음 단위로, 서비스 변경은 메시지 opacity240ms/흐름 x6px320ms/구조 y4px300ms로 구분한다. 빠른 재선택은 기존 효과를 취소하고 즉시 값을 갱신하며 모션 감소 설정에서 효과를 생략한다. 스킬의 `assets/category-motion`과 `assets/selection-feedback.html`도 실행 가능한 예제로 유지한다.

## 실행과 검증

```sh
node scripts/serve.mjs --port=4331
node scripts/build-craft.mjs
node scripts/check.mjs
```

별도 터미널에서 `BASE_URL=http://127.0.0.1:4331`, `QA_VARIANT=craft`, 필요 시 `CHROME_PATH`를 Chrome 실행 파일로 설정한다. Windows PowerShell은 `$env:BASE_URL='http://127.0.0.1:4331'` 형식이다.

```sh
node scripts/qa.mjs
node scripts/branches.mjs
node scripts/craft-checks.mjs
node scripts/craft-motion-checks.mjs
node scripts/craft-flow-checks.mjs
node scripts/craft-evidence-checks.mjs
node scripts/craft-role-checks.mjs
node scripts/craft-stability-checks.mjs
```

검사 기록의 기본 기능/선택값 JSON은 실행 직후 `artifacts/qa.json`, `artifacts/branches.json`에서 해당 보고서 폴더로 복사한다. 다른 단계 검사로 덮어쓴 파일을 사용하지 않는다. 이후 `node scripts/report-craft.mjs`로 보존 기준과 총293건을 확인한다.

320/390/768/1024/1440px, 글자만200% 및 글자/행간200%, 카드·아이콘·컨트롤 정렬, 키보드, 모달 오류 복구, 모션 감소, 비교 프레임 이동을 검사했다. 서비스 결과 좌표 검사는5개 폭과390/768px의 확대·열린 맥락을 포함한다.

## 제한사항

전문 서비스의 안정적인 전환을 위해 짧은 결과에도 공간이 남고 모바일 길이는 직전보다167px 늘었다. 행사 소개는71px 줄었으며 포트폴리오 길이는 동일하다. 이는390px의 측정값이며 미적 우위의 증거는 아니다. 실제 기기·브라우저 메뉴 확대는 별도다. 실제 예약·계정·외부 전송이 없는 데모이며 이번 변경은 로컬 비교본이다. GitHub Pages에는 배포하지 않았다.
