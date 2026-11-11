import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
import {render} from '../src/render.mjs';import {own} from '../src/editions/own.mjs';import {renderRefined} from '../src/refined/layout.mjs';
const root=path.resolve(import.meta.dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'shared/data.json')));
// 공통 기능을 그대로 생성하고 개선본의 초점 복귀 정책만 분리한다.
const common=fs.readFileSync(path.join(root,'src/app.js'),'utf8'),focusContract="document.body.style.overflow='';lastTrigger?.focus({preventScroll:true})";
assert.ok(common.includes(focusContract),'모달 닫기 계약이 변경되었습니다. 개선본의 초점 정책을 재검토하세요.');
fs.writeFileSync(path.join(root,'src/refined/app.js'),'// 개선본의 모달 닫기: 이미 다음 조작으로 옮긴 초점을 뒤늦게 가로채지 않는다.\n'+common.replace(focusContract,"document.body.style.overflow='';const active=document.activeElement;if(!active||active===document.body||active===dialog||dialog.contains(active))lastTrigger?.focus({preventScroll:true})"));
for(const [t,d]of Object.entries(data)){
 let html=render(d,t,'own'),body=own(d,t);assert.ok(html.includes(body));html=html.replace(body,renderRefined(d,t));
 html=html.replace('src="../../../src/app.js"','src="../../../src/refined/app.js"');
 html=html.replace('data-edition="editorial-2"','data-edition="refined-3"').replace('</head>','<link rel="stylesheet" href="../../../src/refined/style.css?v=refined-3"></head>').replace('<script type="module" src="../../../src/editions/motion.js"></script>','<script type="module" src="../../../src/refined/actions.js?v=refined-3"></script>');
 const dir=path.join(root,'results/refined',t);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
console.log('이전 28개를 변경하지 않고 자체 개선본 7개 생성');
