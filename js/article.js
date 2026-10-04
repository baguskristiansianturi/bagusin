/* =========================================================
   BAGUSIN — ARTICLE INTERACTIONS
   TOC, reading progress, lightbox and article utilities.
   ========================================================= */
(function(){
  "use strict";
  function ready(fn){if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",fn,{once:true});else fn();}
  ready(function(){
    const article=document.querySelector("[data-article-content]");
    if(!article)return;

    const progress=document.querySelector("[data-reading-progress] span");
    function updateProgress(){
      if(!progress)return;
      const start=article.getBoundingClientRect().top+window.scrollY;
      const end=Math.max(start,article.offsetTop+article.offsetHeight-window.innerHeight);
      const value=end<=start?0:Math.min(1,Math.max(0,(window.scrollY-start)/Math.max(1,end-start)));
      progress.style.width=(value*100)+"%";
    }
    window.addEventListener("scroll",updateProgress,{passive:true});
    window.addEventListener("resize",updateProgress,{passive:true});
    updateProgress();

    const tocList=document.querySelector("[data-toc-list]");
    if(tocList){
      const headings=article.querySelectorAll("h2[id],h3[id]");
      headings.forEach(function(heading){
        const li=document.createElement("li");
        const link=document.createElement("a");
        link.className="toc__link"+(heading.tagName==="H3"?" toc__link--sub":"");
        link.href="#"+heading.id;
        link.textContent=heading.textContent;
        li.appendChild(link);tocList.appendChild(li);
      });
      if(!headings.length) document.querySelector("[data-toc]")?.setAttribute("hidden","");
    }

    article.querySelectorAll("a[href^='http']").forEach(function(link){
      if(link.hostname!==window.location.hostname){
        link.target="_blank";link.rel="noopener noreferrer";
      }
    });

    const images=article.querySelectorAll("img");
    images.forEach(function(img){
      img.style.cursor="zoom-in";
      img.addEventListener("click",function(){
        const overlay=document.createElement("div");
        overlay.className="article-lightbox";
        overlay.innerHTML='<button type="button" class="article-lightbox__close" aria-label="Tutup gambar">×</button><img alt="">';
        const zoom=overlay.querySelector("img");zoom.src=img.currentSrc||img.src;zoom.alt=img.alt||"";
        document.body.appendChild(overlay);
        document.body.classList.add("lightbox-open");
        overlay.addEventListener("click",function(e){if(e.target===overlay||e.target.closest(".article-lightbox__close")){overlay.remove();document.body.classList.remove("lightbox-open");}});
      });
    });
  });
})();