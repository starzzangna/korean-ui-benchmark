# 실제 파일과 기대 계약을 브라우저에서 대조하기

이 패키지의 `scripts/audit-page.mjs`는 설치된 Playwright·Chrome/Chromium을 사용한다. Node·브라우저 실행 권한이 필요하며 라이브러리를 자동 설치하지 않는다. 개발 서버도 프로젝트의 기존 방법으로 먼저 실행한다.

```powershell
node <skill>/scripts/audit-page.mjs --url http://127.0.0.1:3000/ --out <project>/qa/current --contract <project>/qa/contract.json
```

Playwright가 다른 위치에 설치됐으면 `--module <Playwright를 찾을 package.json 절대경로>`, 별도 Chrome이면 `--browser <chrome.exe 절대경로>`를 추가한다. 경로에 공백이 있으면 따옴표로 감싼다. 출력 폴더는 현재 프로젝트의 QA 전용 경로로 지정한다. 기존 비교본 폴더를 출력 대상으로 쓰지 않는다.

## 독립된 기대 목록

`assets/qa-contract.example.json`에서 시작하되 실제 요구에서 날짜·시간·분야의 값과 표시 문구를 먼저 적는다. 구현된 option에서 기대 목록을 자동 생성하면 누락도 기대값이 되어 검출되지 않는다. placeholder의 빈 값과 disabled 옵션은 사용 가능한 선택지 수에 포함하지 않는다. 순서는 비교하지 않지만 값·문구·개수는 모두 대조한다. 계약 없이 실행한 결과는 필수 선택지 완전성 통과가 아니다.

기본 실행은 페이지를 로드·스크롤·관찰하고 320/390/768/1440px 캡처와 JSON을 쓴다. `--exercise-selects`를 지정하면 현재 보이고 활성화된 계약 select의 값을 실제 선택·복구한다. 선택 이벤트가 앱 상태를 바꿀 수 있으므로 검사용 데이터·페이지에서 사용한다. 숨은 폼, 상위 선택에 따른 모든 종속 상태, 제출 데이터의 정확성, 네이티브 팝업의 외형까지 검사하지 않는다. 폼 제출·예약 완료·결제는 자동으로 실행하지 않는다.

## 무엇을 확인하는가

- HTTP 실패·JS 오류·문서 가로 넘침·기본 폼/버튼 이름·이미지 로드·기대 선택지.
- 실제 Chrome의 h1/body 하위 렌더링 폰트 목록. body 목록은 한글 전용 표본이 아니므로 한영별 적용이 중요하면 DevTools Rendered Fonts에서 실제 텍스트 노드를 추가 확인한다.
- 지연 로드를 위한 실제 스크롤과 캡처. 40회 상한에 닿으면 `scanEnd:false`; 무한 목록 전체를 확인한 결과가 아니다. 요청 실패·미완료 이미지·작은 원본·정렬 delta는 JSON의 관찰 자료이며 모두 자동 실패로 단정하지 않는다.
- 중앙 정렬 전용 요소에 선택적으로 `data-ui-align="center"`를 붙이면 내부 svg와 첫 span의 상자 중심 차이를 기록한다. 다중 행/첫 줄 정렬 요소에는 사용하지 않는다. 육안 확인이 필요하다.

**이 도구의 통과는 접근성 인증·전체 기능 성공·디자인 우위가 아니다.** fallback 폰트·실제 브라우저 메뉴 확대·키보드·대화상자·오류/재시도·API는 프로젝트별 사용자 동작 검사와 직접 화면 확인으로 보완한다. 이미지의 정보 의미·브랜드 적합성·권리는 자동 판정하지 않는다.

## 출고 순서

최종 편집 후 새 context에서 실제 배포 파일을 다시 로드한다. 기대값 감사 → 첫/마지막 선택값을 포함한 핵심 흐름 → 오류 수정·입력 보존·완료 → 모바일/태블릿/데스크톱 화면 순으로 확인한다. 요구 항목별 `통과/실패/미실행`을 적고, 흐름을 가로막은 선행 결함과 그로 인한 후속 실패를 구분한다. 일반 제작에서는 결함을 수정·재검사한다. 동결 비교에서는 소스를 바꾸지 않고 진단/개선본을 분리한다.

## 그룹 전체 계약과 선택적 확대 검사

`--text-scale`은 기본4폭 뒤 같은 페이지에 computed 글자만2배/글자와 행간2배를 각각 주입·복구하고 JSON/화면을 남긴다. 문서 넘침과 계약 그룹 실패는 failed에 반영한다. 내부 잘림 후보는 실제 화면 판단 자료이며 모든 상태/네이티브 select/실제 브라우저 메뉴 확대를 인증하지 않는다.

contract의 selects는 선택적이며 groups만 제공할 수도 있다. 예시:

```json
{"groups":[{"anchor":"#notice-anchor","group":"#notice-group","icon":"#notice-icon","text":"#notice-text","placement":"center","vertical":"first-line","minWidth":768,"tolerance":2},{"anchor":"#notice-anchor","group":"#notice-group","icon":"#notice-icon","text":"#notice-text","placement":"start","vertical":"first-line","maxWidth":767,"tolerance":2}]}
```

그룹 전체 가로 차이와 내부 세로 차이를 각각 확인한다. 목표를 center/start/end로 선언하고 대상 누락/복수/숨김은 미측정 실패로 남긴다. 첫 줄은 글리프 상자 측정이라 광학적 정렬은 실화면으로 보완한다. 글자/행간 주입과 실제 메뉴 확대는 서로 다른 검증이다. 대화상자·오류·긴 선택의 확대는 해당 상태를 여는 사용자 동작 검사에서 추가한다.
## 회전 문자·아이콘의 시각 범위 계약

필수 표시만 계약에 지정한다. 기본과 --text-scale의 두 확대 방식에 같은 계약을 적용한다. 예: `{"visualBounds":[{"selector":"#schedule .event-icon","boundary":"viewport","axis":"x","tolerance":1}]}`. axis는 x(가로, 기본값) 또는 both(양축), boundary는 viewport(기본값) 또는 단일 CSS selector다. minWidth/maxWidth로 적용 폭을 제한할 수 있다. 없는/숨은 대상과 경계 누락은 미측정 실패다.

measureVisualBounds는 지정 대상·자식 상자와 최대500개 문자 노드의 Range를 확인한다. 부모 상자는 정상인데 회전 +의 문자 줄이 넘치는 경우도 기록한다. pseudo가 있거나 상한에 닿으면 passed:null로 남겨 수동 검토를 요구하고 감사기는 통과시키지 않는다. SVG stroke/그림자/잉크 전체를 확정하는 검사가 아니며 기본/열림/hover/복귀는 프로젝트 동작 검사가 각각 열어 측정한다. 기본 감사기는 임의로 일정/대화상자를 열거나 제출하지 않는다.

같은 DOM과 화면에 [실제 적용 근거](applied-evidence.md)를 남겨 사진의 의미·감상 크기·설명 밀도도 검토한다. 시각 범위 통과를 편집 판단 통과로 대신하지 않는다.

## 선택지 감사와 기능 완료를 분리한다

[실행 예제](../assets/dialog.html)의 독립 기대값은 [dialog-demo-contract.json](../assets/dialog-demo-contract.json)이다. `--contract <skill>/assets/dialog-demo-contract.json --exercise-selects`를 지정하면 예제의 세 분야와 실제 DOM·선택/복구를 대조한다. 실제 프로젝트에는 요구 자료에서 작성한 selector/값/문구 계약을 사용한다.

감사기의 기대값 대조가 통과해도 각 필수 값의 초안·금액·확인 결과까지 성공한 것은 아니다. 동적으로 열리는 폼은 해당 상태를 연 프로젝트 검사에서 대조한다. 실제 방향키·Tab/Shift+Tab·Enter/Escape도 별도다. 누락된 옵션이 있는 HTML을 브라우저가 정상 로드하거나 JS 구문 검사가 통과하는 것은 선택지 완전성 근거가 아니다. 최종 결과에 `요구 목록 대조 / 필수 값별 연결 결과 / 실제 키보드`의 실행 여부를 나누어 적는다.

## 요구 계약과 실행 여부를 완료에 연결

선택지가 있는 최종 검증에는 `--require-contract`를 사용한다. 빈 계약/빈 옵션·중복 value는 유효한 기대 목록이 아니다. `--exercise-selects`를 요청했는데 대상이 숨거나 비활성이어서 선택하지 못하면 값 선택 실행 성공으로 세지 않는다. JSON은 domPassed와 selectionStatus를 나눈다. 계약의 DOM 일치만으로 후속 초안/금액/확인 결과를 증명하지 않는다.

최종 파일 변경 뒤 [완료 게이트](delivery-gates.md)를 다시 실행한다. 정적 마크업의 option 시작 태그 오타는 브라우저가 복구해 JS 오류 없이 옵션을 잃을 수 있다. 소스의 문자열 존재보다 실제 options와 기대 결과를 검사한다.
