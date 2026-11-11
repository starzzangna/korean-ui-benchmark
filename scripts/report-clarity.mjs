import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';const root=path.resolve(import.meta.dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex'),out=path.join(root,'reports/clarity-13');
const suites=[['browser-checks','reports/clarity-13/browser-checks.json',101],['design-and-sync-checks','artifacts/clarity-13/checks.json',80],['stability-checks','artifacts/clarity-13/stability-checks.json',11],['role-checks','artifacts/clarity-13/role-checks.json',12],['content-motion-checks','artifacts/clarity-13/content-motion-checks.json',12],['content-checks','artifacts/clarity-13/content-checks.json',8]];
for(const[name,p,n]of suites){const r=read(p);assert.equal(r.total,n);assert.equal(r.failed,0);assert.equal(r.passed,n);if(!p.startsWith('reports/'))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(r,null,2));}
const baselines=['clarity-13','compact-12','craft-11','expression-10','relevance-9','editorial-8','polish-7','flow-6','purpose-5','atmosphere-4','refined-3'];for(const stage of baselines)for(const f of read(`reports/${stage}/baseline.json`).files)assert.equal(hash(f.path),f.sha256,f.path);const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const html=fs.readFileSync(path.join(root,`results/clarity/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);if(['saas','brand','local','restaurant'].includes(t))assert.equal(hash(`results/clarity/${t}/index.html`),hash(`results/compact/${t}/index.html`));}
const manifest=read('src/clarity/assets/manifest.json');assert.equal(hash('src/craft/assets/nest-ui.svg'),manifest.sourceSha256);for(const a of manifest.assets)assert.equal(hash('src/clarity/assets/'+a.path),a.sha256);
const summary={passed:true,totalChecks:suites.reduce((s,r)=>s+r[2],0),changedCategories:['professional','portfolio','event'],unchangedCategories:['saas','brand','local','restaurant'],saasIdentical:true,commonDataEqual:true,preservedCompactFiles:read('reports/clarity-13/baseline.json').files.length,preservationBaselines:baselines.length,assetSourcesVerified:true};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));fs.copyFileSync(path.join(root,'artifacts/clarity-13/measurements.json'),path.join(out,'measurements.json'));
fs.writeFileSync(path.join(out,'README.md'),`# 예시 근거와 작품 가독성\n`+`
[비교 화면](../../clarity/index.html) · [변경·판단·실행](../../docs/CLARITY_13.md) · [요약](summary.json)

| 검사 | 통과 |
|---|---|
${suites.map(([name,p,n])=>`| [${name}](${name}.json) | ${n}/${n} |`).join('\n')}

총224건 통과. Compact12 실행 파일 ${summary.preservedCompactFiles}개와11종 보존 기준을 확인했다. SaaS·브랜드·로컬·식당은 직전 HTML과 바이트 동일하다. 공통 데이터와 새 크롭/원본 출처의 SHA-256도 일치한다.

전문 서비스의 기본 패널은477px로 유지하며, 열린 판단 근거·200% 확대·서비스 변경에서 읽기 기준점/CTA/다음 구간의 변동2px 미만과 열린 상태의 유지도 확인했다.1440×768/1280×800에서 기본 패널 전체가 첫 화면에 들어온다.

390px 모바일 대표 작품은350px로 커지고 같은 원본의 핵심 크롭을 사용한다. 핵심 제목은약14px이며 작은 본문 전체를 읽을 수 있다는 뜻은 아니다. 모달 전체/세부·오류 재시도와 보조 작품 선택은 유지한다. 작품 페이지 길이는3508→3646px로138px 늘었다. 행사는 참여 맥락을 남기면서 프로그램명 반복을 덜어2732→2635px로97px 짧아졌다. 세션의 정확한 날짜·열림·초점은 유지한다.

| 비교 | PC | 모바일 | 전체 |
|---|---|---|---|
${['professional','portfolio','event'].map(t=>`| ${t} | [보기](previews/${t}-pc.jpg) | [보기](previews/${t}-mobile.jpg) | [보기](previews/${t}-overview.jpg) |`).join('\n')}

캡처는 B / Compact12 / Clarity13 순서다. 기능/모바일/글자 확대는 CSS 두 방식이며 실제 기기·브라우저 메뉴 확대는 별도다. 모션 검사와 페이지 길이는 미적 우위나 종합 접근성을 증명하지 않는다. 같은 작성자의 후속 개선으로 지침만의 최초 생성 통제 실험은 아니다. 실제 계정/예약/전송이 없는 로컬 데모이며 이번 개선은 GitHub Pages에 배포하지 않았다.
`);
const files=[];function walk(d){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){const p=d+'/'+e.name;if(e.isDirectory())walk(p);else files.push(p);}}for(const d of['src/clarity','results/clarity','clarity','skills/korean-ui-design'])walk(d);fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
