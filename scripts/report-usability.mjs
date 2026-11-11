import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';const root=path.resolve(import.meta.dirname,'..'),hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),out='reports/usability-15',extra=read('artifacts/usability-15/checks.json'),qa=read(out+'/browser-checks.json');for(const r of[extra,qa]){assert.equal(r.failed,0);assert.equal(r.total,r.passed);}const baseline=read(out+'/baseline.json');for(const f of baseline.files){const archived=f.path.replace('results/renewal/','results/renewal-before-fixes/');assert.equal(hash(fs.readFileSync(archived,'utf8').replaceAll('src/renewal-before-fixes/styles.css','src/renewal/styles.css')),f.sha256,archived);}
const data=read('shared/data.json');for(const g of['none','a','b','own'])for(const t of['saas','restaurant']){const html=fs.readFileSync(`results/renewal/${g}/${t}/index.html`,'utf8');assert.deepEqual(JSON.parse(html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/)[1]),data[t]);}fs.writeFileSync(out+'/spacing-and-restore-checks.json',JSON.stringify(extra,null,2));const summary={passed:true,additionalChecks:extra.total,functionChecks:qa.total,total:extra.total+qa.total,preservedPages:baseline.files.length,minimumToolbarListGap:20,restaurantRestoredFrom:'results/clarity/restaurant/index.html',publicVersion:'usability-15'};fs.writeFileSync(out+'/summary.json',JSON.stringify(summary,null,2));fs.writeFileSync(out+'/README.md',`# 식당 복원과 도구/목록 간격 검증

[비교 화면](../../index.html) · [변경/원인/방지 기준](../../docs/USABILITY_15.md)

| 범위 | 결과 |
|---|---|
| 4종SaaS 기본/필터/빈 결과/초기화·5개 폭·2개 폭200% + 식당 복원 |${extra.passed}/${extra.total}|
| SaaS/식당 기능·모바일·두200% 확대·키보드·오류 복구 |${qa.passed}/${qa.total}|
| 합계 |${summary.total}/${summary.total}|
| 수정 전 페이지 보존 |5개 원문 해시 일치(동결 스타일 경로 치환을 되돌려 대조)|

툴바의 아래 간격20px은 결과 줄 표시 여부와 무관하게 유지한다. 필터 결과 줄이 보이면 그 줄과 목록 사이16px도 별도 제공한다. 모바일에서 표 헤더가 없으면 첫 업무 행, 빈 결과에서는 빈 결과 면의 실제 좌표로 판정한다. 상태별 간격·표시·업무 개수는 [추가 검사](spacing-and-restore-checks.json)에 있다. 예약 확인과 오류 복구는 [기능 검사](browser-checks.json)에 있다.

복원한 식당은 사진과 GNB/소개·메뉴별 선형 아이콘·예약 면을 포함한다. 신규 독립 생성이 아닌 승인안 복원이며, 과거 생성 결과와 이번 수정 검사를 구분한다. 실기기/브라우저 메뉴 확대는 별도다.

[식당 PC](previews/restaurant-pc.jpg) · [식당 모바일](previews/restaurant-mobile.jpg) · [SaaS PC](previews/saas-pc.jpg) · [SaaS 모바일](previews/saas-mobile.jpg)
`);console.log(JSON.stringify(summary));
