import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';const root=path.resolve(import.meta.dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),out=path.join(root,'reports/renewal-14');
const suites=[['browser-checks',read('reports/renewal-14/browser-checks.json'),401],['selection-checks',read('reports/renewal-14/selection-checks.json'),248],['design-checks',read('artifacts/renewal-14/design-checks.json'),145],['motion-checks',read('artifacts/renewal-14/motion-checks.json'),12]],saas=read('reports/renewal-14/saas-checks.json'),repeat=read('reports/renewal-14/saas-browser-checks.json');for(const[name,r,n]of suites){assert.equal(r.total,n);assert.equal(r.failed,0);assert.equal(r.passed,n);fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(r,null,2));}assert.equal(saas.passed,true);assert.equal(saas.total,8);assert.equal(repeat.failed,0);
const baseline=read('reports/renewal-14/baseline.json');for(const f of baseline.files)assert.equal(hash(f.path),f.sha256,f.path);for(const stage of['clarity-13','compact-12','craft-11','expression-10','relevance-9','editorial-8','polish-7','flow-6','purpose-5','atmosphere-4','refined-3'])for(const f of read(`reports/${stage}/baseline.json`).files)assert.equal(hash(f.path==='index.html'?'archive/pre-renewal-14/index.source.html':f.path),f.sha256,f.path);
const data=read('shared/data.json');for(const g of['none','a','b','own'])for(const[t,d]of Object.entries(data)){const file=`results/renewal/${g}/${t}/index.html`,html=fs.readFileSync(path.join(root,file),'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);assert.notEqual(hash(file),hash(`results/${g}/${t}/index.html`));}
const summary={passed:true,sites:28,categories:7,groups:4,totalChecks:814,additionalFinalSaasBrowserChecks:53,preservedFiles:baseline.files.length,dataEqual:true,sameAuthor:true,independentGeneration:false};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'README.md'),`# 새4종 검증

[비교 화면](../../index.html) · [제작 범위](../../docs/RENEWAL_14.md) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·실행 오류·모바일·두200% 확대·터치/키보드 |401/401|
| 필수 선택값·금액·제출 연결 |248/248|
| 5개 폭·이미지·컨트롤 높이·읽기 위치·동시 스크롤 |145/145|
| B/자체 구간 진입·모션 감소 |12/12|
| SaaS 집계·카드/메뉴·상태 변경·모바일 탐색 |8/8|
| 합계 |814/814|
| 검색 비율 변경 후 SaaS 브라우저 재검증 |53/53 (합계와 별도)|
| 이전 파일 보존 |${baseline.files.length}개 SHA-256 일치|

공통 데이터7종×4군이 동일하며 기존28개·후속 개선본은 바꾸지 않았다. 새 파일은 모두 이전 해당 화면과 다르다. 카테고리와 조건별 구성을 새로 작성했지만 같은 작성자·공유 기능·에셋을 사용하는 후속 비교로 최초 생성 인과 효과를 증명하지 않는다. A/B는 원본 전체 도구/규칙의 무수정 인증 결과가 아니다.

| 카테고리 | PC | 모바일 |
|---|---|---|
${Object.keys(data).map(t=>`|${t}|[보기](previews/${t}-pc.jpg)|[보기](previews/${t}-mobile.jpg)|`).join('\n')}

캡처 순서는 no skill/A/B/자체 스킬이다. 모바일은 에뮬레이션, 확대는 CSS 글자만/글자와 행간200%다. 실기기·브라우저 메뉴 확대·종합 접근성 인증은 별도다. 실제 계정·예약·메일 전송이 없는 데모다.

[기능](browser-checks.json) · [선택](selection-checks.json) · [화면/정렬](design-checks.json) · [모션](motion-checks.json) · [SaaS](saas-checks.json) · [최종 SaaS 재검사](saas-browser-checks.json) · [보존 기준](baseline.json)
`);
const files=[];function walk(d){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())walk(p);else files.push(p);}}for(const d of['src/renewal','results/renewal','skills/korean-ui-design'])walk(d);fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
