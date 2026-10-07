/* BAGUSIN — UNIVERSAL SEARCH INDEX
   Groups services, articles, guides, portfolio and case studies.
   Static-site friendly: no backend required.
*/
(function(){
"use strict";
const R=window.BAGUSIN_SERVICE_REGISTRY;
if(!R)return;
const base="/bagusin/";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const normalize=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"");
const tokens=q=>normalize(q).split(/\s+/).map(x=>x.trim()).filter(Boolean);
const score=(item,q)=>{
 const hay=normalize([item.title,item.name,item.category,item.subcategory,item.topic,item.type,item.intent,item.description,item.problem,item.purpose,item.complexity,...(item.aliases||[]),...(item.tags||[]),...(item.subservices||[]),...(item.relatedServices||[]),...(item.services||[])].join(" "));\n const phrase=normalize(q).trim();\n const aliasBoost=(item.aliases||[]).some(a=>phrase.includes(normalize(a))||normalize(a).includes(phrase))?3:0;
 const ts=tokens(q); if(!ts.length)return 0;
 return aliasBoost+ts.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
};
function serviceItems(){return R.services.map(s=>({kind:"Services",title:s.name,category:s.category,type:"Service",description:s.purpose,problem:s.problem,purpose:s.purpose,complexity:s.complexity,status:s.status,aliases:s.aliases,subservices:s.subservices,url:s.url,id:s.id}));}
function articleItems(){return R.articles.filter(a=>a.status!=="PLANNED").map(a=>({...a,kind:a.type==="Guide"?"Guides":"Articles",description:a.topic+" · "+a.intent,url:a.url}));}
function staticItems(){
 return [
  {kind:"Portfolio",title:"Portfolio",category:"Work",type:"Portfolio",description:"Projects, concepts and experiments.",aliases:["portfolio","project","case study"],url:base+"portfolio/"},
  {kind:"Portfolio",title:"Bagus Dev Studio",category:"Portfolio · Project",type:"Project",description:"Digital product and service studio project.",aliases:["website","software","studio"],url:base+"portfolio/"},
  {kind:"Portfolio",title:"Bagus Load & Delivery",category:"Portfolio · Experiment",type:"Experiment",description:"Marketplace and coordinated delivery experiment.",aliases:["marketplace","construction","delivery","software"],url:base+"portfolio/"},
  {kind:"Guides",title:"How to choose the right digital service",category:"Guides",type:"Guide",description:"A decision-oriented guide for identifying the problem before choosing a service.",aliases:["help me choose","not sure","service"],url:base+"work/"},
  {kind:"Services",title:"Work With Me",category:"Work",type:"Service hub",description:"Project-based services and a guided path from need to project.",aliases:["services","work","jasa"],url:base+"work/"}
 ];
}
function all(){return [...serviceItems(),...articleItems(),...staticItems()]}
const form=document.getElementById("search-page-form"),input=document.getElementById("page-search-input"),results=document.getElementById("search-results"),empty=document.getElementById("search-empty"),count=document.getElementById("search-results-count"),heading=document.getElementById("search-results-title");
if(!form||!input||!results)return;
function render(q){
 const found=all().map(x=>({...x,_score:score(x,q)})).filter(x=>!q||x._score>0).sort((a,b)=>b._score-a._score);
 const groups=["Services","Articles","Guides","Portfolio","Case Studies"];
 results.innerHTML="";
 groups.forEach(group=>{
  const list=found.filter(x=>x.kind===group); if(!list.length)return;
  const section=document.createElement("section"); section.className="search-group"; section.setAttribute("aria-labelledby","search-"+group.toLowerCase().replace(/\s+/g,"-"));
  section.innerHTML='<div class="search-group__header"><span class="section-kicker">'+esc(group)+'</span><h3 id="search-'+group.toLowerCase().replace(/\s+/g,"-")+'">'+list.length+" result"+(list.length===1?"":"s")+'</h3></div><div class="search-group__grid"></div>';
  const grid=section.querySelector(".search-group__grid");
  list.slice(0,8).forEach(item=>{
   const article=document.createElement("article"); article.className="search-result";
   const status=item.status&&item.status!=="AVAILABLE"?'<span class="search-result__status">'+esc(item.status.replace("_"," "))+"</span>":"";
   article.innerHTML='<div class="search-result__meta"><span class="search-result__category">'+esc(item.category||item.topic||"BagusIn")+'</span><span class="search-result__type">'+esc(item.type||"Result")+'</span>'+status+'</div><h4><a href="'+esc(item.url)+'">'+esc(item.title||item.name)+'</a></h4><p>'+esc(item.description||item.purpose||"")+'</p><a class="search-result__link" href="'+esc(item.url)+'">Explore <span aria-hidden="true">→</span></a>';
   grid.appendChild(article);
  });
  results.appendChild(section);
 });
 empty.hidden=found.length>0; results.hidden=found.length===0;
 count.textContent=q?found.length+" hasil untuk “"+q+"”":found.length+" item tersedia";
 heading.textContent=q?"Hasil pencarian":"Explore BagusIn";
}
form.addEventListener("submit",e=>{e.preventDefault();const q=input.value.trim();location.href=q?base+"search/?q="+encodeURIComponent(q):base+"search/"});
document.querySelectorAll("[data-page-suggestion]").forEach(b=>b.addEventListener("click",()=>{input.value=b.dataset.pageSuggestion||"";form.requestSubmit()}));
const q=new URLSearchParams(location.search).get("q")?.trim()||"";input.value=q;render(q);
})();
