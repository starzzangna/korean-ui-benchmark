const topics={saas:'SaaS',brand:'브랜드',local:'로컬 서비스',restaurant:'식당',portfolio:'포트폴리오',professional:'전문 서비스',event:'행사'},$=s=>document.querySelector(s);
let topic=topics[location.hash.slice(1)]?location.hash.slice(1):'event',generation=0,pending=0;
const expected=new WeakMap();
for(const[id,label]of Object.entries(topics)){const button=document.createElement('button');button.textContent=label;button.dataset.topic=id;button.onclick=()=>{topic=id;history.pushState(null,'','#'+id);render();};$('#categories').append(button);}
const frames=()=>[...document.querySelectorAll('iframe')];
function resize(){const width=Number($('#viewport').value);for(const frame of frames()){const shell=frame.parentElement,scale=Math.min(1,shell.clientWidth/width);frame.style.width=width+'px';frame.style.height='1000px';frame.style.transform=`scale(${scale})`;shell.style.height=scale*1000+'px';}}
function maximum(frame){return Math.max(0,frame.contentDocument.documentElement.scrollHeight-frame.contentWindow.innerHeight);}
function moveFrame(frame,y){const target=Math.max(0,Math.min(y,maximum(frame)));expected.set(frame,target);frame.contentWindow.scrollTo({top:target,behavior:'instant'});}
function attach(frame,token){frame.contentWindow.addEventListener('scroll',()=>{
 if(token!==generation||!$('#sync').checked)return;
 const y=frame.contentWindow.scrollY,desired=expected.get(frame);expected.delete(frame);
 if(desired!==undefined&&Math.abs(y-desired)<2)return;
 cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{if(token!==generation)return;const max=maximum(frame),progress=max?y/max:0;for(const other of frames())if(other!==frame)moveFrame(other,progress*maximum(other));});
},{passive:true});}
function render(){const token=++generation;cancelAnimationFrame(pending);$('#comparison').replaceChildren();$('#move').disabled=true;$('#load-state').textContent='화면을 준비합니다.';let loaded=0;const mode=$('#mode').value,selected=mode==='three'?['b','relevance','expression']:mode==='before'?['relevance','expression']:['b','expression'];document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));
 for(const group of selected){const label={b:'B',relevance:'직전 개선본',expression:'새 개선본'}[group],pane=document.createElement('section');pane.className='compare-pane';const heading=document.createElement('div');heading.className='pane-heading';const h=document.createElement('h2');h.textContent=label;const a=document.createElement('a'),url=`../results/${group}/${topic}/index.html?v=expression-10`;a.href=url;a.target='_blank';a.rel='noopener';a.textContent='원래 크기';heading.append(h,a);const shell=document.createElement('div');shell.className='frame-shell';const frame=document.createElement('iframe');frame.title=label+' · '+topics[topic];frame.dataset.group=group;frame.onload=()=>{if(token!==generation)return;try{if(!frame.contentDocument.querySelector('main'))throw Error();attach(frame,token);if(++loaded===selected.length){$('#load-state').textContent=loaded+'개 화면 준비 완료';$('#move').disabled=false;}}catch{$('#load-state').textContent='화면을 불러오지 못했습니다. 초기 상태로 다시 시도해 주세요.';}};frame.src=url;shell.append(frame);pane.append(heading,shell);$('#comparison').append(pane);
 }resize();}
$('#move').onclick=()=>{
 cancelAnimationFrame(pending);const part=$('#part').value;
 for(const frame of frames()){const win=frame.contentWindow,doc=frame.contentDocument,el=doc.querySelector('#collection,#services,#program,#task-list');const y=part==='top'?0:part==='bottom'?maximum(frame):el?el.getBoundingClientRect().top+win.scrollY:0;moveFrame(frame,y);}
 $('#position-state').textContent={top:'모든 화면을 첫 화면으로 이동했습니다.',middle:'모든 화면을 주요 목록으로 이동했습니다.',bottom:'모든 화면을 하단으로 이동했습니다.'}[part];
};
$('#sync').onchange=()=>{$('#position-state').textContent=$('#sync').checked?'동시 스크롤이 켜졌습니다. 한 화면을 스크롤하면 다른 화면도 따라갑니다.':'동시 스크롤이 꺼졌습니다. 각 화면을 따로 볼 수 있습니다.';};
$('#mode').onchange=render;$('#viewport').onchange=resize;$('#reload').onclick=render;
function restore(){const id=location.hash.slice(1);if(topics[id]&&id!==topic){topic=id;render();}}window.addEventListener('popstate',restore);window.addEventListener('hashchange',restore);new ResizeObserver(resize).observe($('#comparison'));render();
