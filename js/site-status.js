/* BagusIn — living site status
   Edit data/site-status.json when the current location, work, or availability changes. */
(function(){
  "use strict";
  function init(){
    const root=document.querySelector("[data-site-status]");
    if(!root) return;
    fetch("/bagusin/data/site-status.json",{cache:"no-store"})
      .then(r=>{if(!r.ok) throw new Error("Status unavailable"); return r.json();})
      .then(data=>{
        const map={location:"[data-status-location]",activity:"[data-status-activity]",availability:"[data-status-availability]"};
        Object.keys(map).forEach(key=>{
          const el=root.querySelector(map[key]);
          if(el && data[key]) el.textContent=data[key];
        });
      }).catch(()=>{});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true}); else init();
})();