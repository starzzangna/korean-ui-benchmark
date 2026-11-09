// 독립 실행 예제의 탐색·원본 보기·모션 제어. 새 프로젝트에서는 실제 사용자 흐름에 연결한다.
(() => {
  const main = document.getElementById('demo');
  const motion = window.KoreanMotion?.mount(main);
  const $ = id => document.getElementById(id);
  let disabled = false;
  $('example-choice').addEventListener('change', event => { location.href = event.target.value; });
  $('replay').addEventListener('click', () => { motion?.replay(); $('demo-status').textContent = disabled ? '모션이 꺼져 있습니다.' : '보이는 장면을 다시 재생했습니다.'; });
  $('toggle-motion').addEventListener('click', () => {
    disabled = !disabled; motion?.setDisabled(disabled);
    $('toggle-motion').setAttribute('aria-pressed', String(disabled));
    $('toggle-motion').textContent = disabled ? '모션 켜기' : '모션 끄기';
    $('demo-status').textContent = disabled ? '모션을 끄고 정지 화면으로 표시합니다.' : '모션을 켰습니다. 다시 보기로 재생할 수 있습니다.';
  });
  const dialog = $('preview'), viewport = $('preview-viewport'), image = $('preview-image');
  let opener, source, zoomed = false, drag;
  function fit() {
    if (!image.naturalWidth) return;
    const width = Math.min(viewport.clientWidth, viewport.clientHeight * image.naturalWidth / image.naturalHeight);
    image.style.width = Math.round(width * (zoomed ? 2.25 : 1)) + 'px';
    image.style.height = 'auto'; viewport.classList.toggle('zoomed', zoomed); viewport.scrollTo(0, 0);
    $('zoom').setAttribute('aria-pressed', String(zoomed)); $('zoom').textContent = zoomed ? '축소 −' : '확대 +';
  }
  function load(retry = false) {
    zoomed = false; image.hidden = true; $('retry-image').hidden = true;
    $('image-state').hidden = false; $('image-state').textContent = '이미지를 불러오는 중입니다.';
    image.src = source + (retry ? '?retry=' + Date.now() : '');
  }
  document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
    opener = button; source = button.dataset.preview; image.alt = button.dataset.title;
    $('preview-title').textContent = button.dataset.title; dialog.showModal(); document.body.style.overflow = 'hidden';
    load(); $('close-preview').focus();
  }));
  image.addEventListener('load', () => { image.hidden = false; $('image-state').hidden = true; fit(); });
  image.addEventListener('error', () => {
    image.hidden = true; $('image-state').hidden = false; $('image-state').textContent = '이미지를 불러오지 못했습니다. 다시 시도해 주세요.'; $('retry-image').hidden = false;
  });
  $('retry-image').addEventListener('click', () => load(true));
  $('zoom').addEventListener('click', () => { zoomed = !zoomed; fit(); if (zoomed) viewport.focus(); });
  $('fit').addEventListener('click', () => { zoomed = false; fit(); });
  $('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus(); });
  // 브라우저 UI로 나가기 전 모달 안의 첫/마지막 조작 요소를 연결한다.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const nodes = [...dialog.querySelectorAll('button,[tabindex]')].filter(e => !e.disabled && e.tabIndex >= 0 && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0);
    const first = nodes[0], last = nodes.at(-1);
    if (!first) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  viewport.addEventListener('pointerdown', event => {
    if (!zoomed || event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = {x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop}; viewport.setPointerCapture(event.pointerId); viewport.classList.add('dragging'); event.preventDefault();
  });
  viewport.addEventListener('pointermove', event => { if (drag) { viewport.scrollLeft = drag.left + drag.x - event.clientX; viewport.scrollTop = drag.top + drag.y - event.clientY; } });
  const stop = () => { drag = null; viewport.classList.remove('dragging'); };
  viewport.addEventListener('pointerup', stop); viewport.addEventListener('pointercancel', stop);
  image.addEventListener('dragstart', event => event.preventDefault());
  addEventListener('resize', () => { if (dialog.open) fit(); });
})();
