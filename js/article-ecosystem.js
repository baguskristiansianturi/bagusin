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
 if(!document.querySelector(".article-share-tools")){
  const share=document.createElement("section");
  share.className="article-share-tools";
  share.setAttribute("aria-label","Bagikan artikel");
  share.innerHTML='<span class="article-share-tools__label">Bagikan tulisan ini</span><div class="article-share-tools__buttons"><button type="button" data-article-share="whatsapp">◉ WhatsApp</button><button type="button" data-article-share="facebook">f Facebook</button><button type="button" data-article-share="x">𝕏 X</button><button type="button" data-article-share="linkedin">in LinkedIn</button><button type="button" data-article-share="copy">↗ Salin tautan</button></div>';
  host.parentNode.insertBefore(share,host);
  share.addEventListener("click",async function(event){
   const button=event.target.closest("[data-article-share]");if(!button)return;
   const url=location.href.split("#")[0],title=document.querySelector("h1")?.textContent||document.title,network=button.dataset.articleShare;
   const links={whatsapp:"https://wa.me/?text="+encodeURIComponent(title+" "+url),facebook:"https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url),x:"https://x.com/intent/post?text="+encodeURIComponent(title)+"&url="+encodeURIComponent(url),linkedin:"https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(url)};
   if(network==="copy"){try{await navigator.clipboard.writeText(url);button.textContent="✓ Tautan tersalin";}catch(_){const field=document.createElement("textarea");field.value=url;field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();try{document.execCommand("copy");button.textContent="✓ Tautan tersalin";}catch(__){button.textContent="Salin gagal";}field.remove();}return;}
   if(links[network])window.open(links[network],"_blank","noopener,noreferrer,width=720,height=640");
  });
 }
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
 section.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">Bacaan lanjutan</span><h2 id="article-ecosystem-title">Lanjutkan penjelajahan</h2><p>Artikel dan layanan yang berhubungan dengan topik ini.</p></div>'+
 (related.length?'<div class="article-ecosystem__group"><span class="section-kicker">Artikel terkait</span><div class="article-ecosystem__links">'+related.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt||a.topic||a.category||"Baca artikel terkait")+'</span></a>').join("")+'</div></div>':"")+
 (services.length?'<div class="article-ecosystem__group"><span class="section-kicker">Layanan terkait</span><div class="article-ecosystem__links">'+services.map(s=>'<a href="'+esc(s.url)+'"><strong>'+esc(s.name)+'</strong><span>'+esc(s.purpose)+'</span></a>').join("")+'</div></div>':"");
 host.parentNode.insertBefore(section,host);
});
})();