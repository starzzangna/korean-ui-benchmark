import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/atmosphere-4'),load=p=>JSON.parse(fs.readFileSync(path.join(root,'artifacts',p),'utf8')),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const qa=load('qa.json'),extra=load('atmosphere-4/checks.json'),branches=load('branches.json');assert.equal(qa.total,101);assert.equal(qa.failed,0);assert.equal(extra.total,80);assert.equal(extra.failed,0);assert.equal(branches.total,62);assert.equal(branches.failed,0);
const baseline=JSON.parse(fs.readFileSync(path.join(out,'baseline.json')));for(const e of baseline.files)assert.equal(hash(path.join(root,e.path)),e.sha256,e.path);
assert.equal(hash(path.join(root,'results/atmosphere/saas/index.html')),hash(path.join(root,'results/refined/saas/index.html')));
const data=JSON.parse(fs.readFileSync(path.join(root,'shared/data.json')));for(const[t,d]of Object.entries(data)){const html=fs.readFileSync(path.join(root,'results/atmosphere',t,'index.html'),'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),d);}
for(const[name,value]of Object.entries({'browser-checks':qa,'design-and-sync-checks':extra,'selection-checks':branches}))fs.writeFileSync(path.join(out,name+'.json'),JSON.stringify(value,null,2));
const summary={passed:true,sites:7,changedCategories:6,saasIdentical:true,baseChecks:qa.total,designAndSyncChecks:extra.total,selectionValues:branches.total,preservedFiles:baseline.files.length,dataEqual:true,browser:qa.browser,scope:'기존 비교를 보존한 후속 개선. 기능·기하·역할색·스크롤 검사이며 미적 우위나 전체 접근성 인증이 아니다.'};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2));
fs.writeFileSync(path.join(out,'README.md'),`# 배경과 대표 장면 개선 검증

SaaS는 직전 개선본과 같은 HTML/실행 자원을 사용하며6개 카테고리를 수정했다. B와 이전 시안의 실행 파일은 원본 해시로 대조했다.

| 검사 | 최종 결과 |
|---|---|
| 기능·오류 복구·모바일·5개 폭·두 글자 확대·기본 모션·터치 | ${qa.total}개 통과 |
| 역할색·상단 균형·정렬·내부 확대·실제 선택·모션·비교 UI/동시 이동·보존 | ${extra.total}개 통과 |
| 필수 선택값→확인/초안 결과 | ${branches.total}개 통과 |
| 기존 비교 실행 파일·자료 | ${baseline.files.length}개 SHA-256 일치 |
| SaaS 유지 | 직전/새 시안 HTML SHA-256 일치 |

기본 폭은320/390/768/1024/1440px이다. 글자만200%와 글자/행간200%는390/768px에서 구분했다. 카드·상태 묶음·아이콘/문구 중심·검색/선택 높이·내부 텍스트 손실·열린 회전 표식을 확인했다.

새 역할색은 실제 body·읽기 면·신청 면의 computed 색에서 본문/보조 문구 대비4.5:1 이상을 확인했다. 사진 위 모든 픽셀의 대비 인증과는 구분하며 전면 음식 사진은 실제 PC/모바일 캡처도 검토했다.

함께 이동은 첫 화면/주요 목록/하단에서 모든 프레임이 움직이고 바깥 비교 페이지가 유지되는지 검사했다. 동시 스크롤은 실제 마우스 휠·양방향 진행률·꺼짐·3종 보기·비교군 전환·모바일을 포함한다. 모달/확대 이미지 내부는 독립 조작이다.

[새 비교](../../atmosphere/index.html) · [변경 명세](../../docs/ATMOSPHERE_4.md) · [직전 비교](../../refinement/index.html) · [요약](summary.json) · [보존 기준](baseline.json)

[기본 검사](browser-checks.json) · [정렬/색면/동시 이동](design-and-sync-checks.json) · [필수 선택값](selection-checks.json)

캡처는 B / 직전 개선본 / 새 개선본 순서다.

${Object.keys(data).map(t=>`- ${t}: [PC](previews/${t}-pc.jpg) · [모바일](previews/${t}-mobile.jpg)`).join('\n')}

같은 작성자의 후속 개선이다. 검사 건수는 미적 선호·독립 생성·모든 접근성 상태의 인증이 아니다. 실제 신청·예약·전송은 없는 로컬 데모이며 실기기·브라우저 메뉴 확대는 별도다.
`);
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}for(const name of['src/atmosphere','results/atmosphere','atmosphere','skills/korean-ui-design'])walk(path.join(root,name));files.push(...['scripts/build-atmosphere.mjs','scripts/atmosphere-checks.mjs','docs/ATMOSPHERE_4.md'].map(p=>path.join(root,p)));fs.writeFileSync(path.join(out,'source-manifest.json'),JSON.stringify({files:files.sort().map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:hash(p)}))},null,2));console.log(JSON.stringify(summary));
