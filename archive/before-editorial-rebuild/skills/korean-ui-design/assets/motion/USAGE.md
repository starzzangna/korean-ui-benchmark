# 선택 적용 모션 레시피

## 표현 중심 영역의 flow 모드

구도·프레임을 정한 소개 장면에는 부모에 `data-km-tempo="flow"`를 선택 적용한다. 장면820ms, 프레임680ms, 사진760ms, 대표 CTA420ms로 서로 다른 감속을 연결한다. 기본 업무 컨트롤230ms와 상세220ms는 유지한다. 해당 영역의 명시적 CSS 변수로 다시 조정할 수 있다.

```html
<section data-km-tempo="flow">
  <a href="#detail" data-km-scene style="--km-tilt:-1.2deg;--km-image-scale:1.03">
    <div data-km-frame><div class="image-window" style="overflow:hidden">
      <div data-km-image-layer="scale"><img src="work.jpg" alt="실제 작업의 설명"></div>
    </div></div>
  </a>
  <a href="#detail" data-km-control="cta">작업 보기 <span data-km-arrow aria-hidden="true">→</span></a>
</section>
```

외부 회전 여백과 링크 포커스 링은 이미지 크롭 영역 밖에 확보한다. 프레임 정돈·사진 확대는 자료에 맞게 하나만 쓸 수 있다. hover와 키보드 focus-within에서 반응하고 터치에서는 누르는 실제 행동이 유지된다. 전면 사진처럼 이미지가 독립 조작 대상이 아니면 단회 등장만 선택할 수 있다. 모션 감소·수동 끄기에서는 모두 정적으로 표시한다.

[구도별 실행 예제](../compositions/index.html)는 전면 사진·사진 먼저·포스터·갤러리·겹침·분할의 구조와 이 모드의 조합을 보여준다. 색·사진·문구는 새 프로젝트의 자료로 교체한다.

`motion.css`, `motion.js`를 사용할 프로젝트로 **명시적으로 복사**한 뒤 연결한다. `index.html`은 독립 실행 가능한 작은 기술 데모이며 완성 사이트의 구성안이 아니다. 기존 `interactions.css/js`의 `data-kui-*`와 같은 요소에 중복 적용하지 않는다. 업무 목록·폼·전역 버튼에는 일괄 등록하지 않는다.

```html
<section id="intro-scenes">
  <article data-km-scene style="--km-distance:18px;--km-scene-time:760ms;--km-tilt:-1.5deg">
    <!-- 회전한 외곽과 확대 후 크기를 수용하는 여백을 직접 확보한다. -->
    <div style="padding:24px">
      <div data-km-frame style="width:92%;margin:auto">
        <div data-km-image-layer="scale"><img src="photo.jpg" alt="장면 설명" style="width:100%;display:block"></div>
      </div>
    </div>
  </article>
  <a href="/reservation" data-km-control="cta">예약하기 <span data-km-arrow aria-hidden="true">→</span></a>
</section>
<script src="motion.js"></script>
<script>const motion = KoreanMotion.mount(document.getElementById('intro-scenes'));</script>
```

- **장면 설정:** `--km-distance:18px`, `--km-scene-time:760ms`로 단회 등장. IntersectionObserver가 없으면 정적 표시. 뒤로가기·스크롤 복원에서는 재등장하지 않는다. 장면 root는 transform이 없는 전용 wrapper를 사용한다.
- **선택적 시차:** 앞뒤 장면의 관계를 표현할 때 보조 wrapper에 `--km-scene-delay:90ms`처럼 짧게 지정할 수 있다. 기본은0이며 모든 항목을 순차 지연시키지 않는다. 지연 중 WAAPI의 backwards fill이 첫 프레임을 유지하고 취소/모션 감소에서는 기본 표시로 돌아온다. 제목·필수 정보·동작을 완료까지 기다리게 하지 않는다.
- **레이어 설정:** `--km-tilt:-1.5deg`, `--km-frame-time:460ms`. 등장 → 회전 → 이미지 확대 wrapper를 나눈다. `data-km-image-layer="scale"`는 선택 사항이며 `--km-image-scale:1.045`로 확대만 한다. 기존 transform이 있는 이미지 자신에게 이 속성을 붙이지 않는다. 회전/확대 후 외곽에 맞춰 폭과 여백을 확보하고 작은 화면에서 검증한다. 일반적인 콘텐츠 넘침을 `overflow:hidden`으로 감추지 않는다.
- **컨트롤 설정:** 대표 CTA에만 `data-km-control="cta"`. `--km-cta-lift:-2px`, `--km-arrow-distance:3px`, `--km-control-time:230ms`. 링크의 실제 목적지를 유지하고 dialog라면 호출자가 클릭·초점 복귀를 연결한다. `dialog[data-km-dialog]`의 진입은 `--km-dialog-distance:8px`, `--km-dialog-time:220ms`. 장면 등록과 컨트롤 설정은 독립적이다.
- **복구:** CSS 기본 상태는 표시. JS 차단·오류·WAAPI 미지원에도 내용을 숨기는 클래스가 없다. 모션 감소가 실행 중 켜지면 즉시 취소하고 콘텐츠를 표시한다. 다시 꺼도 자동 재생하지 않는다. 터치에서 hover 없이 모든 내용을 읽고 행동할 수 있다.
- **호출:** `motion.replay()`는 현재 보이는 장면을 한 번 재생하고 아직 안 보이는 장면도 다음 진입 시 한 번만 재생한다. `motion.setDisabled(true)`는 진행 중 모션을 취소한다. `false`만으로 재등장하지 않는다. `motion.destroy()`는 관찰·이벤트를 해제한다. 한 root에 mount를 중복 호출하지 말고 해제 후 재연결한다.

로컬에서 `index.html`을 직접 열거나 정적 서버로 실행할 수 있다. 네트워크 자산·라이브러리·빌드 과정이 필요하지 않다. 모션 수치는 시작점이므로 실제 장면과 사용 기기에 맞춰 조정한다.

부드러운 감속은 장면/프레임/컨트롤/상세별 easing 변수로 조정한다. 기본 장면·회전 곡선은 cubic-bezier(.32,0,.2,1)이며 시작·끝 속도를 줄인다. 입력과 초점 처리는 전환 종료를 기다리지 않는다.

프레임에 별도의 `transition: box-shadow ...` 같은 축약 선언을 뒤에서 쓰면 transform 전환이 덮어써질 수 있다. 필요한 속성을 같은 transition 목록에 명시하거나 불필요한 축약 선언을 제거한다. computed transition-property/duration과 회전 중간 자세·왕복을 확인하며 끝 자세만 보고 부드러운 전환이 구현됐다고 판단하지 않는다.

## 상태와 내용에 맞는 예제

[contextual.html](contextual.html)은 기존 모듈과 독립된 선택 예제다. contextual.css/js와 필요한 HTML 블록만 복사한다. UI 색·문구·전체 페이지를 새 사이트에 복사하지 않는다. 입력→산출물 장면은 개념 설명용, 수업 선택은 즉시 가격/폼 연동, 버튼은 안쪽 레이어의 짧은 press, details는 native 열림 상태를 회전으로 보조한다. 실제 등록·전송은 없다.

기존 motion.js와 자동 중복 등록하지 않는다. 장면 wrapper에는 원래 transform을 두지 않고 회전/press는 안쪽에 둔다. 재생은 사용자가 누른 예제에서만 일어나며 reduced motion이면 기본 자세로 즉시 표시된다. JS가 없으면 전체 설명·기본 가격·펼침 내용은 native details로 읽을 수 있고 동적 선택은 disabled 상태와 noscript 안내를 유지한다.
