(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const activeAnimations = new Set();
  // 정보는 즉시 갱신하고 장식만 취소 가능한 형태로 움직인다.
  function animate(element, frames, options) {
    element.getAnimations().forEach(animation => animation.cancel());
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    activeAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) activeAnimations.forEach(animation => animation.cancel());
  });
  document.querySelectorAll('[data-layout]').forEach(button => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => {
      document.querySelector('.photo-scene').dataset.layout = button.dataset.layout;
      document.querySelectorAll('button[data-layout]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
  function filter(value) {
    let count = 0;
    document.querySelectorAll('.work-grid article').forEach(card => {
      card.hidden = value !== 'all' && card.dataset.kind !== value;
      if (!card.hidden) count++;
    });
    document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    document.querySelector('#work-status').textContent = `${value === 'all' ? '전체' : value === 'editorial' ? '편집' : value === 'web' ? '웹' : '빈 결과'} · ${count}개 작업`;
    document.querySelector('#empty').hidden = count !== 0;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
  document.querySelector('#reset-filter').addEventListener('click', () => {
    filter('all');
    document.querySelector('[data-filter="all"]').focus();
  });
  const viewer = document.querySelector('#viewer');
  const image = document.querySelector('#viewer-image');
  const error = document.querySelector('#image-error');
  const works = {
    book: { title: '읽는 사이', image: '../compositions/media/editorial.svg', note: '문장과 여백의 호흡 · 개념 편집물 전체 원본' },
    web: { title: '모아', image: '../compositions/media/interface.svg', note: '검색·상태·행동의 읽는 순서 · 개념 업무 화면 전체 원본' },
    detail: { title: '지면 관찰', image: '../compositions/media/editorial.svg', note: '목록은 같은 편집물의 크롭이며 상세는 전체 원본입니다. 신규 고객 작업이 아닙니다.' },
    plan: { title: '개념 산출물', note: '한 요청에서 시작한 판단과 다음 단계 · 실제 고객 자료 아님' }
  };
  let opener = null;
  let selected = null;
  function loadImage() {
    error.hidden = true;
    image.hidden = false;
    image.alt = selected.title;
    image.src = selected.image;
  }
  image.addEventListener('error', () => { image.hidden = true; error.hidden = false; });
  document.querySelector('#retry').addEventListener('click', loadImage);
  document.querySelectorAll('[data-work]').forEach(button => button.addEventListener('click', () => {
    opener = button;
    selected = works[button.dataset.work];
    document.querySelector('#viewer-title').textContent = selected.title;
    document.querySelector('#viewer-note').textContent = selected.note;
    document.querySelector('#image-zone').hidden = !selected.image;
    document.querySelector('#plan-detail').hidden = !!selected.image;
    if (selected.image) loadImage();
    viewer.showModal();
    document.querySelector('#close').focus();
    animate(viewer, [{ opacity: .65, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'cubic-bezier(.2,.7,.3,1)' });
  }));
  document.querySelector('#close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => {
    viewer.getAnimations().forEach(animation => animation.cancel());
    if (opener?.isConnected && !opener.closest('[hidden]')) opener.focus();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const buttons = [...viewer.querySelectorAll('button')].filter(button => button.getClientRects().length && !button.disabled);
    const first = buttons[0], last = buttons.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  const tickets = {
    general: { title: '일반 참가', description: '토크와 대화 프로그램', price: 12000 },
    workshop: { title: '워크숍 포함 참가', description: '토크·대화와 한 장의 화면을 만드는 워크숍 포함', price: 25000 }
  };
  function updateTicket() {
    const ticket = tickets[document.querySelector('#ticket').value];
    const people = Number(document.querySelector('#people').value);
    document.querySelector('#ticket-description').textContent = `${ticket.title} · ${ticket.description} · 1명 ${ticket.price.toLocaleString('ko-KR')}원`;
    document.querySelector('#ticket-status').textContent = `${ticket.title} · ${people}명`;
    const total = document.querySelector('#total');
    total.value = (ticket.price * people).toLocaleString('ko-KR') + '원';
    animate(document.querySelector('.total'), [{ backgroundColor: '#eadbc8' }, { backgroundColor: 'transparent' }], { duration: 360 });
  }
  document.querySelector('#ticket').addEventListener('change', updateTicket);
  document.querySelector('#people').addEventListener('change', updateTicket);
  document.querySelectorAll('button[disabled],select[disabled]').forEach(control => { control.disabled = false; });
})();
