// 상태 카드·메뉴와 네이티브 선택을 같은 갱신 경로로 연결한다.
const filter=document.querySelector('#filter');
document.querySelectorAll('[data-filter-state]').forEach(button=>button.addEventListener('click',()=>{
  filter.value=button.dataset.filterState;
  filter.dispatchEvent(new Event('change',{bubbles:true}));
}));
const toggle=document.querySelector('#nav-toggle'),sidebar=document.querySelector('.saas-sidebar');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));sidebar.classList.toggle('is-open',open)});
sidebar.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){toggle.setAttribute('aria-expanded','false');sidebar.classList.remove('is-open');toggle.focus()}});
