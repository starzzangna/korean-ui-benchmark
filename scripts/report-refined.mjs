import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/refined-3'),load=p=>JSON.parse(fs.readFileSync(path.join(root,'artifacts',p),'utf8'));
const qa=load('qa.json'),choices=load('branches.json'),design=load('refined-3/checks.json'),saas=load('saas-cards.json'),assets=load('refined-3/asset-check/asset-report.json');
assert.equal(qa.total,101);assert.equal(qa.failed,0);assert.equal(choices.total,62);assert.equal(choices.failed,0);assert.equal(design.total,76);assert.equal(design.failed,0);assert.equal(saas.total,2);assert.ok(saas.passed);assert.equal(assets.rows.length,4);assert.ok(assets.rows.every(x=>x.errors.length===0));
const baseline=JSON.parse(fs.readFileSync(path.join(out,'baseline.json')));const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const e of baseline.files)assert.equal(hash(path.join(root,e.path)),e.sha256,e.path);
const prior=JSON.parse(fs.readFileSync(path.join(root,'reports/editorial-2/source-manifest.json'))).files.filter(x=>x.path.startsWith('skills/korean-ui-design/'));
for(const e of prior)assert.equal(hash(path.join(root,'archive/editorial-2-skill',e.path.slice('skills/korean-ui-design/'.length))),e.sha256,e.path);
for(const [topic,d]of Object.entries(JSON.parse(fs.readFileSync(path.join(root,'shared/data.json'))))){const html=fs.readFileSync(path.join(root,'results/refined',topic,'index.html'),'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const [name,value]of Object.entries({'browser-checks':qa,'selection-checks':choices,'design-checks':design,'saas-checks':saas}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
fs.writeFileSync(path.join(out,'asset-checks.json'),JSON.stringify({passed:true,assets:assets.rows.map(({id,path,sha256,bytes,errors})=>({id,path,sha256,bytes,errors})),note:'로컬 파일·해시 검사. 개념 그림의 사실성과 화면 적합성은 별도 검토.'},null,2));
const summary={passed:true,sites:7,baseChecks:qa.total,selectionValues:choices.total,designChecks:design.total,saasScenarios:saas.total,newAssets:4,preservedFiles:baseline.files.length,preservedSkillFiles:prior.length,dataEqual:true,browser:qa.browser,scope:'같은 작성자의 후속 개선. 기능/기하/모션 검사는 미적 우위·독립 생성·전체 접근성 인증과 구분한다.'};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'README.md'),`# 자체 개선본7개 검증

| 검사 | 최종 결과 |
|---|---|
| 기능·오류 복구·5개 폭·두 글자 확대·터치·기본 모션·기존 비교 UI | ${qa.total}개 통과 |
| 모든 필수 선택값의 실제 확인/초안 결과 | ${choices.total}개 통과 |
| 그룹/카드/아이콘 정렬·내부 확대·색인·자료 크기/크롭·상황별 모션·새 비교 UI·스킬 예제·보존 | ${design.total}개 통과 |
| SaaS 카드/메뉴·수정/추가 집계·모바일 키보드·확대 | ${saas.total}개 시나리오 통과 |
| 기존28개 시안 실행 파일/자료 | ${baseline.files.length}개 원본 SHA-256 일치 |
| 수정 직전 스킬 보존 | ${prior.length}개 파일이 이전 소스 기록과 일치 |
| 추가 개념 SVG | 4개 파일/해시 검사 통과 |

기본 화면은320/390/768/1024/1440px, 글자 확대는390/768px에서 글자만200%와 글자/행간200%를 구분했다. 추가 검사는 실제 제목·본문·색인 내부 손실, 동등 카드 제목 축, 입력/검색 높이, 아이콘/문구 중심, 열린 회전 아이콘의 경계를 확인한다. 메뉴 확대·실기기·모든 보조기술의 인증은 아니다.

상품/분야 색인 각각을 키보드로 선택해 필터→실제 항목→상세→Escape 복귀를 실행했다. 서비스 색인·본문·문의 선택은 예시와 결과물까지 양방향 대조했다. 수업 선택은 신청 수업/초점/금액, 행사 날짜는 실제 프로그램과 연결했다. 모달 닫기 직후 다음 색인으로 옮긴 초점을 가로채던 정책을 개선본에서 보완했다.

모션은 대표 자료·선택 결과·집계 등 실제 대상의 진행 중 변화와 모션 감소에서의 즉시 결과를 확인했다. 효과 수와 크기를 미적 점수로 취급하지 않는다. PC/모바일과 전체 페이지 캡처를 직접 검토했다.

[비교 화면](../../refinement/index.html) · [변경 명세](../../docs/REFINEMENT_3.md) · [요약](summary.json) · [기준 해시](baseline.json)

[기본 검사](browser-checks.json) · [선택값](selection-checks.json) · [정렬/의미 연결/모션](design-checks.json) · [SaaS](saas-checks.json) · [자료](asset-checks.json)

캡처는 왼쪽부터 B / 개선 전 자체 / 개선 후 자체다. 정지 화면은 모션 감소 설정이며 정상 모션은 비교 화면에서 조작할 수 있다.

${['saas','brand','local','restaurant','portfolio','professional','event'].map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

새 개념 그림과 가상 예시가 추가된 후속 개선이다. 기존 비교본이나 원본 지침만의 인과 효과·모든 과제에서의 우위를 입증하는 결과로 설명하지 않는다. 실제 신청·예약·전송은 없는 로컬 데모다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}
for(const folder of['src/refined','results/refined','refinement','skills/korean-ui-design'])walk(path.join(root,folder));
files.push(...['scripts/build-refined.mjs','scripts/refined-checks.mjs','scripts/qa.mjs','scripts/branches.mjs','scripts/saas-check.mjs','docs/REFINEMENT_3.md'].map(p=>path.join(root,p)));
fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.sort().map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p)}))},null,2));
console.log(JSON.stringify(summary));
