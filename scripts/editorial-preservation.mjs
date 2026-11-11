import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..'),archive=path.join(root,'archive/before-editorial-rebuild');
// 보존 문서가 참조하는 더 이전 비교본도 같은 상대 경로에서 열 수 있게 제공한다.
for(const e of fs.readdirSync(path.join(root,'archive'),{withFileTypes:true}))if(e.isDirectory()&&e.name!=='before-editorial-rebuild'){
 const target=path.join(archive,'archive',e.name);if(!fs.existsSync(target))fs.cpSync(path.join(root,'archive',e.name),target,{recursive:true});
}
const original=JSON.parse(fs.readFileSync(path.join(archive,'preservation.json')));
for(const f of original.files)assert.equal(createHash('sha256').update(fs.readFileSync(path.join(archive,f.path))).digest('hex'),f.sha256,f.path);
console.log(JSON.stringify({preservedFiles:original.files.length,exactBytes:true,sites:28}));
