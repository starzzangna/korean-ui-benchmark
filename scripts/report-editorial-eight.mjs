import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/editorial-8'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const qa=read('reports/editorial-8/browser-checks.json'),branches=read('reports/editorial-8/selection-checks.json'),extra=read('artifacts/editorial-8/checks.json'),motion=read('artifacts/editorial-8/content-motion-checks.json'),flow=read('artifacts/editorial-8/editorial-flow-checks.json');for(const[r,n]of[[qa,101],[branches,62],[extra,80],[motion,12],[flow,6]]){assert.equal(r.failed,0);assert.equal(r.total,n);}
const baseline=read('reports/editorial-8/baseline.json');for(const p of['reports/editorial-8/baseline.json','reports/polish-7/baseline.json','reports/flow-6/baseline.json','reports/purpose-5/baseline.json','reports/atmosphere-4/baseline.json','reports/refined-3/baseline.json'])for(const e of read(p).files)assert.equal(hash(e.path),e.sha256,e.path);
for(const t of['saas','brand','local','restaurant'])assert.equal(hash(`results/editorial/${t}/index.html`),hash(`results/polish/${t}/index.html`));const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const s=fs.readFileSync(path.join(root,`results/editorial/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(s.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const[name,value]of Object.entries({'design-and-sync-checks':extra,'content-motion-checks':motion,'editorial-flow-checks':flow}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
const summary={passed:true,sites:7,changedCategories:3,unchangedCategories:['saas','brand','local','restaurant'],saasIdentical:true,baseChecks:101,selectionValues:62,designAndSyncChecks:80,contentMotionChecks:12,editorialFlowChecks:6,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
const mobile=flow.metrics.filter(r=>r.width===390),rows=['professional','portfolio','event'].map(t=>{const a=mobile.find(r=>r.topic===t&&r.group==='polish'),b=mobile.find(r=>r.topic===t&&r.group==='editorial');return`| ${t} | ${a.height}px | ${b.height}px |`;}).join('\n');
fs.writeFileSync(path.join(out,'README.md'),`# 선택·대표 장면·행사 편집 검증

[B와 비교](../../editorial/index.html) · [변경 내용](../../docs/EDITORIAL_8.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 검사 범위 | 결과 |
|---|---|
| 기능·모바일·글자만200%·글자/행간200%·키보드·터치 | ${qa.passed}/${qa.total} |
| 필수 선택값 실제 연결 | ${branches.passed}/${branches.total} |
| 정렬·역할색·모션·함께 이동/동시 스크롤 | ${extra.passed}/${extra.total} |
| 묶음 진입·초점 중단·재진입·감소 설정 | ${motion.passed}/${motion.total} |
| 단일 서비스 선택·작품 상세/복귀·포스터/대비/이동 | ${flow.passed}/${flow.total} |
| 기존 실행 파일·자료 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS·브랜드·로컬·식당 | 직전 HTML과 바이트 동일 |

## 모바일 문서 높이

390px·같은 자료·글꼴 로드 후 모션 감소 상태다. 길이가 짧다는 것만으로 미적 우위를 판단하지 않는다.

| 카테고리 | 직전 | 새 개선본 |
|---|---|---|
${rows}

첫 구간 링크와 실제 서비스 선택 위치는 별도 계측했다. 서비스 선택은 하나의 버튼 그룹에서 예시/결과물/문의 값에 연결되고, 폼 변경도 역방향으로 반영된다. 포트폴리오 주/보조 이미지의 컨테이너·크기 관계·하단 축·정확한 상세·초점 복귀를 확인했다. 행사는 제목/날짜 중복 제거, 포스터 버튼의 계산된 대비4.5:1 이상, 키보드로 실제 프로그램 이동과 구간 배경 연결을 확인했다.

기본 폭320/390/768/1024/1440px, 두 확대 방식은390/768px이다. 함께 이동은 각 프레임의 해당 구간으로 이동하고 바깥 페이지를 유지한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 포함한다. 모달 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [정렬/스크롤](design-and-sync-checks.json) · [모션](content-motion-checks.json) · [편집 흐름/계측](editorial-flow-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

같은 작성자의 후속 개선이다. 검사 수는 미적 우위나 스킬의 최초 생성 성능을 증명하지 않는다. 실기기·브라우저 메뉴 확대·전체 접근성 인증은 별도다. 로컬 데모로 실제 신청/전송을 하지 않으며 GitHub Pages에는 배포하지 않았다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(path.relative(root,p).replaceAll('\\','/'));}}for(const d of['src/editorial','results/editorial','editorial','skills/korean-ui-design'])walk(path.join(root,d));fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.map(p=>({path:p,sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
