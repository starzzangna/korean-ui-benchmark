import {measureGroups,setTextScale,measureTextBounds} from '../../scripts/layout-probes.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Set();
const owned=new WeakMap();
function emphasize(element,kind='state'){
  owned.get(element)?.cancel();
  if(reduced.matches)return;
  const frames=kind==='detail'?[{opacity:.72,transform:'translateY(6px)'},{opacity:1,transform:'none'}]:kind==='result'?[{opacity:.6,transform:'translateY(3px)'},{opacity:1,transform:'none'}]:[{opacity:.5},{opacity:1}];
  const animation=element.animate(frames,{duration:kind==='detail'?220:kind==='result'?260:150,easing:'cubic-bezier(.16,1,.3,1)'});
  owned.set(element,animation);active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
}
reduced.addEventListener('change',()=>{if(reduced.matches){for(const a of active)a.cancel();active.clear();}});
let complete=false;
document.querySelector('#task-toggle').addEventListener('click',e=>{complete=!complete;const state=document.querySelector('#task-state');state.textContent=complete?'완료':'진행 중';e.currentTarget.textContent=complete?'진행 중으로 변경':'완료로 변경';emphasize(state);});
const courses={basic:'핸드드립 기초 · 35,000원 / 1명',beans:'원두 비교 · 45,000원 / 1명'};
document.querySelectorAll('[data-course]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const summary=document.querySelector('#course-summary');summary.textContent=courses[button.dataset.course];emphasize(summary,'result');}));
document.querySelectorAll('[data-menu]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-menu]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const items=[...document.querySelectorAll('[data-kind]')];items.forEach(item=>item.hidden=button.dataset.menu!=='all'&&item.dataset.kind!==button.dataset.menu);const count=document.querySelector('#menu-count');count.textContent='메뉴 '+items.filter(e=>!e.hidden).length+'개';emphasize(count); }));
const results={plan:['사용자의 첫 행동을 먼저 정합니다.','핵심 과업 한 가지와 이번 범위를 연결합니다.'],ux:['막히는 입력과 다음 행동을 분리합니다.','오류 위치와 복구 경로를 같은 화면에서 확인합니다.']};
document.querySelectorAll('[data-service]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-service]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const [title,copy]=results[button.dataset.service];document.querySelector('#result-title').textContent=title;const target=document.querySelector('#result-copy');target.textContent=copy;emphasize(target,'result');}));
const detail=document.querySelector('#detail');let opener;
const assets={product:{title:'컵과 손 · 참고 사진',src:'../compositions/media/cup.jpg',copy:'사용 장면을 보여주는 참고 사진입니다. 실제 판매 제품의 소재·크기를 증명하지 않습니다.'},work:{title:'읽는 사이 · 개념 편집물',src:'../compositions/media/editorial.svg',copy:'작업의 의도: 글과 여백의 읽는 호흡. 관찰할 세부: 펼친 지면의 본문 폭과 글줄 간격. 실제 고객 작업이 아닌 개념 SVG입니다.'}};
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const asset=assets[button.dataset.open];opener=button;document.querySelector('#detail-title').textContent=asset.title;const img=document.querySelector('#detail-image');img.src=asset.src;img.alt=asset.title;document.querySelector('#detail-copy').textContent=asset.copy;detail.showModal();emphasize(detail.querySelector('.detail-body'),'detail');}));
document.querySelector('#close-detail').addEventListener('click',()=>detail.close());
detail.addEventListener('close',()=>{detail.querySelectorAll('*').forEach(e=>owned.get(e)?.cancel());if(opener?.isConnected)opener.focus({preventScroll:true});});
document.querySelector('#scale').addEventListener('change',e=>{const mode=e.target.value;setTextScale({factor:mode==='1'?1:2,lineHeight:mode==='both',root:'#examples'});const bounds=measureTextBounds();document.querySelector('#scale-note').textContent='예제 영역 '+(mode==='1'?'기본':mode==='font'?'글자만 2배':'글자와 행간 2배')+' · 문서 너비 '+bounds.scrollWidth+'/'+bounds.width+'px · 내부 후보 '+bounds.candidates.length+'개. 실제 화면 검토와 브라우저 메뉴 확대는 별도입니다.';});
document.querySelector('#inspect').addEventListener('click',()=>{const [r]=measureGroups([{anchor:'#notice-anchor',group:'#notice-group',icon:'#notice-icon',text:'#notice-text',placement:innerWidth<768?'start':'center',vertical:'first-line',tolerance:2}]);document.querySelector('#alignment-result').textContent=r.measured?'그룹 가로 차이 '+r.horizontalDelta.toFixed(1)+'px · 첫 줄/아이콘 차이 '+r.verticalDelta.toFixed(1)+'px · 상자/글리프 후보이며 광학적 정렬 인증이 아닙니다.':'미측정: '+r.reason;});

document.querySelectorAll('button[disabled],select[disabled]').forEach(e=>e.disabled=false);
