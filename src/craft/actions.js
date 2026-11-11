import {examples,labelFor,drawArtifact,scaleArtifact} from './result-artifact.js';import {installStableResult} from './stability.js';
const sampleCopy=examples;let resultStability=null;
const $=s=>document.querySelector(s),category=document.body.dataset.category,reduced=matchMedia('(prefers-reduced-motion:reduce)'),running=new Map();
// 실제 값과 선택은 동기 갱신한다. 아래 효과는 완료를 기다릴 필요가 없는 표현이다.
function animate(el,frames,options={}){if(!el||reduced.matches)return;if(el.hasAttribute('data-content-reveal'))el.getAnimations().forEach(a=>a.cancel());for(let parent=el.parentElement;parent;parent=parent.parentElement)if(parent.hasAttribute('data-content-reveal'))parent.getAnimations().forEach(a=>a.cancel());running.get(el)?.cancel();const a=el.animate(frames,{duration:360,easing:'cubic-bezier(.22,1,.36,1)',...options});running.set(el,a);a.finished.catch(()=>{}).finally(()=>{if(running.get(el)===a)running.delete(el);});}
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
 function sample(motion=true){const s=sampleCopy[choice.value];if(!s)return;$('#sample-before').textContent=s.before;renderServiceResult(choice.value,s);document.querySelectorAll('[data-index-service]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.indexService===choice.value)));if(motion)resultFeedback(choice.value);}
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
reduced.addEventListener('change',event=>{if(event.matches){for(const a of running.values())a.cancel();running.clear();}});
// 미리 보기의 관심을 같은 날짜·실제 세션으로 연결한다.
if(category==='event'){const data=JSON.parse($('#site-data').textContent);document.querySelectorAll('[data-session-target]').forEach(button=>button.addEventListener('click',()=>{const item=data.items.find(w=>w.id===button.dataset.sessionTarget);if(!item)return;document.querySelector('[data-day="'+item.day+'"]').click();const index=data.items.filter(w=>w.day===item.day).findIndex(w=>w.id===item.id),target=$('#schedule-list').children[index];if(!target)return;target.open=true;window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY,behavior:reduced.matches?'instant':'smooth'});target.querySelector('summary').focus({preventScroll:true});}));}

// 결과의 실제 형태를 보여주되 모든 예시는 설명용으로 표시한다.
function renderServiceResult(id,s){const root=$('#sample-after');drawArtifact(root,id,s);scaleArtifact(root,resultStability?.scale()||1);root.parentElement.dataset.resultKind=id;$('#result-format-label').textContent=labelFor(id);resultStability?.schedule();}
function resultFeedback(id){const options={s1:{duration:240,frames:[{opacity:.65},{opacity:1}]},s2:{duration:320,frames:[{opacity:.75,translate:'6px 0'},{opacity:1,translate:'0 0'}]},s3:{duration:300,frames:[{opacity:.75,translate:'0 4px'},{opacity:1,translate:'0 0'}]}}[id];animate($('.r-sample-after'),options.frames,{duration:options.duration});}

if(category==='professional'){resultStability=installStableResult({panel:$('.e-service-evidence'),items:JSON.parse($('#site-data').textContent).items,examples,drawArtifact,labelFor,scaleArtifact});window.addEventListener('pagehide',()=>resultStability.cleanup(),{once:true});}
