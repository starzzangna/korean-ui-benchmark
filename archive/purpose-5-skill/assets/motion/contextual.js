/* 필요한 블록만 연결한다. 콘텐츠·선택 결과는 모션 종료를 기다리지 않는다. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const animations=new Map();
  const cancelAll=()=>{for(const a of animations.values())a.cancel();animations.clear();};
  function animate(el,frames,options){
    if(!el)return;
    animations.get(el)?.cancel();
    animations.delete(el);
    if(reduced.matches||!el.animate)return;
    try{const a=el.animate(frames,{easing:'cubic-bezier(.32,0,.2,1)',...options});animations.set(el,a);a.finished.then(()=>{if(animations.get(el)===a)animations.delete(el);},()=>{});}catch(_){/* 실패해도 원래 표시 상태를 유지한다. */}
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)cancelAll();updateMotionState();});
  function updateMotionState(){const e=document.querySelector('#motion-state');if(e)e.textContent=reduced.matches?'모션 감소 · 내용과 선택은 즉시 표시':'일반 모션 · 재생 버튼으로 장면을 확인하세요';}
  const replay=document.querySelector('#replay');
  if(replay){replay.disabled=false;replay.addEventListener('click',()=>{
    cancelAll();
    animate(document.querySelector('[data-story=input]'),[{transform:'translateY(10px)',opacity:.35},{transform:'translateY(0)',opacity:1}],{duration:460});
    animate(document.querySelector('[data-story=result]'),[{transform:'translateY(14px)',opacity:.35},{transform:'translateY(0)',opacity:1}],{duration:620,delay:80,fill:'backwards'});
  });}
  const courses={basic:{name:'핸드드립 기초',price:35000},beans:{name:'원두 비교',price:45000},home:{name:'집에서 내리는 커피',price:55000}};
  const course=document.querySelector('#course'),people=document.querySelector('#people'),total=document.querySelector('#total');
  const choices=[...document.querySelectorAll('[data-course]')];
  if(course&&people&&total){
    function selectCourse(){
      const item=courses[course.value];if(!item)return;
      choices.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.course===course.value)));
      total.textContent=(item.price*Number(people.value)).toLocaleString('ko-KR')+'원';
      document.querySelector('#selection-status').textContent=item.name+' · '+people.value+'명 선택';
      animate(total,[{backgroundColor:'#efd1b9'},{backgroundColor:'transparent'}],{duration:380});
    }
    course.disabled=false;people.disabled=false;
    choices.forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{course.value=b.dataset.course;selectCourse();});});
    course.addEventListener('change',selectCourse);people.addEventListener('change',selectCourse);
  }
  const press=document.querySelector('#press-demo');let count=0;
  if(press){press.disabled=false;press.addEventListener('click',()=>{document.querySelector('#press-status').textContent=++count+'회 확인했습니다. 실제 전송은 없습니다.';});}
  updateMotionState();
  addEventListener('pagehide',cancelAll);
})();
