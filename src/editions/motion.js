// 대표 장면에만 짧은 진입을 적용한다. 콘텐츠는 자바스크립트 없이도 보인다.
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
const running=new Set();
if(!reduced.matches){
 for(const el of document.querySelectorAll('[data-scene]')){
  const animation=el.animate([{opacity:.7,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],{duration:760,easing:'cubic-bezier(.22,1,.36,1)'});
  running.add(animation);animation.finished.then(()=>running.delete(animation)).catch(()=>running.delete(animation));
 }
}
reduced.addEventListener('change',e=>{if(e.matches){for(const animation of running)animation.cancel();running.clear();}});
