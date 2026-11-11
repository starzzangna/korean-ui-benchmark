// 일률적인 상단 등장을 멈추고 주인공 자료 묶음만 움직인다.
const reduce=matchMedia('(prefers-reduced-motion: reduce)');let running=[];
function cancel(){running.forEach(a=>a.cancel());running=[];}
requestAnimationFrame(()=>requestAnimationFrame(()=>{
 const targets=[...document.querySelectorAll('[data-scene],[data-scene-media]')];targets.forEach(e=>e.getAnimations().forEach(a=>a.cancel()));
 if(reduce.matches)return;const category=document.body.dataset.category;
 const selector={brand:'.r-brand-opening figure',local:'.o-local-image',restaurant:'.s-dining-copy',portfolio:'.o-feature-work',professional:'.r-service-sample',event:'.s-event-art'}[category];const e=document.querySelector(selector);if(!e)return;
 running.push(e.animate([{opacity:.4,translate:'0 10px'},{opacity:1,translate:'0 0'}],{duration:760,easing:'cubic-bezier(.22,1,.36,1)'}));
}));reduce.addEventListener('change',()=>{if(reduce.matches)cancel();});
