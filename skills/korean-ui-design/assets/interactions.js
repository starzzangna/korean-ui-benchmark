// 명시한 편집 장면에만 짧은 페이드. 업무·필터·폼에는 자동 적용하지 않는다.
(() => {
  const start=()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.remove('kui-reveal-pending');observer.unobserve(entry.target);}},{rootMargin:'0px 0px 30px 0px',threshold:0});
    for(const element of document.querySelectorAll('[data-kui-reveal="editorial"]')){
      if(element.getBoundingClientRect().top<innerHeight)continue;
      element.classList.add('kui-reveal-pending');observer.observe(element);
    }
    matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches){document.querySelectorAll('.kui-reveal-pending').forEach(e=>e.classList.remove('kui-reveal-pending'));observer.disconnect();}});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
