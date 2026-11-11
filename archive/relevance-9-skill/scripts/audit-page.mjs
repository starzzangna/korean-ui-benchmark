import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {measureGroups,setTextScale,measureTextBounds,measureVisualBounds} from './layout-probes.js';

// 설치된 Playwright를 사용한다. 설치·서버 시작·폼 제출은 수행하지 않는다.
const args=process.argv.slice(2),value=(flag,fallback)=>{const i=args.indexOf(flag);return i<0?fallback:args[i+1];};
const url=value('--url'),outArg=value('--out');
if(!url||!outArg)throw Error('사용법: node audit-page.mjs --url http://... --out 결과폴더 [--contract JSON] [--require-contract] [--module package.json] [--browser chrome.exe] [--exercise-selects] [--text-scale]');
if(!['http:','https:'].includes(new URL(url).protocol))throw Error('http 또는 https 주소만 지원합니다.');
const req=createRequire(value('--module')?resolve(value('--module')):import.meta.url);
let chromium;try{({chromium}=req('playwright'));}catch{throw Error('설치된 Playwright를 찾지 못했습니다. --module에 Playwright를 resolve할 package.json을 지정하세요. 자동 설치하지 않습니다.');}
const contract=value('--contract')?JSON.parse(readFileSync(resolve(value('--contract')),'utf8')):null;
if(contract&&((contract.selects!==undefined&&!Array.isArray(contract.selects))||(contract.selects||[]).some(s=>!s.selector||!Array.isArray(s.options))||(contract.groups!==undefined&&!Array.isArray(contract.groups))||(contract.groups||[]).some(g=>!g.anchor||!g.group||!g.icon||!g.text)))throw Error('contract의 selects(selector/options) 또는 groups(anchor/group/icon/text)를 확인하세요.');
if(args.includes('--require-contract')&&(!contract||!['selects','groups','visualBounds'].some(k=>Array.isArray(contract[k])&&contract[k].length)))throw Error('완료 검증에 사용할 비어 있지 않은 독립 기대 계약이 필요합니다.');
if(args.includes('--exercise-selects')&&!contract?.selects?.length)throw Error('선택 실행에는 비어 있지 않은 selects 기대 계약이 필요합니다.');
for(const rule of contract?.selects||[]){
 if(!rule.options.length||rule.options.some(o=>o.value===undefined||String(o.value)===''||typeof o.label!=='string'||!o.label.trim()))throw Error('필수 옵션의 value/label 목록은 비어 있을 수 없습니다.');
 if(new Set(rule.options.map(o=>String(o.value))).size!==rule.options.length)throw Error('기대 옵션 value가 중복됐습니다.');
}
const out=resolve(outArg);mkdirSync(out,{recursive:true});
if(contract?.visualBounds!==undefined&&(!Array.isArray(contract.visualBounds)||contract.visualBounds.some(r=>!r.selector||!['x','both',undefined].includes(r.axis))))throw Error('visualBounds의 selector/axis(x|both)를 확인하세요.');
const browser=await chromium.launch({headless:true,...(value('--browser')?{executablePath:resolve(value('--browser'))}:{})});
const rows=[];
try{
 for(const width of [320,390,768,1440]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),runtimeErrors=[],moduleErrors=[],requests=[];
  page.on('pageerror',e=>runtimeErrors.push(e.message));
  // 모듈 MIME 차단은 pageerror 없이 콘솔에만 나타날 수 있다.
  page.on('console',message=>{if(message.type()==='error'&&/module script|MIME type/i.test(message.text()))moduleErrors.push(message.text());});
  page.on('requestfailed',r=>{const u=new URL(r.url());requests.push({url:u.origin+u.pathname,error:r.failure()?.errorText});});
  const response=await page.goto(url,{waitUntil:'load',timeout:30000});
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]));
  // 실제 스크롤로 지연 이미지/등장을 불러온다. 무한 페이지는 상한을 기록한다.
  let scanEnd=false;
  for(let i=0;i<40;i++){scanEnd=await page.evaluate(()=>{window.scrollBy(0,700);return scrollY+innerHeight>=document.documentElement.scrollHeight-2;});await page.waitForTimeout(60);if(scanEnd)break;}
  await page.waitForTimeout(200);await page.evaluate(()=>scrollTo(0,0));
  const dom=await page.evaluate(()=>{
   const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';};
   const name=e=>(e.getAttribute('aria-label')||[...(e.labels||[])].map(l=>l.textContent).join(' ')||(e.getAttribute('aria-labelledby')||'').split(/\s+/).map(id=>document.getElementById(id)?.textContent||'').join(' ')||e.textContent||e.getAttribute('title')||'').trim();
   return {
    overflow:document.documentElement.scrollWidth>innerWidth+1,
    scrollWidth:document.documentElement.scrollWidth,
    selects:[...document.querySelectorAll('select')].map(e=>({id:e.id,name:name(e),visible:visible(e),options:[...e.options].map(o=>({value:o.value,label:o.label.trim(),disabled:o.disabled||!!o.closest('optgroup[disabled]')}))})),
    unnamed:[...document.querySelectorAll('button,input:not([type=hidden]),select,textarea')].filter(e=>visible(e)&&!name(e)).map(e=>({tag:e.tagName,id:e.id})),
    images:[...document.images].map(e=>({src:e.getAttribute('src'),visible:visible(e),complete:e.complete,naturalWidth:e.naturalWidth,renderWidth:Math.round(e.getBoundingClientRect().width),alt:e.getAttribute('alt')})),
    controlAlignment:[...document.querySelectorAll('[data-ui-align="center"]')].filter(visible).map(e=>{const a=e.querySelector('svg')?.getBoundingClientRect(),b=e.querySelector('span')?.getBoundingClientRect();return {text:e.textContent.trim(),delta:a&&b?Math.abs(a.y+a.height/2-b.y-b.height/2):null};})
   };
  });
  const expectations=[];
  for(const rule of contract?.selects||[]){
   const loc=page.locator(rule.selector),count=await loc.count();
   if(count!==1){expectations.push({selector:rule.selector,passed:false,reason:'선택 대상 '+count+'개'});continue;}
   const actual=await loc.evaluate(e=>e instanceof HTMLSelectElement?[...e.options].filter(o=>o.value!==''&&!o.disabled&&!o.closest('optgroup[disabled]')).map(o=>({value:o.value,label:o.label.trim()})):null);
   const expected=rule.options.map(o=>({value:String(o.value),label:o.label.trim()}));
   const same=actual&&actual.length===expected.length&&expected.every(o=>actual.some(a=>a.value===o.value&&a.label===o.label));
   const branches=[];let selectionStatus=args.includes('--exercise-selects')?'not-run':'not-requested';
   if(args.includes('--exercise-selects')&&await loc.isVisible()&&await loc.isEnabled()){
    const old=await loc.inputValue();
    for(const option of expected){try{await loc.selectOption(option.value,{timeout:1500});branches.push({value:option.value,passed:await loc.inputValue()===option.value});}catch{branches.push({value:option.value,passed:false});}}
    // 상위 변경으로 예전 값이 사라질 수 있다. 복구 불가도 기록한다.
    try{await loc.selectOption(old,{timeout:1500});}catch{branches.push({restore:old,passed:false});}
    selectionStatus=branches.length===expected.length&&branches.every(b=>b.passed)?'passed':'failed';
   }
   expectations.push({selector:rule.selector,expected,actual,domPassed:!!same,selectionStatus,passed:!!same&&(!args.includes('--exercise-selects')||selectionStatus==='passed'),branches});
  }
  const fontEvidence=[];const cdp=await context.newCDPSession(page);
  await cdp.send('DOM.enable');await cdp.send('CSS.enable');const {root}=await cdp.send('DOM.getDocument');
  for(const selector of ['h1','body']){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector});if(nodeId){const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});fontEvidence.push({selector,fonts});}}
  await page.screenshot({path:resolve(out,`screen-${width}.png`),fullPage:true});
  const groupRules=(contract?.groups||[]).filter(g=>(g.minWidth??0)<=width&&(g.maxWidth??Infinity)>=width);
  const groups=await page.evaluate(measureGroups,groupRules),textScale=[];
  const visualRules=(contract?.visualBounds||[]).filter(r=>(r.minWidth??0)<=width&&(r.maxWidth??Infinity)>=width);
  const visualBounds=await page.evaluate(measureVisualBounds,visualRules);
  if(args.includes('--text-scale'))for(const lineHeight of [false,true]){
   await page.evaluate(setTextScale,{factor:2,lineHeight});
   const bounds=await page.evaluate(measureTextBounds),scaledGroups=await page.evaluate(measureGroups,groupRules);
   await page.screenshot({path:resolve(out,`text-${lineHeight?'font-line':'font'}-2x-${width}.png`),fullPage:true});
   const scaledVisual=await page.evaluate(measureVisualBounds,visualRules);
   textScale.push({method:lineHeight?'computed-font-and-line-2x':'computed-font-2x',...bounds,groups:scaledGroups,visualBounds:scaledVisual});
  }
  if(args.includes('--text-scale'))await page.evaluate(setTextScale,{factor:1});
  rows.push({width,httpStatus:response?.status(),scanEnd,...dom,expectations,groups,visualBounds,textScale,fontEvidence,runtimeErrors,moduleErrors,failedRequests:requests});await context.close();
 }
}finally{await browser.close();}
const groupFailed=g=>!g.measured||!g.horizontalPassed||!g.verticalPassed;
const visualFailed=v=>v.passed!==true;
const failed=rows.some(r=>r.httpStatus>=400||r.overflow||r.runtimeErrors.length||r.moduleErrors.length||r.unnamed.length||r.expectations.some(e=>!e.passed)||r.images.some(i=>i.complete&&!i.naturalWidth&&(i.src||i.visible))||r.groups.some(groupFailed)||r.visualBounds.some(visualFailed)||r.textScale.some(t=>!t.noOverflow||t.groups.some(groupFailed)||t.visualBounds.some(visualFailed)));
writeFileSync(resolve(out,'audit.json'),JSON.stringify({url,widths:[320,390,768,1440],contractProvided:!!contract,exercised:args.includes('--exercise-selects'),scope:'DOM·선택지·화면 증거. 신청/예약 제출과 동적 상태 조합·미적 평가는 별도 검사.',failed,rows},null,2));
console.log(JSON.stringify({failed,rows:rows.map(r=>({width:r.width,overflow:r.overflow,contractFailures:r.expectations.filter(x=>!x.passed).length,runtimeErrors:r.runtimeErrors.length,unnamed:r.unnamed.length})),out},null,2));if(failed)process.exitCode=1;
