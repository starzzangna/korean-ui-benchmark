import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';const root=path.resolve(import.meta.dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),out=path.join(root,'reports/compact-12');
const suites=[['browser-checks','reports/compact-12/browser-checks.json',101],['design-and-sync-checks','artifacts/compact-12/checks.json',80],['stability-checks','artifacts/compact-12/stability-checks.json',11],['role-checks','artifacts/compact-12/role-checks.json',12],['content-motion-checks','artifacts/compact-12/content-motion-checks.json',12],['size-checks','artifacts/compact-12/size-checks.json',4],['b-motion-comparison','artifacts/compact-12/b-motion-comparison.json',12]];for(const[name,p,n]of suites){const r=read(p);assert.equal(r.total,n);assert.equal(r.failed,0);assert.equal(r.passed,n);if(!p.startsWith('reports/'))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(r,null,2));}
const baselines=['compact-12','craft-11','expression-10','relevance-9','editorial-8','polish-7','flow-6','purpose-5','atmosphere-4','refined-3'];for(const stage of baselines)for(const f of read(`reports/${stage}/baseline.json`).files)assert.equal(hash(f.path),f.sha256,f.path);const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const html=fs.readFileSync(path.join(root,`results/compact/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);if(t!=='professional')assert.equal(hash(`results/compact/${t}/index.html`),hash(`results/craft/${t}/index.html`));}
const summary={passed:true,totalChecks:suites.reduce((s,r)=>s+r[2],0),changedCategories:['professional'],unchangedCategories:['saas','brand','local','restaurant','portfolio','event'],saasIdentical:true,commonDataEqual:true,preservedCraftFiles:read('reports/compact-12/baseline.json').files.length,previousBaselinesVerified:baselines.length};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));fs.copyFileSync(path.join(root,'artifacts/compact-12/measurements.json'),path.join(out,'measurements.json'));
fs.writeFileSync(path.join(out,'README.md'),`# B 재비교와 전문 서비스 축소안\n`+`
[비교 화면](../../compact/index.html) · [상세 분석](../../docs/COMPACT_12.md) · [요약](summary.json)

| 검사 | 통과 |
|---|---|
${suites.map(([name,p,n])=>`| [${name}](${name}.json) | ${n}/${n} |`).join('\n')}

총232건 통과. 기존 Craft11 실행 파일 ${summary.preservedCraftFiles}개와 보존 기준10종을 확인했다. SaaS 포함6개 카테고리는 직전 HTML과 동일하다.

전문 서비스 패널은 PC 약684→477px, 모바일705→622px다.1440×768/900·1280×800에서 첫 화면 내 전체 패널을 확인했다. 모바일390px 문서 길이는2464→2378px다. 결과 전환·펼침·200% 확대에서 읽기 기준점과CTA·다음 섹션 위치의 변동2px 미만 및 오버플로 없음도 확인했다.

PC/모바일의 모션은 실제 진입·감소 설정을 확인하며, 체감 부드러움이나 실기기 성능을 수치만으로 판정하지 않는다. CSS 글자 확대는 두 방식으로 검사했고 실제 브라우저 메뉴 확대/실기기 검토는 별도다. 짧은 결과의 예약 여백과 모바일 작품 속 작은 글자, 행사 소개와 일정 사이의 반복은 남아 있다.

| 비교 | PC | 모바일 | 전체 |
|---|---|---|---|
${['professional','portfolio','event'].map(t=>`| ${t} | [보기](previews/${t}-pc.jpg) | [보기](previews/${t}-mobile.jpg) | [보기](previews/${t}-overview.jpg) |`).join('\n')}

전문 서비스 캡처는 B/Craft11/Compact12 순서, 다른 두 범주는 B/Craft11 순서다. 이번에 전문 서비스만 조정했고 나머지는 분석 대상이다. 같은 작성자의 후속 개선으로 최초 생성 성능의 독립 실험은 아니다. 로컬 데모이며 실제 전송이나 이번 변경의 GitHub Pages 배포는 없다.
`);
const files=[];function walk(d){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())walk(p);else files.push(p);}}for(const d of['src/compact','results/compact','compact'])walk(d);fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
