import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/purpose-5'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p))),hash=p=>createHash('sha256').update(fs.readFileSync(path.join(root,p))).digest('hex');
const qa=read('reports/purpose-5/browser-checks.json'),branches=read('reports/purpose-5/selection-checks.json'),extra=read('artifacts/purpose-5/checks.json'),last=read('reports/purpose-5/final-professional-checks.json');
for(const[r,count]of[[qa,101],[branches,62],[extra,80],[last,14]]){assert.equal(r.failed,0);assert.equal(r.total,count);}
const baseline=read('reports/purpose-5/baseline.json');for(const e of baseline.files)assert.equal(hash(e.path),e.sha256,e.path);
const restaurant=read('reports/purpose-5/final-restaurant-checks.json');assert.equal(restaurant.failed,0);assert.equal(restaurant.total,14);
for(const p of['reports/refined-3/baseline.json','reports/atmosphere-4/baseline.json'])for(const e of read(p).files)assert.equal(hash(e.path),e.sha256,e.path);
assert.equal(hash('results/purpose/saas/index.html'),hash('results/atmosphere/saas/index.html'));
const data=read('shared/data.json');for(const[t,d]of Object.entries(data)){const s=fs.readFileSync(path.join(root,`results/purpose/${t}/index.html`),'utf8');assert.deepEqual(JSON.parse(s.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
fs.writeFileSync(path.join(out,'design-and-sync-checks.json'),JSON.stringify(extra,null,2));
const summary={passed:true,sites:7,changedCategories:6,saasIdentical:true,baseChecks:101,selectionValues:62,designAndSyncChecks:80,finalProfessionalChecks:14,finalRestaurantChecks:14,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser};fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'README.md'),`# 목적별 상단·색면 검증

[B와 비교](../../purpose/index.html) · [변경 명세](../../docs/PURPOSE_5.md) · [보존 기준](baseline.json) · [요약](summary.json)

| 범위 | 결과 |
|---|---|
| 실제 기능·모바일·글자만200%·글자/행간200%·터치 | ${qa.passed}/${qa.total} |
| 필수 선택값과 연결 결과 | ${branches.passed}/${branches.total} |
| 정렬·GNB 겹침/잘림·역할색·모션·함께 이동/동시 스크롤 | ${extra.passed}/${extra.total} |
| 마지막 서비스 예시 변경 후 기능/확대 재검사 | ${last.passed}/${last.total} |
| 마지막 식당 사진 크롭 변경 후 기능/확대 재검사 | ${restaurant.passed}/${restaurant.total} |
| 이전 실행 파일·데이터 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS | 직전 HTML과 바이트 일치 |

320/390/768/1024/1440px 및390/768px200% 확대를 확인했다. 함께 이동은 바깥 비교 페이지를 움직이지 않고 모든 프레임의 해당 구간을 이동한다. 동시 스크롤은 실제 휠·양방향·꺼짐·3종·카테고리 전환·모바일을 검증했다. 모달 내부는 독립 조작이다.

[기능](browser-checks.json) · [선택값](selection-checks.json) · [추가 검증](design-and-sync-checks.json) · [최종 서비스 재검사](final-professional-checks.json) · [최종 식당 재검사](final-restaurant-checks.json)

캡처는 B / 직전 / 새 개선본 순서다.
${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

같은 작성자의 후속 개선이며 객관적 미적 우위의 증명은 아니다. 로컬 데모로 실제 예약·전송을 하지 않는다. 실기기·브라우저 메뉴 확대·사진 위 모든 픽셀 대비는 별도 검토 대상이다. GitHub Pages에는 배포하지 않았다.
`);console.log(JSON.stringify(summary));
