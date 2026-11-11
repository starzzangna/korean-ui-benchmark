import {contentReveal} from './content-reveal.js';
// 읽는 단위에 맞춰 선택하고 배경이나 조작 중인 입력을 따로 움직이지 않는다.
const category=document.body.dataset.category;
const entry={brand:'.r-brand-opening',local:'.o-local-opening',restaurant:'.s-dining-copy',portfolio:'.r-studio-opening',professional:'.e-service-intro',event:'.s-event-hero'}[category];
const selectors=[entry,'.o-section-head','.e-service-controls','.e-service-evidence','.r-product-gallery>article','.o-class-rows>article','.r-work-gallery>article','.o-menu-list>article','#request>div,#request>aside,#request>header,#request>form','.o-brand-end'].filter(Boolean);
const elements=[...new Set(selectors.flatMap(s=>[...document.querySelectorAll(s)]))].filter(el=>!selectors.some(s=>el.parentElement?.closest(s)));
elements.forEach(el=>el.dataset.contentReveal='');
const cleanup=contentReveal(elements);window.addEventListener('pagehide',cleanup,{once:true});
