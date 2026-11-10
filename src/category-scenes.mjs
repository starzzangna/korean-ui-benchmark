// 같은 자료와 행동을 조건별 구도로 조합한다. 특정 군의 구도·색을 공통 정답으로 두지 않는다.
export function renderScene(d,t,g,parts){
 const {documentArt,poster,link,img}=parts;
 const targets={brand:'collection',local:'request',restaurant:'collection',portfolio:'collection',professional:'services',event:'program'};
 const actions={brand:'물건 살펴보기',local:'수업 신청',restaurant:'메뉴 살펴보기',portfolio:'작업 살펴보기',professional:'서비스 살펴보기',event:'프로그램 보기'};
 const facts={brand:'노트·달력·기록 도구 · 세 가지 콘셉트',local:'2027년 3월 수업 · 1–4명 · 42,000원부터',restaurant:'네 가지 메뉴 · 8,000원부터',portfolio:'',professional:'',event:'2027. 03. 27–28 · 토크 패스 15,000원부터'};
 const copy=`<div class="hero-copy"><p class="eyebrow">${d.latin}</p><h1>${d.headline}</h1><p class="hero-description">${d.intro}</p>${facts[t]?`<p class="hero-fact">${facts[t]}</p>`:''}${link(actions[t],'#'+targets[t])}</div>`;
 const works=(count=2)=>`<div class="hero-works">${d.items.slice(0,count).map(w=>`<button class="hero-work card" data-open="${w.id}" aria-label="${w.title} 상세 보기">${img(w.image,w.title+' 가상 작품 콘셉트','','artworks')}<span>${w.title}<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg></span></button>`).join('')}</div>`;
 const objects=()=>`<div class="scene-objects">${d.items.map(w=>`<button class="scene-object" data-open="${w.id}" aria-label="${w.title} 상세 보기">${img(w.image,w.title+' 가상 상품 콘셉트','','artworks')}<span>${w.title}</span></button>`).join('')}</div>`;
 const alt={brand:'기록 도구를 놓은 책상의 분위기 참고',local:'손으로 흙을 빚는 과정 참고',restaurant:'곡물과 과일을 담은 아침 식탁 참고'};
 const standardMedia=()=>t==='professional'?documentArt():t==='event'?poster():t==='portfolio'?works(g==='none'?1:2):img(d.photo,alt[t],'hero-photo');
 const media=body=>`<div class="hero-media">${body}</div>`;
 const plans={
  none:()=>copy+media(standardMedia()),
  a:()=>({brand:()=>copy+media(objects()),local:()=>media(standardMedia())+copy,restaurant:()=>media(standardMedia())+copy,portfolio:()=>media(works())+copy,professional:()=>media(documentArt())+copy,event:()=>media(poster())+copy}[t])(),
  b:()=>({brand:()=>media(standardMedia())+copy,local:()=>copy+media(standardMedia()),restaurant:()=>media(standardMedia())+copy,portfolio:()=>copy+media(works()),professional:()=>copy+media(documentArt()),event:()=>copy+media(poster())}[t])(),
  own:()=>({brand:()=>media(standardMedia())+copy,local:()=>media(standardMedia())+copy,restaurant:()=>media(standardMedia())+copy,portfolio:()=>copy+media(works()),professional:()=>copy+media(documentArt()),event:()=>copy+media(poster())}[t])()
 };
 const note=t==='local'?'<aside class="intro-note"><div><span class="eyebrow">수업 안내</span><p>어떤 그릇을 만들고 싶은지, 수업부터 골라보세요.</p></div><span>2027. 03 · 일정 데모</span></aside>':'';
 return `<section class="hero hero-${t} hero-${g} scene-${t}-${g} reveal" aria-label="${d.name} 소개">${plans[g]()}</section>${note}`;
}
