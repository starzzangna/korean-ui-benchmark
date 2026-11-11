import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/polish-7'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const qa=read('reports/polish-7/browser-checks.json'),branches=read('reports/polish-7/selection-checks.json'),extra=read('artifacts/polish-7/checks.json'),motion=read('artifacts/polish-7/content-motion-checks.json'),boundary=read('artifacts/polish-7/boundary-checks.json');for(const[r,n]of[[qa,101],[branches,62],[extra,80],[motion,12],[boundary,7]]){assert.equal(r.failed,0);assert.equal(r.total,n);}
const baseline=read('reports/polish-7/baseline.json');for(const p of['reports/polish-7/baseline.json','reports/flow-6/baseline.json','reports/purpose-5/baseline.json','reports/atmosphere-4/baseline.json','reports/refined-3/baseline.json'])for(const e of read(p).files)assert.equal(hash(e.path),e.sha256,e.path);
assert.equal(hash('results/polish/saas/index.html'),hash('results/flow/saas/index.html'));const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const s=fs.readFileSync(path.join(root,`results/polish/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(s.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const[name,value]of Object.entries({'design-and-sync-checks':extra,'content-motion-checks':motion,'boundary-and-length-checks':boundary}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
const summary={passed:true,sites:7,changedCategories:6,saasIdentical:true,baseChecks:101,selectionValues:62,designAndSyncChecks:80,contentMotionChecks:12,boundaryAndLengthChecks:7,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
const lengths=boundary.checks.filter(c=>c.name.startsWith('모바일 탐색 길이')).map(c=>`| ${c.name.replace('모바일 탐색 길이 ','')} | ${c.evidence.flow.height}px | ${c.evidence.polish.height}px |`).join('\n');
fs.writeFileSync(path.join(out,'README.md'),`# 밀도·배경 경계 보완 검증

[새 비교](../../polish/index.html) · [개선 방향](../../docs/POLISH_7.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | ${qa.passed}/${qa.total} |
| 필수 선택값의 실제 연결 | ${branches.passed}/${branches.total} |
| 정렬·역할색·모션·함께 이동/동시 스크롤 | ${extra.passed}/${extra.total} |
| 묶음 진입·초점 중단·재진입·감소 설정 | ${motion.passed}/${motion.total} |
| 행사 경계·고정 배경·모바일 길이 | ${boundary.passed}/${boundary.total} |
| 기존 실행 파일·자료 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 동일 |

## 모바일 문서 높이

390px·같은 자료·글꼴 로드·모션 감소 상태에서 측정했다. 길이가 짧다는 것만으로 미적 우위를 판단하지 않는다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
${lengths}

폭320/390/768/1024/1440px과390/768px의 두 확대 방식을 검사했다. 행사 프로그램→신청 부모 사이에 빈 좌표가 없고 바탕색이 같음을 확인했다. 간격은 부모 내부로 포함되며, 실행 중 신청 배경/부모는 움직이지 않고 내부 묶음만 도착한다. PC/모바일 경계는 실제 캡처도 확인했다.

함께 이동은 각 프레임의 해당 구간을 이동하며 바깥 페이지를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종 보기·카테고리 전환·모바일을 포함한다. 모달/확대 이미지 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [경계/길이](boundary-and-length-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

같은 작성자의 후속 개선이다. 검사 수는 미적 우위·전체 접근성 인증을 뜻하지 않는다. 실기기·브라우저 메뉴 확대는 별도다. 로컬 데모로 실제 전송/예약을 하지 않으며 GitHub Pages에는 배포하지 않았다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(root,p).replaceAll('\\','/'));}}for(const d of['src/polish','results/polish','polish','skills/korean-ui-design'])walk(path.join(root,d));fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
