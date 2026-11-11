// DOM 상자 측정이다. 광학적 정렬·실기기·접근성 인증을 대신하지 않는다.
export function measureGroups(rules = []) {
  const rect = e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
  return rules.map(rule => {
    const find = selector => selector ? document.querySelectorAll(selector) : [];
    const anchors=find(rule.anchor),groups=find(rule.group),icons=find(rule.icon),texts=find(rule.text);
    if([anchors,groups,icons,texts].some(a=>a.length!==1))return {rule,measured:false,reason:'대상 누락 또는 복수'};
    const [anchor,group,icon,text]=[anchors[0],groups[0],icons[0],texts[0]];
    if(!anchor.contains(group)||!group.contains(icon)||!group.contains(text))return {rule,measured:false,reason:'그룹 관계 불일치'};
    const a=rect(anchor),g=rect(group),i=rect(icon),t=rect(text),s=getComputedStyle(anchor);
    if([a,g,i,t].some(r=>!r.width||!r.height))return {rule,measured:false,reason:'보이지 않는 대상'};
    const left=a.x+parseFloat(s.borderLeftWidth)+parseFloat(s.paddingLeft);
    const right=a.x+a.width-parseFloat(s.borderRightWidth)-parseFloat(s.paddingRight);
    const placement=rule.placement||'center';
    const horizontalDelta=placement==='start'?Math.abs(g.x-left):placement==='end'?Math.abs(g.x+g.width-right):Math.abs(g.x+g.width/2-(left+right)/2);
    let textCenter=t.y+t.height/2;
    if(rule.vertical==='first-line'){
      const walker=document.createTreeWalker(text,NodeFilter.SHOW_TEXT);let n,first;
      while(n=walker.nextNode()){
        const at=n.textContent.search(/\S/);if(at<0)continue;
        const range=document.createRange();range.setStart(n,at);range.setEnd(n,at+1);
        const r=range.getBoundingClientRect();if(r.height){first=r.y+r.height/2;break;}
      }
      if(first===undefined)return {rule,measured:false,reason:'첫 줄 미측정'};
      textCenter=first;
    }
    const verticalDelta=Math.abs(i.y+i.height/2-textCenter),tolerance=rule.tolerance??1;
    return {rule,measured:true,horizontalDelta,verticalDelta,horizontalPassed:horizontalDelta<=tolerance,verticalPassed:verticalDelta<=tolerance,anchor:a,group:g,icon:i,text:t};
  });
}

// 전체 원래 값을 먼저 저장하므로 부모 변경에 의한 중복 배율을 피한다.
export function setTextScale({factor=1,lineHeight=false,root='body'}={}) {
  const target=document.querySelector(root);if(!target)throw Error('확대 대상 없음: '+root);
  const state=window.__kuiTextScaleState??={nodes:new Map()};
  for(const [node,old] of state.nodes){node.style.fontSize=old.inlineFont;node.style.lineHeight=old.inlineLine;}
  state.nodes.clear();
  if(factor===1)return {factor,root,lineHeight};
  const nodes=[target,...target.querySelectorAll('*')].filter(e=>!['SCRIPT','STYLE','SVG','PATH'].includes(e.tagName));
  for(const node of nodes){const s=getComputedStyle(node);state.nodes.set(node,{font:parseFloat(s.fontSize),line:parseFloat(s.lineHeight),inlineFont:node.style.fontSize,inlineLine:node.style.lineHeight});}
  for(const [node,old] of state.nodes){node.style.fontSize=old.font*factor+'px';if(lineHeight&&Number.isFinite(old.line))node.style.lineHeight=old.line*factor+'px';}
  return {factor,root,lineHeight,nodes:state.nodes.size};
}

export function measureTextBounds() {
  const candidates=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node,count=0;
  while((node=walker.nextNode())&&count<250){
    if(!node.textContent.trim()||['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement.tagName))continue;
    const range=document.createRange();range.selectNodeContents(node);const r=range.getBoundingClientRect();if(!r.width||!r.height)continue;count++;
    for(let p=node.parentElement;p&&p!==document.body;p=p.parentElement){
      const s=getComputedStyle(p);if(!['hidden','clip','auto','scroll'].includes(s.overflowX)&&!['hidden','clip','auto','scroll'].includes(s.overflowY))continue;
      const b=p.getBoundingClientRect();
      if(r.right>b.right+1||r.left<b.left-1||r.bottom>b.bottom+1||r.top<b.top-1){candidates.push({text:node.textContent.trim().slice(0,100),container:p.id||p.className||p.tagName});break;}
    }
  }
  return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,noOverflow:document.documentElement.scrollWidth<=innerWidth+1,candidates,scope:'최대250개 보이는 텍스트의 잘림/내부 스크롤 후보. 실제 결함 수가 아니며 select 내부/모든 상태는 별도 확인.'};
}

// 지정한 필수 표시의 상자와 실제 문자 줄 범위를 함께 검사한다.
// pseudo의 실제 그림 범위는 DOM으로 확정할 수 없어 수동 검토로 남긴다.
export function measureVisualBounds(rules = []) {
  const rows=[];
  for(const rule of rules){
    const targets=[...document.querySelectorAll(rule.selector)];
    if(!targets.length){rows.push({rule,measured:false,passed:false,reason:'대상 없음'});continue;}
    const boundaries=rule.boundary&&rule.boundary!=='viewport'?[...document.querySelectorAll(rule.boundary)]:null;
    if(boundaries&&boundaries.length!==1){rows.push({rule,measured:false,passed:false,reason:'경계 누락 또는 복수'});continue;}
    const boundary=boundaries?boundaries[0].getBoundingClientRect():{left:0,right:innerWidth,top:0,bottom:innerHeight};
    const tolerance=rule.tolerance??1,axis=rule.axis||'x';
    for(const [index,target] of targets.entries()){
      const r=target.getBoundingClientRect(),style=getComputedStyle(target);
      if(!r.width||!r.height||style.visibility==='hidden'||style.display==='none'){
        rows.push({rule,index,measured:false,passed:false,reason:'보이지 않는 대상'});continue;
      }
      const outside=rect=>rect.left<boundary.left-tolerance||rect.right>boundary.right+tolerance||(axis==='both'&&(rect.top<boundary.top-tolerance||rect.bottom>boundary.bottom+tolerance));
      const pack=rect=>({left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom});
      const issues=[],pseudo=[];
      for(const e of [target,...target.querySelectorAll('*')]){
        if(['SCRIPT','STYLE','OPTION','NOSCRIPT'].includes(e.tagName))continue;
        const s=getComputedStyle(e),box=e.getBoundingClientRect();
        if(s.display==='none'||s.visibility==='hidden'||!box.width||!box.height)continue;
        if(outside(box))issues.push({kind:'element',tag:e.tagName,id:e.id,...pack(box)});
        for(const side of ['::before','::after']){
          const p=getComputedStyle(e,side);
          if(p.content&& !['none','normal'].includes(p.content)&&p.display!=='none')pseudo.push({tag:e.tagName,id:e.id,side,content:p.content,transform:p.transform});
        }
      }
      const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);let node,count=0;
      while((node=walker.nextNode())&&count<500){
        if(!node.textContent.trim()||['SCRIPT','STYLE','OPTION','NOSCRIPT'].includes(node.parentElement.tagName))continue;
        const s=getComputedStyle(node.parentElement);if(s.visibility==='hidden'||s.display==='none')continue;
        const range=document.createRange();range.selectNodeContents(node);count++;
        for(const box of range.getClientRects())if(box.width&&box.height&&outside(box))issues.push({kind:'text',text:node.textContent.trim().slice(0,100),...pack(box)});
      }
      const truncated=count>=500;
      rows.push({rule,index,measured:true,geometryPassed:issues.length===0,passed:issues.length?false:(pseudo.length||truncated?null:true),issues,pseudoReview:pseudo,truncated,boundary:pack(boundary)});
    }
  }
  return rows;
}
