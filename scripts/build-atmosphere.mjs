import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {photo,link} from '../src/editions/parts.mjs';
const root=path.resolve(import.meta.dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'shared/data.json'))),out=path.join(root,'reports/atmosphere-4');fs.mkdirSync(out,{recursive:true});
const baseline=path.join(out,'baseline.json');
if(!fs.existsSync(baseline)){
 const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}
 for(const folder of['results/b','results/own','results/refined','src/editions','src/refined','shared','refinement'])walk(path.join(root,folder));
 fs.writeFileSync(baseline,JSON.stringify({files:files.map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')}))},null,2));
 const snapshot=path.join(root,'archive/refined-3-skill');assert.ok(!fs.existsSync(snapshot));fs.cpSync(path.join(root,'skills/korean-ui-design'),snapshot,{recursive:true});
}
function replaceSection(html,match,replacement){const start=html.indexOf(match);assert.ok(start>=0,match);const open=html.lastIndexOf('<section',start);let depth=0,end=-1;const re=/<section\b[^>]*>|<\/section>/g;re.lastIndex=open;let m;while((m=re.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(depth===0){end=re.lastIndex;break;}}assert.ok(end>open);return html.slice(0,open)+replacement+html.slice(end);}
function wrap(html,id){const match=`id="${id}"`,start=html.indexOf(match);if(start<0)return html;const open=html.lastIndexOf('<section',start);let depth=0,end;const re=/<section\b[^>]*>|<\/section>/g;re.lastIndex=open;let m;while((m=re.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(depth===0){end=re.lastIndex;break;}}assert.ok(end);return html.slice(0,open)+`<div class="s-band s-band-${id}">`+html.slice(open,end)+'</div>'+html.slice(end);}
for(const[t,d]of Object.entries(data)){
 let html=fs.readFileSync(path.join(root,'results/refined',t,'index.html'),'utf8');
 if(t!=='saas'){
  if(t==='restaurant')html=replaceSection(html,'class="o-dining-opening"',`<section class="s-dining-hero"><figure class="o-dining-photo s-dining-image">${photo(d.photo)}</figure><div class="s-dining-copy" data-scene><p class="eyebrow">${d.latin} / 아침의 식탁</p><h1>${d.headline}</h1><p class="lead">${d.intro}</p>${link('전체 메뉴 보기','#collection')}<p class="s-photo-note">과일과 곡물의 참고 상차림 사진</p></div></section>`);
  if(t==='event')html=replaceSection(html,'class="o-event-opening"',`<section class="s-event-hero"><div class="s-event-copy" data-scene><p class="eyebrow">${d.latin} / 토크 · 워크숍 · 대화</p><h1>${d.name}</h1><p class="s-event-statement">${d.headline}</p><div class="s-event-meta"><span>2027 / 03</span><strong>27—28</strong></div><p class="lead">${d.intro}</p>${link('프로그램 살펴보기','#program')}</div><figure class="s-event-art" data-scene-media><img src="../../../src/refined/assets/material.svg" alt="조각이 겹쳐 다음 장을 만드는 행사 개념 그래픽"></figure></section>`);
  for(const id of['collection','services','program','request'])html=wrap(html,id);
  html=html.replace('data-edition="refined-3"','data-edition="refined-3" data-surface="atmosphere-4"').replace('</head>','<link rel="stylesheet" href="../../../src/atmosphere/style.css?v=atmosphere-4"></head>');
 }
 const dir=path.join(root,'results/atmosphere',t);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
console.log('이전 비교본을 유지하고 배경/상단 개선본 생성. SaaS HTML은 원본 그대로 복사.');
