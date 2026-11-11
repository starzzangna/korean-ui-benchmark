// 내용은 기본 상태에서 보인다. 단회 등장만 더하고 입력·가격·목록 갱신은 움직이지 않는다.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const active = new Set();
const seen = new WeakSet();
const targets = document.querySelectorAll('.hero-copy > .eyebrow, .hero-copy > h1, .hero-copy > .hero-description, .section-heading > div, .section-heading > p, .request-intro > h2, .request-intro > p, .process > h2');
if ('IntersectionObserver' in window && Element.prototype.animate) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const target = entry.target;
      observer.unobserve(target);
      if (seen.has(target)) continue;
      seen.add(target);
      if (reduced.matches || target.matches(':focus-within')) continue;
      const siblings = [...target.parentElement.children].filter(el => el.matches('.eyebrow, h1, .hero-description'));
      const delay = Math.max(0, siblings.indexOf(target)) * 55;
      const animation = target.animate([
        { opacity: 0.65, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 620, delay, easing: 'cubic-bezier(.22,.61,.36,1)' });
      active.add(animation);
      animation.finished.catch(() => {}).finally(() => active.delete(animation));
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
  targets.forEach(target => observer.observe(target));
  reduced.addEventListener('change', () => {
    if (reduced.matches) for (const animation of active) animation.cancel();
  });
}
