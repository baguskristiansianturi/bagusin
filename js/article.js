/* =========================================================
   BAGUSIN — ARTICLE INTERACTIONS
   TOC, reading progress, sharing, lightbox and article utilities.
   ========================================================= */
(function(){
  "use strict";

  function ready(fn){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",fn,{once:true});
    else fn();
  }

  ready(function(){
    const article=document.querySelector("[data-article-content]");
    if(!article)return;

    const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isEnglish=document.documentElement.lang.toLowerCase().startsWith("en");

    /* Reading progress */
    const progress=document.querySelector("[data-reading-progress] span");
    let progressFrame=0;

    function updateProgress(){
      if(!progress)return;
      const start=article.getBoundingClientRect().top+window.scrollY;
      const end=Math.max(start,article.offsetTop+article.offsetHeight-window.innerHeight);
      const value=end<=start?1:Math.min(1,Math.max(0,(window.scrollY-start)/Math.max(1,end-start)));
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

    /* Table of contents + active section */
    const tocList=document.querySelector("[data-toc-list]");
    const toc=document.querySelector("[data-toc]");
    if(tocList){
      const headings=Array.from(article.querySelectorAll("h2[id],h3[id]"));
      headings.forEach(function(heading){
        const li=document.createElement("li");
        const link=document.createElement("a");
        link.className="toc__link"+(heading.tagName==="H3"?" toc__link--sub":"");
        link.href="#"+heading.id;
        link.textContent=heading.textContent.trim();
        li.appendChild(link);
        tocList.appendChild(li);
      });

      if(!headings.length){
        toc?.setAttribute("hidden","");
      }else if("IntersectionObserver" in window){
        const links=new Map();
        tocList.querySelectorAll("a[href^='#']").forEach(function(link){
          links.set(link.getAttribute("href").slice(1),link);
        });

        const observer=new IntersectionObserver(function(entries){
          entries.forEach(function(entry){
            if(!entry.isIntersecting)return;
            tocList.querySelectorAll(".toc__link.is-active").forEach(function(link){
              link.classList.remove("is-active");
              link.removeAttribute("aria-current");
            });
            const link=links.get(entry.target.id);
            if(link){
              link.classList.add("is-active");
              link.setAttribute("aria-current","location");
            }
          });
        },{
          rootMargin:"-"+(document.querySelector("#site-header")?.offsetHeight||0)+"px 0px -65% 0px",
          threshold:0
        });
        headings.forEach(function(heading){observer.observe(heading);});
      }
    }

    /* True external links */
    article.querySelectorAll("a[href^='http']").forEach(function(link){
      try{
        const url=new URL(link.href,window.location.href);
        if(url.origin!==window.location.origin){
          link.target="_blank";
          link.rel="noopener noreferrer";
        }
      }catch(_){}
    });

    /* Share + copy link */
    const pageUrl=window.location.href.split("#")[0];
    const pageTitle=document.title;

    function announce(button,message){
      const original=button.dataset.originalLabel||button.textContent;
      button.dataset.originalLabel=original;
      button.textContent=message;
      window.setTimeout(function(){button.textContent=original;},1800);
    }

    async function copyLink(button){
      try{
        if(navigator.clipboard&&window.isSecureContext){
          await navigator.clipboard.writeText(pageUrl);
        }else{
          const field=document.createElement("textarea");
          field.value=pageUrl;
          field.setAttribute("readonly","");
          field.style.position="fixed";
          field.style.opacity="0";
          document.body.appendChild(field);
          field.select();
          document.execCommand("copy");
          field.remove();
        }
        announce(button,isEnglish?"Copied":"Tersalin");
      }catch(_){
        announce(button,isEnglish?"Copy failed":"Salin gagal");
      }
    }

    article.querySelectorAll("[data-copy-link]").forEach(function(button){
      button.addEventListener("click",function(){copyLink(button);});
    });

    article.querySelectorAll("[data-share]").forEach(function(button){
      button.addEventListener("click",async function(){
        const network=button.getAttribute("data-share");
        const encodedUrl=encodeURIComponent(pageUrl);
        const encodedTitle=encodeURIComponent(pageTitle);
        const shareUrls={
          whatsapp:"https://wa.me/?text="+encodeURIComponent(pageTitle+" "+pageUrl),
          x:"https://x.com/intent/post?text="+encodedTitle+"&url="+encodedUrl,
          facebook:"https://www.facebook.com/sharer/sharer.php?u="+encodedUrl,
          linkedin:"https://www.linkedin.com/sharing/share-offsite/?url="+encodedUrl
        };

        if(navigator.share&&network==="native"){
          try{await navigator.share({title:pageTitle,url:pageUrl});}catch(_){}
          return;
        }

        if(shareUrls[network]){
          window.open(shareUrls[network],"_blank","noopener,noreferrer,width=720,height=640");
        }
      });
    });

    /* Image lightbox */
    let activeLightbox=null;
    let previousFocus=null;

    function closeLightbox(){
      if(!activeLightbox)return;
      activeLightbox.remove();
      activeLightbox=null;
      document.body.classList.remove("lightbox-open");
      if(previousFocus){
        previousFocus.focus({preventScroll:true});
        previousFocus=null;
      }
    }

    article.querySelectorAll("img").forEach(function(img){
      if(!img.closest(".article-cover")) img.style.cursor="zoom-in";

      img.addEventListener("click",function(){
        if(!img.src)return;
        previousFocus=document.activeElement;
        const overlay=document.createElement("div");
        overlay.className="article-lightbox";
        overlay.setAttribute("role","dialog");
        overlay.setAttribute("aria-modal","true");
        overlay.setAttribute("aria-label","Image preview");
        overlay.innerHTML='<button type="button" class="article-lightbox__close" aria-label="' + (isEnglish ? "Close image" : "Tutup gambar") + '">×</button><img alt="">';

        const zoom=overlay.querySelector("img");
        zoom.src=img.currentSrc||img.src;
        zoom.alt=img.alt||"";
        document.body.appendChild(overlay);
        document.body.classList.add("lightbox-open");
        activeLightbox=overlay;
        overlay.querySelector(".article-lightbox__close").focus();

        overlay.addEventListener("click",function(event){
          if(event.target===overlay||event.target.closest(".article-lightbox__close")) closeLightbox();
        });
      });
    });

    document.addEventListener("keydown",function(event){
      if(event.key==="Escape") closeLightbox();
    });
  });
})();