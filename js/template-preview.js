(() => {
 const root=document.querySelector("[data-template-preview]"); if(!root)return;
 const params=new URLSearchParams(location.search); const id=params.get("template")||"BG-TRV-STR-001";
 const $=s=>root.querySelector(s); const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const money=v=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(v)||0);
 const frame=$("[data-preview-frame]"), workspace=$("[data-preview-workspace]"), device=$("[data-preview-device]");
 const modeButtons=[...root.querySelectorAll("[data-preview-mode]")]; let currentMode="desktop";
 function setMode(mode){currentMode=mode;workspace.dataset.mode=mode;device.classList.toggle("preview-device--mobile",mode==="mobile");device.classList.toggle("preview-device--desktop",mode==="desktop");modeButtons.forEach(b=>{const active=b.dataset.previewMode===mode;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))});$("[data-preview-caption]").textContent=mode==="mobile"?"Mode handphone · Lebar layar mobile":"Mode komputer · Lebar layar desktop";}
 modeButtons.forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.previewMode)));
 function link(el,url){if(el)el.href=url}
 fetch(root.dataset.catalogUrl).then(r=>{if(!r.ok)throw Error("catalog");return r.json()}).then(data=>{
 const item=data.templates.find(t=>t.id===id)||data.templates[0];if(!item)throw Error("template");
 const category=data.categories.find(c=>c.id===item.category)?.name||item.category;
 const level=data.levels.find(l=>l.id===item.level)?.name||item.level;
 document.title=item.name+" — Preview Website | Bagusin";
 $("[data-preview-title]").textContent=item.name;$("[data-preview-kicker]").textContent=category+" · "+level;
 $("[data-preview-description]").textContent=item.description;
 $("[data-preview-id]").textContent=item.id;$("[data-order-name]").textContent=item.name;
 $("[data-preview-price]").textContent=money(item.price);
 $("[data-details-intro]").textContent="Desain "+(item.format==="landing-page"||item.format==="one-page-website"?"satu halaman":"multi-halaman")+" yang bisa disesuaikan dengan identitas, informasi, dan tujuan bisnis kamu.";
 $("[data-preview-features]").innerHTML=(item.included||[]).map(feature=>'<div class="preview-feature"><span class="preview-feature__check" aria-hidden="true">✓</span><p>'+esc(feature)+'</p></div>').join("");
 const demo=new URL(item.demoUrl,location.origin).href;frame.src=demo;$("[data-preview-address]").textContent=item.name.toLowerCase().replace(/\s+/g,"-")+".demo";link($("[data-preview-open]"),demo);
 const order="/bagusin/contact/?service=websites&mode=project&template="+encodeURIComponent(item.id);
 const consult="/bagusin/contact/?service=websites&mode=consultation&template="+encodeURIComponent(item.id);
 const custom="/bagusin/contact/?service=websites&mode=custom&template="+encodeURIComponent(item.id);
 link($("[data-preview-order]"),order);link($("[data-preview-consult]"),consult);link($("[data-preview-custom]"),custom);
 link($("[data-preview-detail]"),"/bagusin/templates/detail/?template="+encodeURIComponent(item.id));
 frame.addEventListener("load",()=>{$("[data-preview-loading]").classList.add("is-hidden")},{once:true});
 }).catch(()=>{$("[data-preview-title]").textContent="Preview belum tersedia";$("[data-preview-description]").textContent="Katalog desain belum dapat dimuat. Silakan kembali ke koleksi atau hubungi Bagus."; $("[data-preview-loading]").textContent="Demo belum dapat dimuat.";});
 setMode("desktop");
})();