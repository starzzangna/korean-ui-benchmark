import {setTextScale,measureVisualBounds} from '../../scripts/layout-probes.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Set(),owned=new WeakMap();
// 데이터는 즉시 갱신하고 결과의 짧은 장식만 취소·재시작한다.
function emphasize(element){
  const before=getComputedStyle(element).transform;
  owned.get(element)?.cancel();
  if(reduced.matches)return;
  const animation=element.animate([{transform:before==='none'?'translateY(4px)':before,opacity:.65},{transform:'none',opacity:1}],{duration:300,easing:'cubic-bezier(.16,1,.3,1)'});
  owned.set(element,animation);active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));
}
reduced.addEventListener('change',()=>{if(reduced.matches){for(const animation of active)animation.cancel();active.clear();}});
const detail=document.querySelector('#detail'),image=document.querySelector('#detail-image'),status=document.querySelector('#detail-status'),retry=document.querySelector('#retry');let opener,source;
const works={cup:{title:'찻잔을 사용하는 장면',src:'../compositions/media/cup.jpg',description:'사용 장면 참고 사진입니다. 실제 판매 제품의 색·크기·재질을 증명하지 않습니다. 목록과 같은 원본을 확인합니다.'},interface:{title:'읽는 순서를 정리한 화면',src:'../compositions/media/interface.svg',description:'자체 개념 작업입니다. 목표는 검색과 목록, 업무 상태의 읽는 순서를 구별하는 것입니다. 원본에서 제목·검색·상태의 관계를 관찰합니다. 실제 고객 작업이 아닙니다.'},editorial:{title:'문장 사이의 여백',src:'../compositions/media/editorial.svg',description:'자체 개념 작업입니다. 목표는 제목과 본문의 다른 호흡을 지면의 크기와 여백으로 표현하는 것입니다. 목록에서 반복하지 않은 관찰 정보를 이 상세에서 읽습니다. 실제 고객 작업이 아닙니다.'}};
function load(){status.textContent='원본을 불러오는 중입니다.';retry.hidden=true;image.src=source;}
image.addEventListener('load',()=>{status.textContent='목록과 같은 자료 원본입니다.';});
image.addEventListener('error',()=>{status.textContent='이미지를 불러오지 못했습니다. 설명을 읽거나 다시 시도할 수 있습니다.';retry.hidden=false;});retry.addEventListener('click',load);
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{const work=works[button.dataset.open];opener=button;source=work.src;document.querySelector('#detail-title').textContent=work.title;document.querySelector('#detail-description').textContent=work.description;image.alt=work.title;load();detail.showModal();document.querySelector('#close').focus();emphasize(detail);}));
document.querySelector('#close').addEventListener('click',()=>detail.close());detail.addEventListener('close',()=>opener?.focus());
let saved=false;document.querySelector('#save').addEventListener('click',e=>{saved=!saved;e.currentTarget.textContent=saved?'관심 목록에서 빼기':'이 장면 관심 목록에 담기';const result=document.querySelector('#saved');result.textContent=`관심 장면 ${saved?1:0}개 · 새로고침하면 사라집니다.`;emphasize(result);});
const courses={basic:'핸드드립 기초 · 35,000원 / 1명',beans:'원두 비교 · 45,000원 / 1명'};
document.querySelectorAll('[data-course]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-course]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const result=document.querySelector('#course-result');result.textContent=courses[button.dataset.course];emphasize(result);}));
function size(){const widths=[...document.querySelectorAll('.work-image')].map(e=>Math.round(e.getBoundingClientRect().width));document.querySelector('#work-size').textContent=`현재 작품 프레임 ${widths.join(' / ')}px · 이 수치는 품질 점수가 아닙니다.`;}
document.querySelectorAll('[data-columns]').forEach(button=>{if(button.tagName!=='BUTTON')return;button.addEventListener('click',()=>{document.querySelector('.work-grid').dataset.columns=button.dataset.columns;document.querySelectorAll('button[data-columns]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));size();});});
document.querySelectorAll('[data-scale]').forEach(button=>button.addEventListener('click',()=>{setTextScale({factor:button.dataset.scale==='1'?1:2,lineHeight:button.dataset.scale==='both'});size();}));
document.querySelector('#inspect').addEventListener('click',()=>{const rows=measureVisualBounds([{selector:'.event-icon',boundary:'viewport',axis:'x',tolerance:1}]);document.querySelector('#inspection').textContent=rows.every(r=>r.passed===true)?'현재 상태에서 지정 표식의 가로 범위가 화면 안입니다. 다른 상태·실제 메뉴 확대는 별도 확인합니다.':'지정 표식의 범위 또는 수동 검토 항목을 확인하세요.';});
window.addEventListener('resize',size);size();
