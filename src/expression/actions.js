const sampleCopy={
s1:{label:'브랜드 진단',before:'좋은 물건을 만드는 브랜드라고 소개하고 싶어요.',after:'매일 기록하는 사람을 위해, 손에 익는 종이 도구를 만듭니다.'},
s2:{label:'웹 서비스 기획',before:'문의 화면에서 다음에 무엇을 해야 하는지 모르겠어요.',after:'서비스 고르기 → 준비 자료 확인 → 연락처 입력 → 문의 내용 확인'},
s3:{label:'콘텐츠 정리',before:'페이지마다 자료의 순서와 말투가 달라요.',after:'필요한 자료를 함께 정리하고, 다음 작업의 범위와 순서를 정합니다.'}
};
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
function renderServiceResult(id,s){const root=$('#sample-after');root.replaceChildren();root.parentElement.dataset.resultKind=id;$('#result-format-label').textContent={s1:'메시지 초안 · 가상 예시',s2:'화면 흐름 · 가상 예시',s3:'콘텐츠 구조 · 가상 예시'}[id];if(id==='s2'){const ol=document.createElement('ol');ol.className='x-result-flow';for(const[t,i]of ['서비스 고르기','준비 자료 확인','연락처 입력','문의 내용 확인'].map((t,i)=>[t,i])){const li=document.createElement('li'),number=document.createElement('small'),text=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');text.textContent=t;li.append(number,text);ol.append(li);}root.append(ol);}else if(id==='s3'){const dl=document.createElement('dl');dl.className='x-result-structure';for(const[label,text]of [['먼저','서비스 소개'],['이어서','제공 범위'],['마지막','문의 안내']]){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=text;row.append(dt,dd);dl.append(row);}root.append(dl);}else{const p=document.createElement('p');p.className='x-result-message';p.textContent=s.after;root.append(p);}}
function resultFeedback(id){const options={s1:{duration:240,frames:[{opacity:.65},{opacity:1}]},s2:{duration:320,frames:[{opacity:.75,translate:'6px 0'},{opacity:1,translate:'0 0'}]},s3:{duration:300,frames:[{opacity:.75,translate:'0 4px'},{opacity:1,translate:'0 0'}]}}[id];animate($('.r-sample-after'),options.frames,{duration:options.duration});}
