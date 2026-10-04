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
    let progressFrame = 0;
    function updateProgress(){
      if(!progress)return;
      const start=article.getBoundingClientRect().top+window.scrollY;
      const end=Math.max(start,article.offsetTop+article.offsetHeight-window.innerHeight);
      const value=end<=start?0:Math.min(1,Math.max(0,(window.scrollY-start)/Math.max(1,end-start)));
      progress.style.width=(value*100)+"%";
    }
    function scheduleProgress(){
      if(progressFrame)return;
      progressFrame=window.requestAnimationFrame(function(){
        progressFrame=0;
        updateProgress();
      });
    }
    window.addEventListener("scroll",scheduleProgress,{passive:true});
    window.addEventListener("resize",scheduleProgress,{passive:true});
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
      img.setAttribute("tabindex","0");
      img.setAttribute("role","button");
      img.setAttribute("aria-label",img.alt ? "Perbesar gambar: "+img.alt : "Perbesar gambar");

      function openLightbox(){
        const overlay=document.createElement("div");
        overlay.className="article-lightbox";
        overlay.setAttribute("role","dialog");
        overlay.setAttribute("aria-modal","true");
        overlay.setAttribute("aria-label","Pratinjau gambar");

        const close=document.createElement("button");
        close.type="button";
        close.className="article-lightbox__close";
        close.setAttribute("aria-label","Tutup gambar");
        close.textContent="×";

        const zoom=document.createElement("img");
        zoom.src=img.currentSrc||img.src;
        zoom.alt=img.alt||"";
        zoom.decoding="async";

        overlay.appendChild(close);
        overlay.appendChild(zoom);
        document.body.appendChild(overlay);
        document.body.classList.add("lightbox-open");

        function closeLightbox(){
          overlay.remove();
          document.body.classList.remove("lightbox-open");
          img.focus({preventScroll:true});
          document.removeEventListener("keydown",onKeydown);
        }
        function onKeydown(event){
          if(event.key==="Escape"){
            event.preventDefault();
            closeLightbox();
          }
        }

        close.addEventListener("click",closeLightbox);
        overlay.addEventListener("click",function(event){
          if(event.target===overlay) closeLightbox();
        });
        document.addEventListener("keydown",onKeydown);
        close.focus();
      }

      img.addEventListener("click",openLightbox);
      img.addEventListener("keydown",function(event){
        if(event.key==="Enter" || event.key===" "){
          event.preventDefault();
          openLightbox();
        }
      });
    });
);
  });
})();