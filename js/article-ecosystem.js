/* BAGUSIN — ARTICLE KNOWLEDGE RELATIONSHIPS
   Editorial recommendations: curated IDs first, then taxonomy relevance.
*/
(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const R=window.BAGUSIN_SERVICE_REGISTRY;
 if(!R||!Array.isArray(R.articles))return;
 const path=location.pathname.replace(/\/$/,"");
 const isEnglish=path.startsWith("/en/");
 const article=R.articles.find(a=>a.status==="PUBLISHED"&&path.endsWith("/blog/"+a.slug)&&((String(a.language||"id").toLowerCase()==="en")===isEnglish));
 if(!article)return;
 const host=document.querySelector(".article-pro-footer")||document.querySelector("article");
 const archive="/bagusin/"+(isEnglish?"en/":"")+"blog/";
 const categoryLink=(value,kind)=>archive+"?"+kind+"="+encodeURIComponent(value);
 const categoryAnchor=document.querySelector(".article-pro-meta .article-category-link");
 const oldCategory=document.querySelector(".article-header__category");
 if(categoryAnchor){categoryAnchor.href=categoryLink(article.category||article.subcategory||"Blog","category");}
 if(oldCategory){
   oldCategory.classList.add("article-category-link");
   oldCategory.innerHTML="";
   const a=document.createElement("a");a.href=categoryLink(article.category||article.subcategory||"Blog","category");a.textContent=article.category||article.subcategory||"Blog";a.className="article-taxonomy-link";oldCategory.appendChild(a);
   const kind=document.createElement("span");kind.textContent=" · "+(article.type||"Article");oldCategory.appendChild(kind);
 }
 const tagHost=document.querySelector(".article-pro-footer .article-pro-tags")||document.querySelector(".article-labels .article-tags");
 if(tagHost){
   tagHost.replaceChildren();
   const terms=[article.category,article.subcategory,...(article.tags||[])].filter((v,i,a)=>v&&a.findIndex(x=>String(x).toLowerCase()===String(v).toLowerCase())===i).slice(0,7);
   terms.forEach((term,index)=>{const a=document.createElement("a");a.href=categoryLink(term,index<2?"category":"tag");a.textContent=term;tagHost.appendChild(a);});
 }
 const footerLabel=document.querySelector(".article-pro-footer>div>span");
 if(footerLabel)footerLabel.textContent=isEnglish?"Category & labels":"Kategori & label";
 const footerButton=document.querySelector(".article-pro-footer>.button");
 if(footerButton){footerButton.textContent=isEnglish?"More from Blog":"Artikel lainnya";footerButton.href=archive;}

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
 const serviceIds=new Set([...(article.services||[]),...(article.relatedServices||[])]);
 const services=R.services.filter(s=>serviceIds.has(s.id));
 if(!related.length&&!services.length)return;
 const section=document.createElement("section");
 section.className="article-ecosystem";
 section.setAttribute("aria-labelledby","article-ecosystem-title");
 section.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">'+(isEnglish?"Continue reading":"Bacaan lanjutan")+'</span><h2 id="article-ecosystem-title">'+(isEnglish?"Related articles and next steps":"Artikel terkait dan langkah berikutnya")+'</h2><p>'+(isEnglish?"Explore more writing connected to this topic.":"Temukan artikel lain dengan kategori atau topik yang berhubungan.")+'</p></div>'+
 (related.length?'<div class="article-ecosystem__group"><span class="section-kicker">'+(isEnglish?"Related articles":"Artikel terkait")+'</span><div class="article-ecosystem__links">'+related.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt||a.topic||a.category||"Baca artikel terkait")+'</span></a>').join("")+'</div></div>':"")+
 (services.length?'<div class="article-ecosystem__group"><span class="section-kicker">'+(isEnglish?"Related services":"Layanan terkait")+'</span><div class="article-ecosystem__links">'+services.map(s=>'<a href="'+esc(s.url)+'"><strong>'+esc(s.name)+'</strong><span>'+esc(s.purpose)+'</span></a>').join("")+'</div></div>':"");
 host.parentNode.insertBefore(section,host);
});
})();