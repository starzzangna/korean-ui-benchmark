import {readFileSync,writeFileSync,mkdirSync,existsSync,statSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

// 로컬 파일만 읽는다. 원격 다운로드나 권리 판정을 수행하지 않는다.
const args=process.argv.slice(2),input=args[0],outIndex=args.indexOf('--out');
if(!input||outIndex<0||!args[outIndex+1])throw Error('사용법: node prepare-assets.mjs ASSETS.json --out 결과폴더');
const manifest=resolve(input),out=resolve(args[outIndex+1]),data=JSON.parse(readFileSync(manifest,'utf8'));
if(![1,2].includes(data.schemaVersion)||!Array.isArray(data.assets))throw Error('schemaVersion:1 또는2와 assets 배열이 필요합니다.');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ids=new Set(),rows=data.assets.map(a=>{
  const errors=[];
  for(const key of ['id','path','kind','role','source','creator','license'])if(typeof a[key]!=='string'||!a[key].trim())errors.push(key+' 누락');
  if(ids.has(a.id))errors.push('id 중복');ids.add(a.id);
  if(!['image','font','icon','video','document'].includes(a.kind))errors.push('kind 오류');
  if(a.kind==='image'&&!['actual','reference','generated'].includes(a.authenticity))errors.push('이미지 실제/참고/생성 구분 누락');
  if(a.usedIn!==undefined&&(!Array.isArray(a.usedIn)||a.usedIn.some(u=>!u||['section','role','newInformation'].some(k=>typeof u[k]!=='string'||!u[k].trim()))))errors.push('usedIn의 구간·역할·새 정보 누락');
  if(a.mobileEdit!==undefined&&(!a.mobileEdit||['focalPoint','safeArea','fallback'].some(k=>typeof a.mobileEdit[k]!=='string'||!a.mobileEdit[k].trim())))errors.push('mobileEdit의 피사체·안전 영역·대안 누락');
  const file=typeof a.path==='string'&&!/^[a-z]+:/i.test(a.path)?resolve(dirname(manifest),a.path):null;
  let bytes=null,sha256=null;
  if(!file||!existsSync(file)||!statSync(file).isFile())errors.push('로컬 파일 없음');
  else{const content=readFileSync(file);bytes=content.length;sha256=createHash('sha256').update(content).digest('hex');if(a.sha256&&a.sha256!==sha256)errors.push('해시 불일치');}
  return {...a,file,bytes,sha256,errors};
});
mkdirSync(out,{recursive:true});
writeFileSync(resolve(out,'asset-report.json'),JSON.stringify({manifest,empty:rows.length===0,rows},null,2));
writeFileSync(resolve(out,'contact-sheet.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>에셋 검토</title><style>body{font:16px/1.6 system-ui;margin:24px;color:#222;background:#fafafa}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:24px}figure{margin:0;border:1px solid #aaa;padding:16px;overflow-wrap:anywhere}img{width:100%;height:260px;object-fit:contain;background:#eee}p{margin:.5em 0}</style><h1>에셋 검토</h1><p>파일 존재·해시 검사이며 권리·사진 적합성·해상도·크롭 승인은 직접 확인합니다. 원격 자료를 불러오지 않습니다.</p><main>${rows.map(a=>`<figure>${a.kind==='image'&&a.file&&!a.errors.includes('로컬 파일 없음')?`<img src="${escape(pathToFileURL(a.file).href)}" alt="${escape(a.alt||a.role)}">`:''}<figcaption><strong>${escape(a.id)}</strong><p>${escape(a.role)} · ${escape(a.authenticity||a.kind)}</p><p>${escape(a.path)} · ${a.bytes??'?'} bytes</p><p>피사체: ${escape(a.subject||'미기록 · 육안 확인')}<br>촬영군: ${escape(a.shootGroup||'해당 여부 확인')}</p><p>${escape((Array.isArray(a.usedIn)?a.usedIn:[]).filter(u=>u&&typeof u==='object').map(u=>u.section+' / '+u.role+' / '+u.newInformation).join(' · '))}</p><p>모바일: ${escape(a.mobileEdit?.focalPoint||'직접 크롭 확인')}<br>${escape(a.mobileEdit?.safeArea)}<br>${escape(a.mobileEdit?.fallback)}</p><p>${escape(a.source)}<br>${escape(a.creator)} · ${escape(a.license)}</p><p>${escape(a.errors.join(' / ')||'파일 검사 통과')}</p></figcaption></figure>`).join('')||'<p>등록된 에셋이 없습니다. entryGuide는 자료로 집계하지 않습니다.</p>'}</main></html>`);
const failed=rows.filter(a=>a.errors.length).length;console.log(JSON.stringify({assets:rows.length,failed,out},null,2));if(failed)process.exitCode=1;
