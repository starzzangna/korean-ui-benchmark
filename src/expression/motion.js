import {contentReveal} from './content-reveal.js';
const category=document.body.dataset.category,groups=[];
// 감상·선택·목록·신청의 읽는 리듬을 따로 정한다. 숫자는 이번 자료의 선택값이다.
function group(selector,role,options){const els=[...document.querySelectorAll(selector)];els.forEach(el=>{el.dataset.contentReveal='';el.dataset.revealRole=role;});groups.push({els,options});}
if(category==='portfolio')group('.r-studio-opening','work-scene',{distance:12,duration:880,fromOpacity:.85});
if(category==='professional'){group('.e-service-intro,.e-service-controls','service-choice',{distance:6,duration:420,fromOpacity:.9});group('.e-service-evidence','service-result',{distance:8,duration:520,fromOpacity:.8});}
if(category==='event'){group('.s-event-hero','event-scene',{distance:14,duration:800,fromOpacity:.8});group('.o-program-nav,#schedule-list','program',{distance:6,duration:560,fromOpacity:.85});}
group('.o-section-head','section-heading',{distance:6,duration:480,fromOpacity:.85});
group('.r-work-gallery>article','work-case',{distance:10,duration:700,fromOpacity:.8});
group('#request>div,#request>aside,#request>header,#request>form','request',{distance:8,duration:560,fromOpacity:.85});
const cleanup=groups.map(g=>contentReveal(g.els,g.options));window.addEventListener('pagehide',()=>cleanup.forEach(fn=>fn()),{once:true});
