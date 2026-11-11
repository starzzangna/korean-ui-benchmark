/* 자동 전역 등록 없음. 지정한 root 안의 장면만 등록하며 컨트롤 연결은 호출자가 맡는다. */
window.KoreanMotion = (() => {
  function mount(root) {
    if (!root) throw new Error('모션을 적용할 루트가 필요합니다.');
    const scenes = [...root.querySelectorAll('[data-km-scene]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const seen = new Set();
    const running = new Map();
    let disabled = false;
    let observer;
    const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
    function finishAll() {
      for (const animation of running.values()) animation.cancel();
      running.clear();
    }
    function play(el) {
      if (seen.has(el)) return;
      seen.add(el);
      observer?.unobserve(el);
      if (disabled || reduced.matches || !el.animate) return;
      const style = getComputedStyle(el);
      const distance = style.getPropertyValue('--km-distance').trim();
      const raw = style.getPropertyValue('--km-scene-time').trim();
      const duration = parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000);
      const easing = style.getPropertyValue('--km-scene-ease').trim() || 'cubic-bezier(.32,0,.2,1)';
      const delayRaw = style.getPropertyValue('--km-scene-delay').trim();
      const delay = parseFloat(delayRaw) * (delayRaw.endsWith('ms') ? 1 : 1000);
      try {
        // 기본 CSS는 항상 표시 상태. WAAPI가 실패하거나 취소되어도 숨김 클래스가 남지 않는다.
        const animation = el.animate([{ opacity: 0, transform: `translateY(${distance})` }, { opacity: 1, transform: 'translateY(0)' }], { duration: Number.isFinite(duration) ? duration : 760, delay: Number.isFinite(delay) ? Math.max(0, delay) : 0, fill: 'backwards', easing });
        running.set(el, animation);
        animation.finished.then(() => { if (running.get(el) === animation) running.delete(el); }, () => {});
      } catch (_) { /* 애니메이션 실패 시 기본 표시를 유지한다. */ }
    }
    function observe() {
      if (!('IntersectionObserver' in window)) { scenes.forEach(el => seen.add(el)); return; }
      observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) play(entry.target); }), { threshold: 0.08 });
      scenes.forEach(el => { if (!seen.has(el)) observer.observe(el); });
    }
    function preferenceChanged() {
      if (reduced.matches) { finishAll(); scenes.forEach(el => seen.add(el)); observer?.disconnect(); }
    }
    function restored(event) { if (event.persisted || scrollY > 0) { finishAll(); scenes.forEach(el => seen.add(el)); observer?.disconnect(); } }
    // 뒤로가기/스크롤 복원에서는 읽던 콘텐츠를 다시 흐리게 만들지 않는다.
    if (scrollY > 0 || reduced.matches || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') scenes.forEach(el => seen.add(el));
    observe();
    reduced.addEventListener('change', preferenceChanged);
    addEventListener('pageshow', restored);
    return {
      replay() {
        finishAll(); observer?.disconnect(); seen.clear();
        if (disabled || reduced.matches) { scenes.forEach(el => seen.add(el)); return; }
        scenes.filter(visible).forEach(play); observe();
      },
      setDisabled(value) {
        disabled = Boolean(value); root.toggleAttribute('data-km-disabled', disabled);
        if (disabled) { finishAll(); scenes.forEach(el => seen.add(el)); observer?.disconnect(); }
      },
      destroy() { finishAll(); observer?.disconnect(); reduced.removeEventListener('change', preferenceChanged); removeEventListener('pageshow', restored); root.removeAttribute('data-km-disabled'); }
    };
  }
  return { mount };
})();
