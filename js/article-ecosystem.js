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
  share.innerHTML='<span class="article-share-tools__label">Bagikan artikel</span><div class="article-share-tools__buttons"><button type="button" data-article-share="whatsapp" aria-label="Bagikan melalui WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.1-4a8.2 8.2 0 1 1 15.1-4.3Z"></path><path d="M9 8.5c.3 2.5 2 4.3 4.5 5l1.2-1.1 2 1c-.2 1.4-1.2 2.2-2.7 2-3.6-.6-6.7-3.6-7-6.6-.1-1.2.6-2 1.8-2.1l.9 1.8-.7 1Z"></path></svg><span data-share-label>WhatsApp</span></button><button type="button" data-article-share="facebook" aria-label="Bagikan melalui Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H8v3h2.6v8"></path></svg><span data-share-label>Facebook</span></button><button type="button" data-article-share="x" aria-label="Bagikan melalui X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 4 14 16M19 4 5 20"></path><path d="M5 4h4l10 16h-4"></path></svg><span data-share-label>X</span></button><button type="button" data-article-share="linkedin" aria-label="Bagikan melalui LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5v.1M10 19v-6a3 3 0 0 1 6 0v6M10 10v9"></path><path d="M3 9h4M3 19h4"></path></svg><span data-share-label>LinkedIn</span></button><button type="button" data-article-share="copy" aria-label="Salin tautan artikel"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg><span data-share-label>Salin tautan</span></button></div>';
  host.parentNode.insertBefore(share,host);
  share.addEventListener("click",async function(event){
   const button=event.target.closest("[data-article-share]");if(!button)return;
   const url=location.href.split("#")[0],title=document.querySelector("h1")?.textContent||document.title,network=button.dataset.articleShare;
   const links={whatsapp:"https://wa.me/?text="+encodeURIComponent(title+" "+url),facebook:"https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url),x:"https://x.com/intent/post?text="+encodeURIComponent(title)+"&url="+encodeURIComponent(url),linkedin:"https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(url)};
   if(network==="copy"){const label=button.querySelector("[data-share-label]");const original=label?label.textContent:"Salin tautan";try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);}else{const field=document.createElement("textarea");field.value=url;field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();const copied=document.execCommand("copy");field.remove();if(!copied)throw new Error("Copy failed");}if(label)label.textContent="Tautan tersalin";}catch(_){if(label)label.textContent="Salin gagal";}if(label)window.setTimeout(function(){label.textContent=original;},1800);return;}
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
 const otherArticles=R.articles.filter(a=>a.status==="PUBLISHED"&&a.id!==article.id&&!related.some(r=>r.id===a.id)&&norm(a.language||"id")===language&&norm(a.category)!==norm(article.category)).slice(0,3);
 const serviceIds=new Set([...(article.services||[]),...(article.relatedServices||[])]);
 const services=R.services.filter(s=>serviceIds.has(s.id));
 if(!related.length&&!services.length&&!otherArticles.length)return;
 const section=document.createElement("section");
 section.className="article-ecosystem";
 section.setAttribute("aria-labelledby","article-ecosystem-title");
 section.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">Bacaan lanjutan</span><h2 id="article-ecosystem-title">Lanjutkan penjelajahan</h2><p>Artikel dan layanan yang berhubungan dengan topik ini.</p></div>'+
 (related.length?'<div class="article-ecosystem__group"><span class="section-kicker">Artikel terkait</span><div class="article-ecosystem__links">'+related.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt||a.topic||a.category||"Baca artikel terkait")+'</span></a>').join("")+'</div></div>':"")+
 (services.length?'<div class="article-ecosystem__group"><span class="section-kicker">Layanan terkait</span><div class="article-ecosystem__links">'+services.map(s=>'<a href="'+esc(s.url)+'"><strong>'+esc(s.name)+'</strong><span>'+esc(s.purpose)+'</span></a>').join("")+'</div></div>':"");

 host.parentNode.insertBefore(section,host);
 if(otherArticles.length){
  const otherSection=document.createElement("section");
  otherSection.className="article-ecosystem article-ecosystem--other";
  otherSection.setAttribute("aria-labelledby","article-other-title");
  otherSection.innerHTML='<div class="article-ecosystem__header"><span class="section-kicker">Bacaan lainnya</span><h2 id="article-other-title">Artikel lainnya</h2><p>Temukan tulisan dari topik yang berbeda.</p></div><div class="article-ecosystem__group"><div class="article-ecosystem__links">'+otherArticles.map(a=>'<a href="'+esc(a.url)+'"><strong>'+esc(a.title)+'</strong><span>'+esc(a.excerpt||a.topic||a.category||"Temukan bacaan lainnya")+'</span></a>').join("")+'</div></div>';
  section.parentNode.insertBefore(otherSection,host);
 }
});
})();