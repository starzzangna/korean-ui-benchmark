import fs from 'node:fs';
import path from 'node:path';
import {render,groups,topics} from '../src/render.mjs';
const root=path.resolve(import.meta.dirname,'..'),data=JSON.parse(fs.readFileSync(path.join(root,'shared/data.json')));
for(const g of Object.keys(groups))for(const t of Object.keys(topics)){
 const dir=path.join(root,'results',g,t);fs.mkdirSync(dir,{recursive:true});let html=render(data[t],t,g);
 if(g==='b'){
  for(const name of ['functional.css','b.css'])html=html.replace(`<link rel="stylesheet" href="../../../src/editions/${name}?v=editorial-2">`,'<style>'+fs.readFileSync(path.join(root,'src/editions',name),'utf8')+'</style>');
  for(const name of ['app.js','saas-ui.js'])html=html.replace(`<script type="module" src="../../../src/${name}"></script>`,'<script type="module">'+fs.readFileSync(path.join(root,'src',name),'utf8')+'</script>');
 }
 fs.writeFileSync(path.join(dir,'index.html'),html);
}
console.log('독립 구성 파일로 7카테고리×4군 28개 시안 빌드');
