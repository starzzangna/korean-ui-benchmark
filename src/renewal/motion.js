import {contentReveal} from '../craft/content-reveal.js';
const g=document.body.dataset.group,t=document.body.dataset.category;
// 업무 화면의 입력은 즉시 반영하고, 소개 화면은 실제 콘텐츠 묶음에만 진입 효과를 둔다.
if(t!=='saas'){
 const section=[...document.querySelectorAll('.r14-hero,.r14-section')].filter(e=>!e.querySelector('.r14-products,.r14-works,.r14-courses'));
 const cards=[...document.querySelectorAll('.r14-products>article,.r14-works>article,.r14-courses>article')];
 section.forEach(e=>e.dataset.contentReveal='');cards.forEach(e=>e.dataset.contentReveal='');
 const cleanup=contentReveal(section,{distance:g==='b'?22:t==='professional'?6:12,duration:g==='b'?850:t==='professional'?480:780,fromOpacity:g==='b'?.55:.85});
 // 긴 목록은 부모 구간 대신 개별 항목의 진입을 사용한다.
 const cleanCards=contentReveal(cards,{distance:8,duration:620,fromOpacity:.85});window.addEventListener('pagehide',()=>{cleanup();cleanCards()},{once:true});
}
