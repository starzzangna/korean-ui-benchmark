import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/expression-10'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const qa=read('reports/expression-10/browser-checks.json'),branches=read('reports/expression-10/selection-checks.json'),extra=read('artifacts/expression-10/checks.json'),motion=read('artifacts/expression-10/content-motion-checks.json'),flow=read('artifacts/expression-10/editorial-flow-checks.json'),evidence=read('artifacts/expression-10/evidence-checks.json'),roles=read('artifacts/expression-10/role-checks.json');for(const[r,n]of[[qa,101],[branches,62],[extra,80],[motion,12],[flow,6],[evidence,9],[roles,12]]){assert.equal(r.failed,0);assert.equal(r.total,n);}
const baseline=read('reports/expression-10/baseline.json');for(const p of['reports/expression-10/baseline.json','reports/relevance-9/baseline.json','reports/editorial-8/baseline.json','reports/polish-7/baseline.json','reports/flow-6/baseline.json','reports/purpose-5/baseline.json','reports/atmosphere-4/baseline.json','reports/refined-3/baseline.json'])for(const e of read(p).files)assert.equal(hash(e.path),e.sha256,e.path);
for(const t of['saas','brand','local','restaurant'])assert.equal(hash(`results/expression/${t}/index.html`),hash(`results/relevance/${t}/index.html`));const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const s=fs.readFileSync(path.join(root,`results/expression/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(s.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const[name,value]of Object.entries({'design-and-sync-checks':extra,'content-motion-checks':motion,'editorial-flow-checks':flow,'evidence-checks':evidence,'role-checks':roles}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
const summary={passed:true,sites:7,changedCategories:3,unchangedCategories:['saas','brand','local','restaurant'],saasIdentical:true,baseChecks:101,selectionValues:62,designAndSyncChecks:80,contentMotionChecks:12,editorialFlowChecks:6,evidenceChecks:9,roleChecks:12,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
const mobile=flow.metrics.filter(r=>r.width===390),rows=['professional','portfolio','event'].map(t=>{const a=mobile.find(r=>r.topic===t&&r.group==='relevance'),b=mobile.find(r=>r.topic===t&&r.group==='expression');return`| ${t} | ${a.height}px | ${b.height}px |`;}).join('\n');
fs.writeFileSync(path.join(out,'README.md'),`# 결과 표현·작품 감상·관심 문구 검증

[B와 비교](../../expression/index.html) · [변경 명세](../../docs/EXPRESSION_10.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 검사 범위 | 결과 |
|---|---|
| 기능·모바일·두 글자 확대·키보드·터치 | ${qa.passed}/${qa.total} |
| 필수 선택값의 실제 연결 | ${branches.passed}/${branches.total} |
| 정렬·역할색·모션·함께 이동/동시 스크롤 | ${extra.passed}/${extra.total} |
| 묶음 진입·초점 중단·재진입·감소 설정 | ${motion.passed}/${motion.total} |
| 선택·작품 상세/복귀·포스터/키보드 이동 | ${flow.passed}/${flow.total} |
| 결과 위계·펼침/확대·실제 자료·양일 세션·빠른 선택·비교 프레임 이동 | ${evidence.passed}/${evidence.total} |
| 결과3종 확대·작품 캡션·관심 연결·표현별 모션 | ${roles.passed}/${roles.total} |
| 기존 실행 파일·자료 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS·브랜드·로컬·식당 | 직전 HTML과 바이트 동일 |

## 모바일 길이

390px·같은 데이터·글꼴 로드 후 모션 감소/보조 맥락 닫힘 상태다. 펼친 상태는 별도 확대 검사에 포함한다. 길이가 짧다는 것만으로 우위를 판단하지 않으며 행사는 실제 세션 미리 보기의 새 정보를 추가했다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
${rows}

전문 서비스는 메시지 초안/번호가 있는 흐름/읽는 구조로 결과 형태를 구분하고, 결과/결과물/문의가 보조 맥락보다 먼저 노출되고, 키보드로 맥락을 연 뒤 서비스 변경과200% 확대에서 값·열림·표식이 유지된다. 실제 제공 범위는 기본 화면에 남긴다. 빠른 선택은 부모 진입을 취소한 뒤 즉시 결과를 갱신하며 모션 감소 이벤트에도 남는 효과가 없다.

포트폴리오는 대표의 회색 캡션 면을 줄이고 매체/작업명으로 작품을 안내하며, 대표 전체 원본과 목록의 실제 상세 원본을 구분하고 정확한 모달·세부·복귀를 확인했다. 행사 참여 미리 보기는 제공된 e1/e5 내용에서 방문 관심을 먼저 편집하고 실제 프로그램명을 근거로 연결하며, 키보드로 양일의 해당 세션을 열고 summary에 초점을 둔다. 프레임 안 이동이 바깥 비교 페이지를 움직이지 않는지도 확인했다.

기본 폭320/390/768/1024/1440px과390/768px의 글자만200%·글자/행간200%를 확인했다. 열린 보조 맥락/참여 버튼의 추가 확대는1440/390px에서 확인했다. 실기기·브라우저 메뉴 확대는 별도다. 함께 이동·동시 스크롤·모달 내부 독립 조작을 유지한다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [편집 흐름](editorial-flow-checks.json) · [추가 적용 근거](evidence-checks.json) · [표현별 검증](role-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

같은 작성자의 후속 개선이다. 검사 수는 미적 우위나 최초 생성 성능을 증명하지 않는다. 실제 성과/예약/전송이 없는 로컬 데모이며 GitHub Pages에는 배포하지 않았다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(root,p).replaceAll('\\','/'));}}for(const d of['src/expression','results/expression','expression','skills/korean-ui-design'])walk(path.join(root,d));fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
