/* BAGUSIN — ARTICLE KNOWLEDGE RELATIONSHIPS
   Editorial recommendations: curated IDs first, then taxonomy relevance.
*/
(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const R=window.BAGUSIN_SERVICE_REGISTRY;
 if(!R||!Array.isArray(R.articles))return;
 const path=location.pathname.replace(/\/$/,"");
 const article=R.articles.find(a=>a.status==="PUBLISHED"&&path.endsWith("/blog/"+a.slug));
 if(!article)return;
 const host=document.querySelector(".article-pro-footer")||document.querySelector("article");
 if(!host)return;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
 const norm=v=>String(v??"").trim().toLowerCase();
 const values=a=>[a.category,a.subcategory,a.topic,...(a.tags||[])].map(norm).filter(Boolean);
 const current=new Set(values(article));
 const curated=(article.relatedArticles||[]).map(id=>R.articles.find(a=>a.id===id&&a.status==="PUBLISHED"&&a.id!==article.id)).filter(Boolean);
 const chosen=new Set(curated.map(a=>a.id));
 const language=norm(article.language||"id");
 const ranked=R.articles.filter(a=>a.status==="PUBLISHED"&&a.id!==article.id&&!chosen.has(a.id)&&norm(a.language||"id")===language)
  .map(a=>({a,score:values(a).reduce((sum,v)=>sum+(current.has(v)?(v===norm(a.category)||v===norm(article.category)?3:1):0),0)}))
  .filter(x=>x.score>0).sort((x,y)=>y.score-x.score||String(x.a.title).localeCompare(String(y.a.title))).map(x=>x.a);
 const related=[...curated,...ranked].slice(0,3);
 const services=R.services.filter(s=>(article.services||article.relatedServices||[]).includes(s.id));
 if(!related.length&&!services.length)return;
 const section=document.createElement("section");
 section.className="article-ecosystem";
 section.setAttribute("aria-labelledby","article-ecosystem-title");
 section.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">Bacaan lanjutan</span><h2 id="article-ecosystem-title">Lanjutkan penjelajahan</h2><p>Artikel dan layanan yang berhubungan dengan topik ini.</p></div>'+
 (related.length?'<div class="article-ecosystem__group"><span class="section-kicker">Artikel terkait</span><div class="article-ecosystem__links">'+related.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt||a.topic||a.category||"Baca artikel terkait")+'</span></a>').join("")+'</div></div>':"")+
 (services.length?'<div class="article-ecosystem__group"><span class="section-kicker">Layanan terkait</span><div class="article-ecosystem__links">'+services.map(s=>'<a href="'+esc(s.url)+'"><strong>'+esc(s.name)+'</strong><span>'+esc(s.purpose)+'</span></a>').join("")+'</div></div>':"");
 host.parentNode.insertBefore(section,host);
});
})();