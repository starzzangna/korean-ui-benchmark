import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8'),write=(p,s)=>{fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s);};
const out='reports/purpose-5',hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
if(!fs.existsSync(path.join(root,out,'baseline.json'))){const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}for(const dir of['results','src/editions','src/refined','src/atmosphere','shared','atmosphere','refinement'])walk(path.join(root,dir));write(out+'/baseline.json',JSON.stringify({files:files.map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p)}))},null,2));fs.cpSync(path.join(root,'skills/korean-ui-design'),path.join(root,'archive/atmosphere-4-skill'),{recursive:true,errorOnExist:true});}
const data=JSON.parse(read('shared/data.json'));
let actions=read('src/refined/actions.js').replace("import {sampleCopy} from './layout.mjs';",`const sampleCopy={
s1:{label:'브랜드 진단',before:'좋은 물건을 만드는 브랜드라고 소개하고 싶어요.',after:'매일 기록하는 사람을 위해, 손에 익는 종이 도구를 만듭니다.'},
s2:{label:'웹 서비스 기획',before:'문의 화면에서 다음에 무엇을 해야 하는지 모르겠어요.',after:'서비스 고르기 → 준비 자료 확인 → 연락처 입력 → 문의 내용 확인'},
s3:{label:'콘텐츠 정리',before:'혁신적인 솔루션을 제공하는 최고의 파트너입니다.',after:'필요한 자료를 함께 정리하고, 다음 작업의 범위와 순서를 정합니다.'}
};`);
actions=actions.replace(/const media=document.querySelector[\s\S]*?(?=const representative=)/,'');write('src/purpose/actions.js',actions);
const roles={brand:['catalogue','기록 도구 / DODAM'],local:['workshop','흙결 공방'],restaurant:['immersive','아침정원'],portfolio:['masthead','모서리 스튜디오'],professional:['practice','정돈실'],event:['festival','MATERIAL NEXT / 2027']};
for(const[t,d]of Object.entries(data)){let html=read(`results/atmosphere/${t}/index.html`);if(t!=='saas'){
 const [kind,label]=roles[t];const match=html.match(/<header class="site-header">[\s\S]*?<\/header>/);assert.ok(match,t);let header=match[0].replace('class="site-header"',`class="site-header p-header p-header-${kind}"`).replace(/<strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span>/,`<strong>${label}</strong>`);
 if(t==='brand')header=header.replace('</a><nav','</a><p class="p-header-note">매일 쓰는 물건을 고르는 곳</p><nav');
 const labels={brand:['상품 보기',''],local:['수업 비교','일정 선택'],restaurant:['메뉴 보기','예약하기'],portfolio:['작업 색인','프로젝트 문의'],professional:['서비스 범위','의뢰 내용'],event:['프로그램','참가 신청']}[t];header=header.replace(/둘러보기|(?<=>)작업(?=<)|(?<=>)서비스(?=<)/,labels[0]).replace(/신청하기|프로젝트 문의/,labels[1]||'프로젝트 문의');
 html=html.replace(match[0],header).replace('data-surface="atmosphere-4"','data-surface="atmosphere-4" data-purpose="purpose-5"').replace('../../../src/refined/actions.js','../../../src/purpose/actions.js').replace('</head>','<link rel="stylesheet" href="../../../src/purpose/style.css"></head>').replace('</body>','<script type="module" src="../../../src/purpose/motion.js"></script></body>');
 if(t==='professional')html=html.replace('정리의 방향','정리한 문장 예시');
 }write(`results/purpose/${t}/index.html`,html);}
let viewer=read('src/atmosphere/viewer.js').replaceAll("'refined'","'atmosphere'").replaceAll("'atmosphere'];","'purpose'];").replace("['b','atmosphere','atmosphere']","['b','atmosphere','purpose']").replace("['atmosphere','atmosphere']","['atmosphere','purpose']").replace("refined:'직전 개선본',atmosphere:'새 개선본'","atmosphere:'직전 개선본',purpose:'새 개선본'").replaceAll('v=atmosphere-4','v=purpose-5');
// 비교 조작은 유지하고 결과 경로만 새 버전으로 바꾼다.
write('src/purpose/viewer.js',viewer);
write('purpose/index.html',read('atmosphere/index.html').replaceAll('ATMOSPHERE 04','PURPOSE 05').replaceAll('장면과 색으로 구분하는 화면.','목적에 맞게 연결한 상단과 본문.').replaceAll('../src/atmosphere/viewer.js?v=atmosphere-4','../src/purpose/viewer.js?v=purpose-5').replaceAll('../refinement/index.html','../atmosphere/index.html').replaceAll('ATMOSPHERE_4.md','PURPOSE_5.md').replaceAll('reports/atmosphere-4','reports/purpose-5').replaceAll('배경색과 대표 장면의 후속 개선','GNB·대표 장면·본문 관계의 후속 개선'));
console.log('목적별 개선본7개 생성. SaaS와 이전 결과 유지.');
