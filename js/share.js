/* =========================================================
   BAGUSIN — SHARE
   ========================================================= */
(function(){
  "use strict";
  document.addEventListener("DOMContentLoaded",function(){
    document.querySelectorAll("[data-share]").forEach(function(button){
      button.addEventListener("click",function(){
        const type=button.getAttribute("data-share");
        const url=window.location.href;
        const title=document.title;
        const encodedUrl=encodeURIComponent(url);
        const encodedTitle=encodeURIComponent(title);
        const targets={
          whatsapp:"https://wa.me/?text="+encodeURIComponent(title+" — "+url),
          x:"https://twitter.com/intent/tweet?text="+encodedTitle+"&url="+encodedUrl,
          facebook:"https://www.facebook.com/sharer/sharer.php?u="+encodedUrl,
          linkedin:"https://www.linkedin.com/sharing/share-offsite/?url="+encodedUrl
        };
        if(type==="native"&&navigator.share){navigator.share({title:title,url:url}).catch(function(){});return;}
        if(targets[type])window.open(targets[type],"_blank","noopener,noreferrer,width=720,height=600");
      });
    });
    document.querySelectorAll("[data-copy-link]").forEach(function(button){
      button.addEventListener("click",async function(){
        try{
          await navigator.clipboard.writeText(window.location.href);
          const old=button.textContent;button.textContent="Copied";
          window.setTimeout(function(){button.textContent=old;},1600);
        }catch(_){
          window.prompt("Copy link:",window.location.href);
        }
      });
    });
  });
})();