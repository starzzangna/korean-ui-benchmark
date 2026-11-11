// 현재 폭·글자 크기·펼침 상태에서 세 결과에 필요한 공간을 실측한다.
export function installStableResult({panel,items,examples,drawArtifact,labelFor,scaleArtifact}){
 let pending=0,lastWidth=0,anchor=null;
 const baseFont=parseFloat(getComputedStyle(panel.querySelector('#sample-after')).fontSize);
 const scale=()=>parseFloat(getComputedStyle(panel.querySelector('#sample-after')).fontSize)/baseFont;
 const selectors=['.r-sample-heading','#result-format-label','#sample-after','#service-outputs'];
 function schedule(){cancelAnimationFrame(pending);pending=requestAnimationFrame(measure);}
 function measure(){
  const width=panel.getBoundingClientRect().width;if(!width)return;const probes=[];
  try{
   for(const item of items){const clone=panel.cloneNode(true);clone.inert=true;clone.style.cssText+=`;position:fixed;left:-10000px;top:0;width:${width}px;min-height:0;visibility:hidden;pointer-events:none;`;for(const s of selectors)clone.querySelector(s).style.minHeight='0';clone.querySelector('#service-title').textContent=item.title;clone.querySelector('#result-format-label').textContent=labelFor(item.id);clone.querySelector('#service-desc').textContent=item.description;clone.querySelector('#sample-before').textContent=examples[item.id].before;clone.querySelector('#service-outputs').replaceChildren(...item.outputs.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));drawArtifact(clone.querySelector('#sample-after'),item.id,examples[item.id]);document.body.append(clone);probes.push(clone);}
   probes.forEach(p=>scaleArtifact(p.querySelector('#sample-after'),scale()));
   const maxima=selectors.map(s=>Math.ceil(Math.max(...probes.map(p=>p.querySelector(s).getBoundingClientRect().height))));
   probes.forEach(p=>selectors.forEach((s,i)=>p.querySelector(s).style.minHeight=maxima[i]+'px'));
   const maxPanel=Math.ceil(Math.max(...probes.map(p=>p.getBoundingClientRect().height)));
   selectors.forEach((s,i)=>panel.querySelector(s).style.minHeight=maxima[i]+'px');panel.style.minHeight=maxPanel+'px';
   if(anchor!==null){const delta=panel.querySelector('#sample-after').getBoundingClientRect().top-anchor;if(Math.abs(delta)>1)window.scrollBy({top:delta,behavior:'instant'});anchor=null;}
  }finally{probes.forEach(p=>p.remove());panel.dataset.reservationReady='true';panel.dataset.reservationVersion=String(Number(panel.dataset.reservationVersion||0)+1);}
 }
 function capture(){const r=panel.querySelector('#sample-after').getBoundingClientRect();anchor=r.top<innerHeight&&r.bottom>0?r.top:null;}
 document.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',capture,true));document.querySelector('#choice').addEventListener('change',capture,true);
 const resize=new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-lastWidth)>.5){lastWidth=width;schedule();}});resize.observe(panel);
 const fontPart=s=>(s||'').match(/(?:font-size|line-height)\s*:[^;]+/g)?.join(';')||'';
 const mutations=new MutationObserver(records=>{if(records.some(r=>fontPart(r.oldValue)!==fontPart(r.target.getAttribute('style'))))schedule();});mutations.observe(panel,{attributes:true,subtree:true,attributeFilter:['style'],attributeOldValue:true});
 panel.querySelector('details').addEventListener('toggle',schedule);document.fonts.ready.then(schedule);schedule();
 return{schedule,scale,cleanup(){cancelAnimationFrame(pending);resize.disconnect();mutations.disconnect();}};
}
