import {sampleCopy} from './layout.mjs';
const $=s=>document.querySelector(s),category=document.body.dataset.category,reduced=matchMedia('(prefers-reduced-motion:reduce)'),running=new Map();
// 실제 값과 선택은 동기 갱신한다. 아래 효과는 완료를 기다릴 필요가 없는 표현이다.
function animate(el,frames,options={}){if(!el||reduced.matches)return;running.get(el)?.cancel();const a=el.animate(frames,{duration:360,easing:'cubic-bezier(.22,1,.36,1)',...options});running.set(el,a);a.finished.catch(()=>{}).finally(()=>{if(running.get(el)===a)running.delete(el);});}
function emphasize(el){animate(el,[{opacity:.65},{opacity:1}],{duration:300});}
function go(el){if(!el)return;el.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});const focus=el.matches('button,input,select,textarea')?el:el.querySelector('button,input,select,textarea');focus?.focus({preventScroll:true});}
function syncFilters(){const value=$('#filter')?.value;document.querySelectorAll('[data-index-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.indexFilter===value)));}
document.querySelectorAll('[data-index-filter]').forEach(button=>button.addEventListener('click',()=>{
 const filter=$('#filter');filter.value=button.dataset.indexFilter;filter.dispatchEvent(new Event('change',{bubbles:true}));syncFilters();
 const target=document.querySelector('[data-item]:not([hidden])');go(target);emphasize(target?.querySelector('.image-button'));
}));
$('#filter')?.addEventListener('change',syncFilters);$('#reset-filter')?.addEventListener('click',()=>queueMicrotask(syncFilters));syncFilters();
if(category==='professional'){
 const choice=$('#choice');
 function sample(motion=true){const s=sampleCopy[choice.value];if(!s)return;$('#sample-heading').textContent=s.label;$('#sample-before').textContent=s.before;$('#sample-after').textContent=s.after;document.querySelectorAll('[data-index-service]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.indexService===choice.value)));if(motion)animate($('.r-sample-after'),[{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:400});}
 document.querySelectorAll('[data-index-service]').forEach(button=>button.addEventListener('click',()=>{choice.value=button.dataset.indexService;choice.dispatchEvent(new Event('change',{bubbles:true}));}));
 document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>sample()));choice.addEventListener('change',()=>sample());sample(false);
}
if(category==='local')document.querySelectorAll('[data-choose]').forEach(button=>button.addEventListener('click',()=>{go($('#request'));emphasize($('#total'));}));
if(category==='local'||category==='event')for(const id of ['choice','people'])$('#'+id)?.addEventListener('change',()=>emphasize($('#total')));
if(category==='event')document.querySelectorAll('[data-day]').forEach(button=>button.addEventListener('click',()=>animate($('#schedule-list'),[{opacity:.7,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:340})));
if(category==='saas'){
 const counts=[...document.querySelectorAll('.state-overview [data-state-count]')],previous=new Map(counts.map(e=>[e,e.textContent]));
 new MutationObserver(()=>{for(const count of counts){if(previous.get(count)!==count.textContent){previous.set(count,count.textContent);animate(count.parentElement,[{opacity:.65,transform:'scale(1.04)'},{opacity:1,transform:'none'}],{duration:280});}}}).observe($('.state-overview'),{subtree:true,childList:true,characterData:true});
}
if(category==='portfolio'){
 document.addEventListener('load',event=>{if(event.target.id==='work-image')animate(event.target,[{opacity:.7},{opacity:1}],{duration:300});},true);
 $('#detail-dialog').addEventListener('close',()=>emphasize(document.activeElement.closest?.('.image-button')));
}
const media=document.querySelector('[data-scene-media]')||document.querySelector('.o-local-image,.o-dining-photo');
for(const el of document.querySelectorAll('[data-scene]'))animate(el,[{opacity:.8,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:700});
animate(media,[{opacity:.85,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:780,delay:70});
const representative=document.querySelector('.r-product-featured .image-button,.r-work-featured .image-button');let observer;
if(representative&&!reduced.matches){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){animate(entry.target,[{opacity:.8,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:620});observer.unobserve(entry.target);}},{threshold:.15});observer.observe(representative);}
reduced.addEventListener('change',event=>{if(event.matches){for(const a of running.values())a.cancel();running.clear();observer?.disconnect();}});
