import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..'),out=path.join(root,'archive/before-editorial-rebuild');
const previous=fs.readdirSync(path.join(root,'archive'),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=='before-editorial-rebuild').map(e=>e.name);
if(fs.existsSync(out))throw new Error('이미 보존한 비교본을 덮어쓰지 않습니다.');
fs.mkdirSync(out,{recursive:true});
// 참조 경로를 바꾸지 않도록 실행 자원을 같은 상대 구조로 복사한다.
for(const name of ['src','shared','results','docs','reports','skills','index.html','README.md'])fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
for(const name of previous)fs.cpSync(path.join(root,'archive',name),path.join(out,'archive',name),{recursive:true});
const entries=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else entries.push({path:path.relative(out,p).replaceAll('\\','/'),sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});}}
walk(out);fs.writeFileSync(path.join(out,'preservation.json'),JSON.stringify({description:'새 독립 레이아웃 제작 직전 실행 파일·자료·비교 기록의 원본 바이트',files:entries},null,2));
console.log(JSON.stringify({preservedFiles:entries.length,sites:28}));
