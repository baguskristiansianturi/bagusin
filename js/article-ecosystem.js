/* BAGUSIN — ARTICLE KNOWLEDGE RELATIONSHIPS */
(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const R=window.BAGUSIN_SERVICE_REGISTRY; if(!R)return;
 const article=R.articles.find(a=>a.status==="PUBLISHED"&&location.pathname.replace(/\/$/,"").endsWith("/blog/"+a.slug));
 if(!article)return;
 const host=document.querySelector(".article-pro-footer")||document.querySelector("article");
 if(!host)return;
 const related=R.articles.filter(a=>a.status==="PUBLISHED"&&(article.relatedArticles||[]).includes(a.id));
 const services=R.services.filter(s=>(article.services||[]).includes(s.id));
 if(!related.length&&!services.length)return;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
 const section=document.createElement("section"); section.className="article-ecosystem"; section.setAttribute("aria-labelledby","article-ecosystem-title");
 section.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">Keep exploring</span><h2 id="article-ecosystem-title">Related knowledge</h2><p>Explore this topic further without leaving the context of the article.</p></div>'+
 (services.length?'<div class="article-ecosystem__group"><span class="section-kicker">Related services</span><div class="article-ecosystem__links">'+services.map(s=>'<a href="'+esc(s.url)+'"><strong>'+esc(s.name)+'</strong><span>'+esc(s.purpose)+'</span></a>').join("")+'</div></div>':"")+
 (related.length?'<div class="article-ecosystem__group"><span class="section-kicker">Related articles</span><div class="article-ecosystem__links">'+related.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt)+'</span></a>').join("")+'</div></div>':"");
 host.parentNode.insertBefore(section,host);
});
})();