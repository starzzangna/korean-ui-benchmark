/* 내용은 기본 HTML에 항상 표시한다. */
(() => {
  // 내용·선택·초점은 즉시 반영하고 장식 모션만 취소 가능하게 둔다.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),active=new Set();
  function animate(el,frames,options){
    if(!el||reduced.matches||!el.animate)return;
    for(const a of [...active])if(a.effect?.target===el){a.cancel();active.delete(a);}
    try{const a=el.animate(frames,{easing:'cubic-bezier(.32,0,.2,1)',...options});active.add(a);a.finished.then(()=>active.delete(a),()=>active.delete(a));}catch(_){/* 기본 표시를 유지한다. */}
  }
  function cancel(){for(const a of active)a.cancel();active.clear();}
  reduced.addEventListener('change',()=>{if(reduced.matches)cancel();});
  const scene=document.querySelector('.product-scene');
  document.querySelectorAll('[data-crop][aria-pressed]').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{scene.dataset.crop=b.dataset.crop;document.querySelectorAll('[data-crop][aria-pressed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('#crop-status').textContent=b.dataset.crop==='close'?'가까운 크롭 · 컵과 손잡이에 집중':'넓은 장면 · 주변 맥락을 함께 확인';});});
  const stage=document.querySelector('.work-stage');
  document.querySelectorAll('[data-layout][aria-pressed]').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{stage.dataset.layout=b.dataset.layout;document.querySelectorAll('[data-layout][aria-pressed]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));animate(stage.querySelector('.scene-enter'),[{transform:'translateY(8px)',opacity:.7},{transform:'none',opacity:1}],{duration:360});});});
  const courses={basic:{name:'핸드드립 기초',price:35000},beans:{name:'원두 비교',price:45000},home:{name:'집에서 내리는 커피',price:55000}};
  const course=document.querySelector('#course'),people=document.querySelector('#people'),total=document.querySelector('#total');
  function update(){const item=courses[course.value];document.querySelectorAll('[data-course]').forEach(b=>{const chosen=b.dataset.course===course.value;b.setAttribute('aria-pressed',String(chosen));b.querySelector('.course-marker').textContent=chosen?'✓':'↗';});total.textContent=(item.price*Number(people.value)).toLocaleString('ko-KR')+'원';document.querySelector('#selection-status').textContent=item.name+' · '+people.value+'명';animate(total,[{backgroundColor:'#e9c7b6'},{backgroundColor:'transparent'}],{duration:380});}
  course.disabled=people.disabled=false;course.addEventListener('change',update);people.addEventListener('change',update);
  document.querySelectorAll('[data-course]').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{course.value=b.dataset.course;update();});});
  const replay=document.querySelector('#replay');replay.disabled=false;replay.addEventListener('click',()=>{cancel();animate(document.querySelector('[data-story=input]'),[{transform:'translateY(8px)',opacity:.5},{transform:'none',opacity:1}],{duration:420});animate(document.querySelector('[data-story=result]'),[{transform:'translateY(12px)',opacity:.5},{transform:'none',opacity:1}],{duration:620,delay:70,fill:'backwards'});});
  const dialog=document.querySelector('#viewer'),image=document.querySelector('#viewer-image');let opener;
  const missing=new Set(),assetError=document.querySelector('#asset-error'),viewerError=document.querySelector('#viewer-error');
  function errorState(){assetError.hidden=missing.size===0;viewerError.hidden=!missing.has(image);}
  function retry(img){const src=img.getAttribute('src');if(src){img.removeAttribute('src');img.setAttribute('src',src);}}
  document.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>{missing.add(img);errorState();});img.addEventListener('load',()=>{missing.delete(img);errorState();});if(img.hasAttribute('src')&&img.complete&&!img.naturalWidth)missing.add(img);});errorState();
  document.querySelector('#retry-assets').addEventListener('click',()=>{for(const img of missing)retry(img);});
  document.querySelector('#retry-viewer').addEventListener('click',()=>retry(image));
  document.querySelectorAll('[data-image]').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{opener=b;image.src=b.dataset.image;image.alt=b.dataset.title;document.querySelector('#viewer-title').textContent=b.dataset.title;dialog.showModal();document.querySelector('#close').focus();animate(dialog,[{transform:'translateY(8px)',opacity:.6},{transform:'none',opacity:1}],{duration:200});});});
  document.querySelector('#close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{for(const a of [...active])if(a.effect?.target===dialog){a.cancel();active.delete(a);}opener?.focus();});
  dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const buttons=[...dialog.querySelectorAll('button')].filter(b=>b.checkVisibility()&&!b.disabled),first=buttons[0],last=buttons.at(-1);if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();(e.shiftKey?last:first).focus();}});
  addEventListener('pagehide',cancel);
})();
