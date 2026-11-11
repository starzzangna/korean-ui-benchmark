// 콘텐츠를 숨기지 않고 진입한 묶음만 한 번 부드럽게 정착시킨다.
export function contentReveal(elements,{distance=16,duration=780}={}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),seen=new WeakSet(),active=new Map();let observer;
 const cancel=el=>{active.get(el)?.cancel();active.delete(el);};
 function show(el){if(seen.has(el))return;seen.add(el);if(reduced.matches||el.contains(document.activeElement))return;
  const a=el.animate([{opacity:.65,translate:`0 ${distance}px`},{opacity:1,translate:'0 0'}],{duration,easing:'cubic-bezier(.22,1,.36,1)'});active.set(el,a);a.finished.catch(()=>{}).finally(()=>{if(active.get(el)===a)active.delete(el);});
 }
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){show(e.target);observer.unobserve(e.target);}},{threshold:.08,rootMargin:'0px 0px -4% 0px'});for(const el of elements)observer.observe(el);}
 function focus(event){for(const el of active.keys())if(el.contains(event.target))cancel(el);}
 function reduce(){if(reduced.matches)for(const el of active.keys())cancel(el);}
 document.addEventListener('focusin',focus);reduced.addEventListener('change',reduce);
 return()=>{observer?.disconnect();for(const el of active.keys())cancel(el);document.removeEventListener('focusin',focus);reduced.removeEventListener('change',reduce);};
}
