/* BAGUSIN — shared blog taxonomy, archive filtering and article cards */
(function(){
 "use strict";
 const ready=fn=>document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn,{once:true}):fn();
 ready(function(){
  const root=document.querySelector("[data-blog-taxonomy]");
  if(!root)return;
  const R=window.BAGUSIN_SERVICE_REGISTRY;
  if(!R||!Array.isArray(R.articles))return;
  const english=document.documentElement.lang.toLowerCase().startsWith("en");
  const archive="/bagusin/"+(english?"en/":"")+"blog/";
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const norm=v=>String(v??"").trim().toLocaleLowerCase();
  const published=R.articles.filter(a=>a.status==="PUBLISHED"&&(String(a.language||"id").toLowerCase()===(english?"en":"id")));
  const params=new URLSearchParams(location.search);
  let category=params.get("category")||"",tag=params.get("tag")||"",query=params.get("q")||"";
  const filters=root.querySelector("[data-taxonomy-filters]");
  const grid=root.querySelector("[data-taxonomy-grid]");
  const search=root.querySelector("[data-taxonomy-search]");
  const count=root.querySelector("[data-taxonomy-count]");
  const title=root.querySelector("[data-taxonomy-title]");
  const categories=[...new Set(published.map(a=>a.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  function setParam(kind,value){
   const next=new URLSearchParams(location.search);
   if(value)next.set(kind,value);else next.delete(kind);
   const url=archive+(next.toString()?"?"+next.toString():"");
   location.href=url;
  }
  function makeFilter(label,kind,value,active){
   const b=document.createElement("button");b.type="button";b.className="blog-taxonomy__filter";b.textContent=label;b.setAttribute("aria-pressed",String(active));
   b.addEventListener("click",()=>{category=kind==="category"?value:"";tag=kind==="tag"?value:"";setParam(kind,value);});
   filters.appendChild(b);
  }
  filters.replaceChildren();
  makeFilter(english?"All articles":"Semua artikel","category","",!category&&!tag);
  categories.forEach(c=>makeFilter(c,"category",c,norm(category)===norm(c)));
  const commonTags=[...new Set(published.flatMap(a=>a.tags||[]))].filter(t=>t).sort((a,b)=>a.localeCompare(b)).slice(0,12);
  if(!category&&!tag){commonTags.slice(0,6).forEach(t=>makeFilter("#"+t,"tag",t,false));}
  if(search){search.value=query;search.addEventListener("input",()=>{query=search.value;render();});}
  function render(){
   const list=published.filter(a=>{
    const vals=[a.category,a.subcategory,a.topic,...(a.tags||[])].map(norm);
    const categoryMatch=!category||norm(a.category)===norm(category)||norm(a.subcategory)===norm(category);
    const tagMatch=!tag||vals.includes(norm(tag));
    const haystack=norm([a.title,a.excerpt,a.category,a.subcategory,a.topic,...(a.tags||[])].join(" "));
    return categoryMatch&&tagMatch&&(!query||haystack.includes(norm(query)));
   });
   grid.replaceChildren();
   if(!list.length){const empty=document.createElement("p");empty.className="blog-taxonomy__empty";empty.textContent=english?"No articles match these filters yet. Try another category or label.":"Belum ada artikel yang cocok dengan filter ini. Coba kategori atau label lain.";grid.appendChild(empty);}
   list.forEach(a=>{
    const card=document.createElement("article");card.className="blog-taxonomy-card";
    const labels=document.createElement("div");labels.className="blog-taxonomy-card__labels";
    const cat=document.createElement("a");cat.className="blog-taxonomy-card__category";cat.href=archive+"?category="+encodeURIComponent(a.category||"");cat.textContent=a.category|| (english?"Article":"Artikel");labels.appendChild(cat);
    if(a.subcategory){const sub=document.createElement("a");sub.className="blog-taxonomy-card__category";sub.href=archive+"?category="+encodeURIComponent(a.subcategory);sub.textContent=a.subcategory;labels.appendChild(sub);}
    const h=document.createElement("h3");const link=document.createElement("a");link.href=a.url;link.textContent=a.title;h.appendChild(link);
    const p=document.createElement("p");p.textContent=a.excerpt||a.topic||"";
    const tags=document.createElement("div");tags.className="blog-taxonomy-card__tags";
    (a.tags||[]).slice(0,4).forEach(t=>{const l=document.createElement("a");l.href=archive+"?tag="+encodeURIComponent(t);l.textContent="#"+t;tags.appendChild(l);});
    const action=document.createElement("a");action.className="blog-taxonomy-card__action";action.href=a.url;action.textContent=english?"Read article →":"Baca artikel →";
    card.append(labels,h,p,tags,action);grid.appendChild(card);
   });
   count.textContent=english?(list.length+" article"+(list.length===1?"":"s")+" shown"):(list.length+" artikel ditampilkan");
   if(title)title.textContent=category||tag?(english?"Articles: ":"Artikel: ")+(category||("#"+tag)):(english?"All articles":"Semua artikel");
   const page=document.querySelector(".blog-page");
   if(page&&(category||tag)){page.classList.add("is-taxonomy-filtered");}
   else if(page){page.classList.remove("is-taxonomy-filtered");}
  }
  render();
 });
})();