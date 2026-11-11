import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'reports/refined-3');
fs.mkdirSync(out,{recursive:true});
const file=path.join(out,'baseline.json');if(fs.existsSync(file))throw Error('이미 기록한 기준본을 덮어쓰지 않습니다.');
const files=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else files.push(p);}}
for(const name of ['results','src/editions','shared'])walk(path.join(root,name));
files.push(...['src/app.js','src/saas-ui.js','src/render.mjs','src/viewer.js','index.html'].map(p=>path.join(root,p)));
const entries=files.map(p=>({path:path.relative(root,p).replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')}));
fs.writeFileSync(file,JSON.stringify({description:'개선 직전 28개 시안과 실행 자료. 새 개선본은 다른 경로에 생성한다.',files:entries},null,2));
const snapshot=path.join(root,'archive/editorial-2-skill');if(fs.existsSync(snapshot))throw Error('기존 스킬 보존 경로가 있습니다.');fs.cpSync(path.join(root,'skills/korean-ui-design'),snapshot,{recursive:true});
console.log(JSON.stringify({baselineFiles:entries.length,sites:28,skillSnapshot:true}));
