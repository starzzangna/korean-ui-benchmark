# 컨트롤 정렬과 Tailwind 구현 기준

셀렉트, 아이콘이 있는 버튼·메뉴, 폼 툴바를 만들거나 정렬 문제를 수정할 때 읽는다. 수치는 신규 화면의 시작값이며 기존 디자인 토큰과 사용자의 선택을 우선한다. 원인 확인 없이 음수 마진·`translate-y`·`!important`로 위치를 맞추지 않는다.

같은 행의 상태/통계 카드에서는 바깥 높이뿐 아니라 라벨·숫자·단위의 축도 함께 대조한다. 내용 길이에 따라 일부 카드만 flex-wrap으로 다음 줄에 내려가지 않게 내부 행/열을 명시한다. 모바일·중간 폭·글자 확대와 자릿수가 다른 값으로 확인한다. 늘어난 내용을 숨겨 축을 맞추지 않는다.

Tailwind 등 외부 기본 스타일을 함께 쓰면 로드 완료 후 제목·입력·select의 실제 글꼴/행간/패딩을 확인한다. 뒤늦게 삽입된 리셋이 작성한 스타일을 덮으면 리셋 적용 범위나 캐스케이드 순서를 정리한다. 개발 중 작성한 CSS 값과 브라우저의 최종 계산값을 같은 것으로 간주하지 않는다.

## 정렬 계약

| 대상 | 기준 | 긴 문구 처리 |
|---|---|---|
| 단일 행 버튼 | 아이콘+텍스트 묶음의 가로·세로 중앙 | 필요한 너비 확보 또는 명시적 줄바꿈; 고정 높이로 자르지 않음 |
| 아이콘 전용 버튼 | 정사각형 조작 영역의 중앙 | `aria-label`로 행동 이름 제공 |
| 메뉴 항목 | 아이콘 열 고정, 글자 시작점 좌측, 행 중앙 | 글자 열 `minmax(0,1fr)`; 배지는 별도 열 |
| 여러 줄 설명 | 아이콘을 첫 텍스트 줄에 맞추는 구성이 기본 | 설명 전체의 중앙과 첫 줄 정렬을 구분 |
| 셀렉트 | 선택값 좌측, 화살표 우측 중앙 | 화살표 여유 공간 보장; 전체 값은 열었을 때 확인 가능 |
| 폼 툴바 | label을 제외한 입력·버튼 조작 상자 정렬 | 모바일은 감싸기/한 열; 글자·아이콘을 압축하지 않음 |

기본 토큰: 컨트롤 최소 높이 44px, 본문 14~16px·행간 20~24px, 아이콘 16~20px, 아이콘과 문구 간격 8px. 실제 디자인에 따라 조절한다. 16px SVG와 20px 텍스트 상자는 각각의 중심을 맞추므로 둘의 위쪽 좌표가 같을 필요는 없다. 글꼴의 실제 글자 모양이 상자 중앙과 다른 경우에는 폰트·SVG viewBox의 여백부터 확인한다.

## 안내문·동의 항목의 최초 제작 기준

안내 아이콘이 문구보다 큰 경우 `align-items:start`만 적용하면 위쪽 좌표만 같아지고 중심은 어긋난다. 문구와 아이콘을 별도 자식으로 만들고, 줄바꿈 시 **문단 전체 중앙 / 첫 줄 중앙** 중 무엇을 유지할지 먼저 정한다. PC 한 줄 안내는 묶음의 세로 중앙, 모바일 여러 줄 안내와 동의 항목은 첫 줄 중앙을 기본 후보로 삼되 실제 읽는 흐름에 따라 선택한다. 수평 가운데 배치·텍스트 가운데 정렬과 혼동하지 않는다.

- 아이콘은 줄어들지 않는 상자에 두고 내부를 flex/grid로 중앙 정렬한다. SVG는 block과 실제 viewBox를 확인한다. 문자 아이콘은 폰트별 내부 여백도 눈으로 확인한다.
- 첫 줄 정렬은 아이콘의 바깥 상자를 문구의 한 줄 높이와 같게 하고 내부 아이콘을 중앙에 둔다. `controls.css`의 `.kui-notice`와 `.kui-notice--first-line` 패턴을 선택적으로 사용한다. 기존 컴포넌트에는 같은 관계만 적용한다.
- 체크박스·라디오도 문구 첫 줄과 맞춘다. 기본 margin을 확인하고, 두 줄이 되어도 조작 상자가 문단 전체 중앙으로 내려가지 않게 한다. 실제 input·label 연결과 조작 영역을 유지한다.
- 한글·영문·숫자, 기본 폰트/로드 완료, 한 줄/여러 줄, 오류로 길어진 문구를 확인한다. 아이콘 크기·행간·반응형 전환은 DESIGN.md에 함께 기록한다.

Tailwind에서는 한 줄 묶음에 `flex items-center gap-2`, 아이콘 상자에 `inline-flex shrink-0 items-center justify-center`, SVG에 `block h-4 w-4`처럼 역할을 분리한다. 여러 줄의 첫 줄 정렬은 `items-start`만 추가해서 끝내지 않고 아이콘 상자의 높이를 문구 행간에 맞춘다. 프로젝트 설치 버전에서 지원되는 유틸리티를 쓴다.

검사는 버튼 이름만 통과시키지 않는다. 중앙 정렬 계약의 실제 두 상자 중심 차이와 첫 줄 정렬 계약의 아이콘 상자/첫 줄 중심 차이를 각각 측정한다. 범용 후보 수집기의 큰 delta는 검토 후보이며 로고 장식·다중 열 목록·문단 전체 상자를 잘못 짝지은 값은 실패로 세지 않는다. 상자 일치 후에도 실제 글리프·선의 광학적 중심을 캡처로 확인한다.

[실행 가능한 안내 정렬 예제](../assets/alignment.html)에서 같은 크기·다른 크기·여러 줄 문구의 상자 관계를 확인할 수 있다. 프로젝트의 실제 폰트와 문구로 최종 검토한다.

## 단일 행 버튼

아래는 HTML 예시다. React에서는 `class`를 `className`, `for`를 `htmlFor`로 옮기고 SVG 속성을 JSX 표기에 맞춘다. 예시 색은 프로젝트 토큰으로 바꿀 수 있다. 유틸리티의 지원 여부는 설치한 Tailwind 버전에서 확인하고, 로컬 렌더링 검증 버전은 별도 검증 기록을 따른다.

```html
<button type="button" data-example="icon-button"
  class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-medium text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
  <svg class="block h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" stroke-linecap="round"></path>
  </svg>
  <span class="min-w-0 leading-5">공고 등록</span>
</button>
```

`items-center`는 교차축, `justify-center`는 주축, `text-center`는 텍스트 내부 정렬이다. 서로 대체할 수 없다. `leading-none`만으로 한글을 맞추거나 텍스트를 `line-height:44px`로 설정하지 않는다. 두 줄이 되면 버튼이 커질 수 있도록 `min-h`와 세로 패딩을 사용한다.

아이콘만 있는 닫기 버튼은 `inline-flex h-11 w-11 shrink-0 items-center justify-center p-0`으로 조작 영역을 정하고 `aria-label="닫기"`를 부여한다. SVG 자체의 크기를 44px로 키우지 않는다. 로딩 아이콘도 같은 고정 상자를 쓰고 버튼에 `aria-busy`와 상태 문구를 제공한다.

```html
<button type="button" aria-label="닫기" data-example="icon-only"
  class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-500 bg-white p-0 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
  <svg class="block h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
    <path d="m6 6 12 12M6 18 18 6" stroke-linecap="round"></path>
  </svg>
</button>
```

## 단일 선택 셀렉트

검색·복수 선택이 필요 없으면 네이티브 select를 우선한다. 기존 프로젝트가 접근 가능한 Select/Combobox 컴포넌트를 쓰면 그 체계를 유지하고 트리거·옵션·포털의 스타일 계약을 확인한다. 단순히 div를 누르게 만들어 네이티브 키보드·폼 기능을 잃지 않는다.

기본 화살표를 유지하려면 `appearance-auto`로 두고 커스텀 SVG를 추가하지 않는다. 플랫폼마다 기본 화살표와 팝업 모양이 다른 것은 정상이다. 화살표 위치를 통일해야 할 때 다음처럼 외부 wrapper에 별도 아이콘을 둔다.

```html
<label for="hiring-stage" class="mb-2 block text-sm font-medium text-slate-900">전형 단계</label>
<div class="relative min-w-0" data-example="select-wrap">
  <select id="hiring-stage" name="stage" aria-describedby="stage-help"
    class="peer block min-h-11 w-full min-w-0 appearance-none rounded-lg border border-slate-500 bg-white py-2 pl-3 pr-10 text-sm leading-6 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600 aria-invalid:border-red-700 forced-colors:appearance-auto">
    <option value="all">전체 전형</option>
    <option value="long">면접 일정 확인이 필요한 지원자 전체</option>
  </select>
  <span class="pointer-events-none absolute inset-y-0 right-3 flex w-4 items-center justify-center text-slate-600 peer-disabled:opacity-50 forced-colors:hidden" aria-hidden="true">
    <svg class="block h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" focusable="false">
      <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </span>
</div>
<p id="stage-help" class="mt-2 text-sm leading-6 text-slate-600">지원자 목록에 적용할 단계를 선택하세요.</p>
```

- `pr-10`은 오른쪽 40px을 비워 16px 화살표+12px 오른쪽 간격+문구와의 여유를 확보한다. 글자 크기·아이콘 크기를 바꾸면 함께 계산한다.
- `appearance-none`은 기본 화살표를 없앨 뿐, 네이티브 선택값을 flex 자식으로 바꾸지 않는다. select 자체에 `flex items-center`를 붙여 해결했다고 하지 않는다.
- `h-10 py-4`처럼 높이보다 큰 패딩을 섞지 않는다. 글꼴·행간이 잘리면 고정 높이를 해제하고 `min-h`를 쓴다. 짧은 라벨과 긴 한국어 라벨을 모두 확인한다.
- 키보드 Tab·화살표 선택, 클릭, 폼 직렬화의 value가 유지되어야 한다. disabled 상태는 키보드 순서에서 제외되고 클릭으로 바뀌지 않아야 한다.
- `aria-invalid="true"`는 실제 오류일 때만 설정하고 오류 문구를 `aria-describedby`에 연결한다. required·초기 안내 option은 제품의 검증 정책에 맞춘다.
- forced-colors에서는 커스텀 화살표를 숨기고 네이티브 표시를 복구한다. 네이티브 옵션 팝업의 모양·말줄임은 OS·브라우저별이므로 CSS만으로 같다고 보장하지 않는다.
- 여러 줄 선택값 표시·검색·복수 선택이 필요하면 기존의 접근 가능한 컴포넌트 사용을 검토한다. 긴 중요한 값을 무조건 잘라 숨기지 않는다.

## 메뉴·배지·폼 행

메뉴는 `grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-3`처럼 열을 분리할 수 있다. 아이콘은 고정 상자, 텍스트는 `min-w-0`, 배지는 `shrink-0` 또는 별도 열로 둔다. 메뉴 전체를 `justify-center`로 바꾸면 문구 길이에 따라 시작점이 흔들리므로 피한다.

체크박스·라디오는 label에 `inline-flex items-center gap-2`, 입력에 `h-4 w-4 shrink-0`을 적용한다. 설명이 여러 줄이면 `items-start`와 첫 줄 높이를 기준으로 정렬하며 전체 설명 중앙에 고정하지 않는다.

폼 툴바의 라벨 높이가 달라 조작 영역이 틀어지면 label과 입력 행을 나누거나 입력·버튼 묶음에서 `items-end`를 사용한다. 긴 도움말·오류 문구까지 포함한 전체 필드를 중앙 정렬하지 않는다. grid에서는 `minmax(0,1fr)`, flex 자식에서는 `min-w-0`를 확인한다.

## 원인 확인 순서

서체를 교체하거나 폰트 로딩이 끝났을 때는 [typography.md](typography.md)의 실제 서체 확인과 함께 다시 측정한다. 기존 서체에 맞춘 고정 높이·작은 행간·상하 이동 보정이 새 한글·영문 글리프를 자르거나 선택값을 어긋나게 할 수 있다. 선언된 font-family만 보고 동일하게 적용됐다고 판단하지 않는다.

1. 실제 DOM과 computed style로 display·align-items·height·line-height·padding·box-sizing을 확인한다. Preflight와 기존 전역 CSS가 적용되는지도 확인한다.
2. SVG viewBox·기본 inline baseline·아이콘 폰트의 여백을 확인한다. 아이콘을 `display:block`으로 만들고 flex/grid 상자 안에 배치한다.
3. Radix/shadcn 등 기존 컴포넌트가 이미 넣은 화살표·크기·padding과 새 클래스가 겹치는지 확인한다. 자식 SVG 전체를 전역 선택자로 변경하지 않는다.
4. 한 요소에 `h-10 h-12`, `py-2 py-4`, 서로 다른 임의 `!important`를 겹쳐 두지 않는다. 클래스 나열 순서가 생성 CSS 우선순위를 보장하지 않는다. 공통 컴포넌트의 크기 variant에서 정리한다.
5. 높이 클래스 이름에 변수를 이어 붙이는 동적 조합 대신 완전한 정적 클래스 문자열을 variant별로 매핑해 빌드에서 누락되지 않게 한다.

## 검증 계약

모든 픽셀이 같아야 한다는 기준과 실제 조작이 가능하다는 기준을 구분한다.

- 320/390px과 데스크톱, 짧은 문구·긴 한국어 문구·빈 값·disabled·오류·로딩을 렌더링한다. 사용자 글자 크기 200%에서도 내용·초점이 잘리지 않는지 확인한다.
- 중앙 정렬용 버튼의 아이콘 상자와 텍스트 span 상자의 세로 중심 차이는 1 CSS px 이내를 기본 허용오차로 검사한다. 여러 줄·첫 줄 정렬 패턴에는 이 기준을 기계적으로 적용하지 않는다.
- 아이콘+텍스트 묶음의 좌우 여백, 아이콘 크기 유지, 버튼 최소 조작 영역과 문서 가로 넘침도 확인한다. 좌우 padding이 의도적으로 다른 버튼에는 대칭 검사를 적용하지 않는다.
- 커스텀 화살표 중심과 select 상자 중심 차이를 검사하고 화살표 왼쪽보다 선택값용 콘텐츠 영역이 먼저 끝나는지 확인한다. native select 내부 글자의 정확한 픽셀 상자는 DOM만으로 측정하기 어려우므로 스크린샷도 확인한다.
- 실제 label 연결, Tab 이동, 선택 변경, 폼 제출 값, disabled 동작을 검사한다. 고대비 모드의 네이티브 표시 복구도 확인한다.
- 글꼴이 로드된 뒤 촬영한다. 동일 브라우저·배율·글꼴로 기준 이미지를 비교하고 OS별 네이티브 팝업 차이를 결함으로 오인하지 않는다.

## 공식 참조

2026-11-03 확인: [align-items](https://tailwindcss.com/docs/align-items), [appearance](https://tailwindcss.com/docs/appearance), [flex-shrink](https://tailwindcss.com/docs/flex-shrink), [text-overflow](https://tailwindcss.com/docs/text-overflow). 실제 설치 버전의 유틸리티·Preflight·지원 브라우저를 확인하고 적용한다.

## 여러 줄을 묶은 복합 버튼

‘DAY 라벨 + 날짜/요일’처럼 두 행의 문구 그룹 옆 화살표는 문구 전체 그룹의 중앙을 기준으로 할 수 있다. 일반 한 줄 중앙·안내 첫 줄·복합 그룹 전체 중앙·의도한 비대칭을 구분해 DESIGN.md에 대상 selector를 쓴다. 각 span과 화살표의 중심을 무조건 맞추지 않는다.

복합 문구를 하나의 wrapper로 묶고 바깥 grid/flex에서 아이콘과 align-items:center를 적용한다. 첫 줄 안내는 첫 줄 line-height 상자와 비교한다. 검사기는 선언된 그룹의 rect와 비교하고 그룹을 식별하지 못하면 육안 확인 후보로 남긴다. 큰 centerDelta만으로 CSS를 수정하지 않는다. 원문·폰트 로드·긴 한글·200%에서 다시 확인한다.

## 내부 정렬과 그룹 전체 배치를 나눠 검사한다

`anchor`(목록/버튼 등의 기준 컨테이너) → `group`(아이콘+문구 한 묶음) → icon/text를 구분한다. PC 안내의 아이콘과 문구가 수직으로 맞아도 group이 anchor의 왼쪽에 붙어 있으면 ‘안내 전체 중앙’ 계약은 실패다. anchor의 border/padding을 제외한 콘텐츠 영역과 group의 가로 중심/시작/끝을 비교한다. group은 실제 내용을 감싼 폭으로 두며, 빈 공간까지 늘어난100% wrapper를 중앙 배치 근거로 쓰지 않는다. 모바일 첫 줄 정렬은 문단 전체 높이와 비교하지 않는다.

[검사 함수](../scripts/layout-probes.js)의 `measureGroups`와 [감사 도구](browser-audit.md)의 선택적 `groups` 계약을 사용할 수 있다. 없는/복수 대상·식별 불가 첫 줄은 통과가 아니라 미측정으로 기록한다. 수치 기준은 선언된 상자 배치용이며 글리프의 광학적 위치·의도한 비대칭은 실제 화면에서 판단한다. 긴 문구·웹폰트 완료·hover 복귀·확대 상태를 각각 확인한다.


## 나란한 select·검색·버튼의 크기 계약

같은 탐색 행은 label·도움말이 아닌 실제 조작 상자의 위/아래 기준선을 맞춘다. native select는 line-height가 일반 input처럼 작동하지 않을 수 있어 같은 padding/min-height만 주고 높이가 같다고 판단하지 않는다. input[type=search]의 기본 appearance·box-sizing·margin과 버튼의 border 유무도 비교한다.

- 행 안에서 font-size·line-height·box-sizing·border 두께·세로 padding·최소 조작 높이를 공유한다. 검색창+제출 버튼은 하나의 행으로 늘어나며, 별도 초기화 버튼도 같은 기준선을 따른다. 전체 필드에 items-end만 붙이면 높이가 다른 원인이 남는다.
- 예를 들어 일반 16px 탐색 행은 line-height:1.5, box-sizing:border-box와 `height:max(48px,calc(1.5em + 22px))`를 공유할 수 있다. 48px은 이 구성의 시작값이다. 긴 버튼은 줄바꿈/행 전체 재배치를 선택하고 고정 높이로 자르지 않는다. 기존 토큰을 우선한다.
- Tailwind에서도 공통 컴포넌트/토큰으로 같은 높이·leading·border-box를 적용한다. `min-h-12`만 주거나 select에 flex를 붙여 동일 높이라고 보고하지 않는다. 프로젝트가 지원하는 CSS 계산식/유틸리티로 확대 시 크기가 늘어나게 한다.
- font 로드 후 실제 rect의 높이·위/아래 좌표를 비교한다. 같은 행 계약의 허용차는 약1 CSS px부터 검토한다. 라벨→조작 간격, 필드 사이 간격, 카드 이름/가격/행동 축도 별도로 확인한다. 문구가 긴 오류는 다음 행으로 보내고 입력 기준선을 움직이지 않게 구성한다.
- PC·모바일·글자만2배·글자/행간2배에서 재검사한다. 공간이 부족하면 한 열로 바꾸고 native select/검색 입력의 키보드·값·초점·빈 결과 복구를 유지한다. 한 열 필드와 다른 역할의 대표 CTA에 동일 높이를 무조건 강제하지 않는다.


## 네이티브 선택 기능과 화살표 표시의 공통 계약

여러 카테고리/화면에서 셀렉트 간격을 통일해야 하면 `appearance:auto`의 패딩을 화살표 위치로 간주하지 않는다. OS 기본 화살표의 위치는 padding-right만으로 정확히 지정할 수 없다. 실제 select는 유지하고 표시만 wrapper+SVG로 분리한다. `select.css`의 `.kui-select-shell > select.kui-select-native + svg.kui-select-arrow`를 사용할 수 있다.

- 이 패턴의 시작값은 화살표 상자16px·외곽 오른쪽 여백12px·문구와 화살표 사이12px이다. 프로젝트 토큰이 있으면 대체하되 같은 시스템의 화면에는 같은 토큰을 쓴다. SVG 안 선의 광학적 여백과 바깥 상자 여백을 구분한다.
- wrapper는 label/도움말/오류를 포함하지 않고 select만 감싼다. width/min-width·flex/grid 자식 역할을 확인하고, 상위 폼의 열/높이/간격을 바꾸지 않는다. inset-inline-end·padding-inline-end로 방향을 연결하고 세로 중앙은 select 조작 상자 기준으로 맞춘다.
- SVG는 aria-hidden=true·focusable=false·pointer-events:none으로 선택값 클릭과 키보드 초점을 가로채지 않는다. 기존 label/id/name/required/disabled/options 및 change 이벤트를 유지한다. 선택 기능을 div로 재구현하지 않는다.
- 커스텀 표시를 적용할 때만 appearance:none으로 기본 화살표를 숨긴다. forced-colors에서는 SVG를 숨기고 appearance:auto로 복구한다. disabled/invalid/초점은 원래 조작 상태와 연결한다. 화살표 회전은 실제 열림 상태를 알 수 있을 때만 사용하고 focus를 열림으로 간주하지 않는다.
- 320/390/768/1440px·글자만2배·글자/행간2배에서 화살표 중앙차이와 오른쪽 상자 여백, 선택 문구 영역을 각각 측정한다. 긴 값은 native 팝업에서 전체 옵션을 확인할 수 있게 하며 핵심 선택값을 화면에서도 모두 읽어야 하는 과업이면 폭/한 열 재배치를 우선한다.
- Tab/Shift+Tab·ArrowDown/ArrowUp·Enter/Escape, label 클릭·change와 연결된 목록/가격/내용 갱신을 실제 브라우저에서 검사한다. selectOption API만으로 키보드 검사를 대체하지 않는다. OS별 팝업과 물리 기기는 별도 검증 범위를 적는다.


[실행 가능한 공통 셀렉트 예제](../assets/select.html)는 assets/select.css·select.js를 사용한다. 선택 문구가 실제 가용 폭보다 길 때만 전체 값을 외부 보조 줄로 표시한다. 기본 옵션 문구를 임의로 줄이지 않는다. 보조 줄은 label/오류와 분리하고 native 접근성 값과 중복 낭독하지 않도록 구성한다. ResizeObserver·글꼴 완료·change·프로그램 선택 뒤 갱신을 확인한다. 동적 컴포넌트는 생명주기에서 관찰자 해제와 값 동기화를 연결한다. 기존 controls.css 패턴과 새 select.css를 같은 대상에 중복 적용하지 않는다.

정적 select.js 예제는 초기 DOM의 셀렉트를 대상으로 한다. 동적 화면은 기존 프레임워크 컴포넌트의 값/크기 변경과 관찰자 해제에 연결한다. 기존 Select/Combobox 라이브러리를 쓰는 프로젝트에는 이 스크립트를 겹쳐 설치하지 않는다.

## 필수 선택지의 완전성과 연결 결과

요구 자료에서 필드의 역할·selector·필수 값·표시 문구·사용 가능 조건·연결 결과를 먼저 정한다. 선택 목록에서 기대값을 역으로 만들지 않는다. 프로그램 형식 필터와 참가권 종류처럼 비슷한 라벨의 다른 필드를 같은 계약으로 판정하지 않는다.

```html
<select id="work-type" name="category" required>
  <option value="">분야를 선택해 주세요</option>
  <option value="web">웹</option>
  <option value="editorial">편집</option>
  <option value="identity">아이덴티티</option>
</select>
```

위 세 분야는 예시 요구다. 실제 요구에 맞춰 값/문구를 교체하고 option 시작/종료 태그를 분리한다. HTML은 잘못된 태그가 있어도 파싱을 계속할 수 있으므로 문자열 검색·JS 구문 검사만으로 옵션이 생성됐다고 판단하지 않는다.

- 최종 브라우저의 `select.options`와 계약을 값·문구·개수로 대조한다. 빈 안내와 disabled/disabled optgroup 항목은 사용 가능한 필수 선택지를 대신하지 못한다. 중복 값이 의도한 것인지도 확인한다.
- 초기 화면뿐 아니라 폼 열기·필터 변경·재진입 등 목록이 달라지는 관련 상태를 연다. 동적 상태의 기대값은 상태별 요구로 적는다. 숨긴 필드의 DOM 존재만으로 조작 성공을 판정하지 않는다.
- 각 필수 값을 선택해 가격·필터 결과·초안/확인창·제출 값 중 연결된 결과가 같은 대상을 가리키는지 실제 조작한다. 모든 필수 값을 다루되 무관한 상태 조합 전수검사를 강제하지 않는다.
- 미선택 제출 차단→올바른 선택→완료→수정/재선택 흐름과 대표 키보드 선택을 별도로 확인한다. 누락을 고친 뒤 필수 전체 목록과 최종 결과를 다시 검사한다. 일반 제작은 미충족을 수정하고 동결 실험만 원본과 후속 수정을 구분한다.

[기존 감사기와 계약](browser-audit.md)은 DOM 목록·선택/복구를 확인한다. 연결 결과·동적 폼·실제 키보드는 프로젝트별 검사로 보완한다. [실행 예제](../assets/dialog.html)와 [독립 계약](../assets/dialog-demo-contract.json)을 함께 실행할 수 있다.

## 행간이 바뀌는 첫 줄과 안정된 맞춤 영역

기본에서 맞춘 margin-top:2px 같은 값이나 고정 24px 아이콘 줄 상자는 행간이 바뀌면 어긋난다. 아이콘 크기는 width/height로, 첫 줄 슬롯은 실제 line-height로 구분한다. `controls.css`는 지원 환경에서 1lh를 사용하고 이전 em 계산을 대체값으로 둔다. icon/text의 font-size·line-height를 불필요하게 다르게 선언하지 않는다. 한쪽 자식만 행간이 달라지면 공통 슬롯도 다시 검토한다. CSS 단위는 [W3C 정의](https://www.w3.org/TR/css-values-4/#lh)를 따른다.

hover translate로 버튼 전체 맞춤 영역을 이동시키면 경계의 포인터가 반복 출입할 수 있다. 입력/목록/확인 행동의 맞춤 영역은 고정하고 내부 화살표·사진 레이어만 이동시키는 방식을 먼저 검토한다. 위/아래/양끝 경계에 포인터를 둔 정지 상태, 빠른 왕복, 감소 모션에서도 진동·클릭 대기 실패가 없어야 한다. transform으로 실제 레이아웃 정렬을 보정하지 않는다.
