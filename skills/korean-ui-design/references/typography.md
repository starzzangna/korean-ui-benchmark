# 한국어·영문 타이포그래피

## 글꼴의 역할과 실제 제공

Pretendard는 한글과 라틴 문자를 함께 쓸 수 있다. 본문을 한글·영문으로 무조건 분리할 필요는 없다. Apple SD Gothic Neo를 대표 영문 글꼴로 설명하지 않는다. Apple 플랫폼의 대표 시스템 서체는 SF Pro이며 웹에서는 `-apple-system`·`system-ui`로 해당 환경의 시스템 글꼴을 참조한다. Windows 등에서 같은 모양이 된다고 보장하지 않는다.

기본 서체는 한글·영문·숫자와 제목·본문·폼 모두 Pretendard다. 별도 요구가 없으면 동봉 파일을 자체 호스팅하고 폼 요소에도 상속한다. 사용자 요청이나 확정된 브랜드 규칙이 있을 때만 별도 서체를 선택하고 적용 범위와 이유를 기록한다.

`FONT_POLICY`는 기본적으로 `self-hosted`로 시작하며 다음 조건에 맞게 확정한다.

| 값 | 선택 조건 | 구현과 보고 |
|---|---|---|
| auto | 기존 프로젝트의 제공 방식이 아직 미확정 | 기존 Pretendard 파일·네트워크 제약을 확인하고 중복 로딩 없이 제공 방식을 기록 |
| self-hosted | Pretendard 적용 또는 플랫폼 간 일관성이 필요 | 공식 배포본·허용된 글꼴 파일을 로컬에서 제공하고 라이선스·버전·굵기·용량 기록 |
| system | 외부 파일 없는 배포 또는 운영체제 고유 인상 | 시스템 스택 사용. Pretendard가 실제 적용됐다고 보고하지 않음 |

무료 글꼴도 파일 제공과 라이선스 고지가 필요하다. 자체 호스팅은 글꼴 이용에 유료 API가 필요 없다는 의미이며 다운로드 크기·네트워크 비용이 사라지는 것은 아니다. 기존 브랜드 서체와 로컬 파일을 우선하고 글꼴 설치·서비스 가입을 기본 전제로 삼지 않는다. Apple 시스템 글꼴 파일을 복사해 웹폰트로 배포하는 방식을 기본 해법으로 쓰지 않는다.

## 기본 선택과 영문 제목

- 한국어 서비스·SaaS 본문: 제공 가능한 Pretendard 한 패밀리로 혼용 문장을 우선 구성한다. 업무 숫자는 필요한 영역에만 `font-variant-numeric: tabular-nums`를 적용한다.
- 브랜드·행사·포트폴리오도 제목과 본문에 Pretendard를 기본 적용한다. 별도 display 서체는 사용자 요청이나 확정된 브랜드 규칙이 있을 때만 선택하고 실제 에셋·굵기·라이선스를 확인한다. ‘프리미엄이므로 두 폰트’처럼 결정하지 않는다.
- 소개형 페이지의 첫 섹션 대표 제목은 Pretendard 700을 기본 출발점으로 삼아 본문·보조 제목보다 선명한 위계를 만든다. 크기만 키우고 400~550의 가는 굵기로 위계를 대신하지 않는다. 브랜드 규칙·문구·화면 밀도에 따라 조정하며 업무 앱의 화면 제목은 별도 위계로 판단한다. 굵기 변경 후 모바일 줄바꿈과 200% 글자 확대를 다시 확인한다.
- `font-family: Pretendard, Geist, ...`는 문자별 fallback 순서다. Pretendard가 영문 글자를 갖고 있으면 뒤의 Geist가 영문에 자동 적용되지 않는다. 필요할 때 실제 영문 요소에 `.display-latin` 등 역할 클래스로 별도 지정한다. `lang` 속성은 실제 언어 의미에 맞게 쓴다.
- Latin 전용 서체의 `0.95` 행간·강한 음수 자간을 한글 혼용 제목에 그대로 적용하지 않는다. 한국어·혼용 제목은 1.2~1.35, 본문 1.6~1.75 정도에서 실제 글자와 폭에 맞춰 조절한다. 숫자는 품질 점수나 고정 제한이 아니다.

## 자체 호스팅 예시

이 패키지에는 선택적으로 복사할 `assets/fonts/PretendardVariable.woff2` v1.3.9 원본과 OFL LICENSE.txt·fonts.css를 동봉한다. 약 2.06MB이며 자동 포함하지 않는다. 기존 파일이 있으면 중복 제공하지 않는다. 실제 가변 축은 동봉 CSS의 45~920이며 아래 코드는 일반적인 100~900 사용 범위 예시다. 수정/서브셋 배포는 원본 OFL의 Reserved Font Name 조건을 확인한다. 원본 그대로 자체 호스팅해도 첫 로드 용량을 측정한다.

아래 예시는 **실제 variable woff2와 라이선스를 확보했을 때만** 사용한다. 문서의 경로를 복사하는 것만으로 파일이 생기지 않는다. 정적 파일이라면 실제 제공한 400·600·700 등 굵기별로 face를 선언하고 가변 범위를 적지 않는다. 공식 서브셋을 쓰면 연결된 모든 파일·unicode-range를 함께 유지한다.

```css
@font-face {
  font-family: 'Project Pretendard';
  src: url('./fonts/PretendardVariable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
:root {
  --font-ui: 'Project Pretendard', 'Pretendard Variable', Pretendard,
    -apple-system, BlinkMacSystemFont, system-ui,
    'Apple SD Gothic Neo', 'Segoe UI', 'Malgun Gothic', sans-serif;
  --font-display: var(--font-ui);
}
body { font-family: var(--font-ui); }
button, input, select, textarea { font: inherit; }
h1, h2 { font-family: var(--font-display); }
.metric { font-variant-numeric: tabular-nums; }
```

정해진 프로젝트 패밀리명은 기기 설치 폰트가 우연히 선택되는 것을 줄이고 파일 로딩 확인을 쉽게 한다. 지정한 가변 범위는 예시에서 사용하는 100~900이며 실제 파일 범위 안이어야 한다. 이미 로드한 서체를 중복 로드하지 않는다. `swap`에서도 늦은 교체로 줄 수·CTA 위치가 바뀔 수 있으므로 fallback 상태와 로드 완료 상태를 모두 본다. 실제로 쓰는 주요 파일만 preload를 고려한다.

시스템 방식이면 위 `@font-face`를 넣지 않고 `--font-ui`를 시스템 스택으로 정의한다. 동일한 시각 결과가 필요한 상황에서 파일 없이 시스템 fallback으로 조용히 끝내지 않는다. 로딩을 못 했으면 그 상태를 명시한다.

## Tailwind와 연결

프로젝트의 설치된 버전을 확인한다. v4에서는 기존 `@theme` 안의 `--font-sans` 또는 `@theme inline { --font-sans: var(--font-ui); }`로 `font-sans`와 같은 규칙을 연결한다. v3는 기존 config의 `theme.extend.fontFamily.sans`에 연결한다. 기존 설정이 있으면 덮어쓰기보다 해당 토큰을 수정한다. CDN·버전 변경이나 Tailwind 설치는 글꼴 적용의 전제가 아니다.

## 검증과 기록

1. 한글, 영문, 혼용 제목, `₩1,234,567 · 12:30 · 42%`, 긴 선택값을 준비한다. 빈 결과·오류·disabled·굵은 글자도 함께 확인한다.
2. 폰트 요청 성공·경로·굵기와 실제 적용 서체를 확인한다. Chrome DevTools의 Rendered Fonts 또는 가능한 환경의 CDP `CSS.getPlatformFontsForNode`를 사용한다. computed `font-family`는 선언된 후보 목록이지 실제 서체의 증명이 아니다. `document.fonts.check()`만으로 원하는 파일의 적용을 확정하지 않는다.
3. `document.fonts.ready` 이후 390·768·1440px를 캡처하고, 로딩 차단 상태도 확인한다. 제목 줄 수·문장 끝 한두 글자만 남는 줄·표 숫자·버튼 높이·셀렉트 잘림을 본다. 200% 확대도 별도로 확인한다.
4. 아이콘과 텍스트의 DOM 상자 중심을 측정한 뒤 눈으로 확인한다. 서체의 내부 여백 차이를 임의 `translateY`로 일괄 보정하지 않는다. 원래 역할·행간·padding·SVG viewBox를 먼저 확인한다.
5. 실제 본 기기·브라우저·파일 버전·한글/영문 렌더링 서체·미확인 플랫폼을 DESIGN.md 또는 검사 기록에 남긴다. Windows에서만 본 결과를 macOS·iOS·Android 검증으로 보고하지 않는다.

## MD 효과 실험에서

폰트 파일은 두 조건에 동일한 버전·바이트·라이선스로 제공하고 사용 규칙의 공통/조건별 범위를 제작 전에 고정한다. 제공군에만 웹폰트를 추가하면 디자인 지침과 폰트 공급의 효과가 섞인다. 이미 동결한 시안에 서체를 덧씌운 결과를 최초 제작 효과로 바꾸지 않는다. 실제 사용 서체도 각 조건의 관찰 결과로 기록한다.

## 근거

- [Pretendard 공식 문서](https://github.com/orioncactus/pretendard): 패밀리·배포·시스템/동일 환경 스택·라이선스.
- [Apple Fonts](https://developer.apple.com/fonts/): SF Pro와 플랫폼 서체 역할.
- [CSS font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-family), [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@font-face/font-display), [FontFaceSet.check](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check).
- [Tailwind font-family](https://tailwindcss.com/docs/font-family): 프로젝트 버전에 맞춰 적용.

## 확대에서 행간과 위계 유지

본문·안내·폼 결과에는 단위 없는 line-height를 우선한다. 부모의 px 행간을 다른 글자 크기 자식에게 그대로 상속시키거나 고정 높이로 누르지 않는다. 기본과 실제 확대에서 줄이 겹치면 최소 열 폭·nowrap·행 높이도 함께 수정한다. 원래 px 행간을 고정한 채 font-size만 주입한 스트레스는 일반 브라우저 확대와 구분해 기록하되 읽기 손실을 숨기지 않는다.

줄 수가 늘 때 제목과 닫기, 가격과 행동, 동적 확인 내용이 서로 밀어내는지 검사한다. 폰트 family 이름 일치·실제 렌더링·다운로드 크기는 서로 다른 확인이다. 두 번째 서체나 대형 전체 폰트 파일을 추가하기 전에 실제 정보 위계에 필요한지 판단한다.
