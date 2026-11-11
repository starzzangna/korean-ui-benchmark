import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/flow-6'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const qa=read('reports/flow-6/browser-checks.json'),branches=read('reports/flow-6/selection-checks.json'),extra=read('artifacts/flow-6/checks.json'),motion=read('artifacts/flow-6/content-motion-checks.json');for(const[r,n]of[[qa,101],[branches,62],[extra,80],[motion,12]]){assert.equal(r.failed,0);assert.equal(r.total,n);}
const baseline=read('reports/flow-6/baseline.json');for(const p of['reports/flow-6/baseline.json','reports/purpose-5/baseline.json','reports/atmosphere-4/baseline.json','reports/refined-3/baseline.json'])for(const e of read(p).files)assert.equal(hash(e.path),e.sha256,e.path);
assert.equal(hash('results/flow/saas/index.html'),hash('results/purpose/saas/index.html'));assert.equal(hash('src/flow/content-reveal.js'),hash('skills/korean-ui-design/assets/motion/content-reveal.js'));
const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const s=fs.readFileSync(path.join(root,`results/flow/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(s.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const[name,value]of Object.entries({'design-and-sync-checks':extra,'content-motion-checks':motion}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
const summary={passed:true,sites:7,changedCategories:6,saasIdentical:true,baseChecks:101,selectionValues:62,designAndSyncChecks:80,contentMotionChecks:12,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'README.md'),`# 탐색·강조·묶음 모션 검증

[새 비교](../../flow/index.html) · [변경 명세](../../docs/FLOW_6.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | ${qa.passed}/${qa.total} |
| 필수 선택값의 실제 연결 | ${branches.passed}/${branches.total} |
| 정렬·색면·상황별 모션·함께 이동/동시 스크롤 | ${extra.passed}/${extra.total} |
| PC/모바일 묶음 진입·초점 중단·재진입·모션 감소 | ${motion.passed}/${motion.total} |
| 이전 실행 파일/자료 보존 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 동일 |

폭320/390/768/1024/1440px과390/768px 두 확대 방식을 확인했다. 글자 확대는 CSS 계측이며 브라우저 메뉴 확대와 구분한다. 콘텐츠 진입은1440/390px에서 실제 화면 아래 대상에 스크롤하여16px/780ms의 실행을 확인했다. 묶음의 자식에는 중첩 진입이 없고, 초점을 주면 이동이 중단되며 재진입과 모션 감소에서도 내용을 유지한다.

함께 이동은 각 프레임의 해당 구간을 이동하고 바깥 페이지 위치를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 확인했다. 모달/확대 이미지 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [묶음 모션](content-motion-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

실제 디자인 평가는 캡처와 조작 검토에 근거한 판단이며 검사 수가 미적 우위를 증명하지 않는다. 같은 작성자의 후속 개선이다. 실제 신청/예약/전송이 없는 로컬 데모이며 실기기·전체 접근성 인증은 별도다. GitHub Pages에 배포하지 않았다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(root,p).replaceAll('\\','/'));}}for(const d of['src/flow','results/flow','flow','skills/korean-ui-design'])walk(path.join(root,d));fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
