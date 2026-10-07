/* BAGUSIN — SERVICE ECOSYSTEM ENRICHMENT */
(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const root=document.querySelector(".service-page"); const R=window.BAGUSIN_SERVICE_REGISTRY; if(!root||!R)return;
 const parts=location.pathname.split("/").filter(Boolean); const slug=parts[parts.length-1]||"";
 const s=R.services.find(x=>x.id===slug); if(!s)return;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
 const serviceLabel=id=>R.services.find(x=>x.id===id)?.name||id;
 const statusLabel={AVAILABLE:"Available",COMING_SOON:"Coming soon",PLANNED:"Planned",BY_REQUEST:"By request",NOT_AVAILABLE:"Not available"}[s.status]||s.status;
 const whenNeeded={
   "copywriting":"Ketika offer atau informasi sudah ada, tetapi orang masih sulit memahami nilainya atau langkah berikutnya.",
   "seo-content":"Ketika bisnis ingin menjawab kebutuhan pencarian dengan konten yang relevan, bukan sekadar menambah jumlah artikel.",
   "landing-pages":"Ketika satu offer atau campaign membutuhkan satu halaman dengan tujuan tindakan yang jelas.",
   "websites":"Ketika bisnis membutuhkan digital presence yang rapi untuk menjelaskan layanan, membangun kepercayaan, dan menerima inquiry.",
   "web-applications":"Ketika workflow, data, role, atau proses bisnis sudah terlalu kompleks untuk ditangani website biasa.",
   "maintenance-uiux":"Ketika website atau product yang sudah ada memiliki bug, masalah responsive, UI/UX, atau area yang perlu diperbaiki.",
   "google-ads":"Ketika offer sudah cukup jelas dan bisnis ingin mengeksplorasi paid acquisition dengan objective dan measurement yang terukur.",
   "mobile-apps":"Ketika pengguna memang membutuhkan pengalaman mobile khusus yang tidak cukup ditangani website atau web application."
 }[s.id]||"Ketika kebutuhan utama sudah cukup jelas dan hasil yang diinginkan dapat dijelaskan.";
 const complexityText={SIMPLE:"Satu kebutuhan utama yang jelas.",STANDARD:"Beberapa kebutuhan yang saling terhubung.",ADVANCED:"Workflow, integrasi, atau proses yang lebih kompleks.",CUSTOM:"Kebutuhan khusus yang perlu discovery dan desain solusi."}[s.complexity]||"";
 const articleIds=s.relatedArticles||[]; const articleLinks=R.articles.filter(a=>a.status!=="PLANNED" && (articleIds.includes(a.id) || (a.services||[]).includes(s.id))).slice(0,6);
 const related=R.services.filter(x=>(s.relatedServices||[]).includes(x.id));
 const portfolio=s.relatedPortfolio||[];
 const guide=(R.guides&&R.guides[s.id])||{examples:[],whoFits:"",whoMayNot:"",process:[],faq:[]};
 const final=root.querySelector(".service-final");
 const section=document.createElement("section"); section.className="section service-ecosystem"; section.setAttribute("aria-labelledby","service-ecosystem-title");
 section.innerHTML=
 '<div class="container">'+
 '<div class="section-header"><span class="section-kicker">Service guide</span><h2 id="service-ecosystem-title">Understand the service before starting.</h2><p class="section-description">'+esc(s.purpose)+'</p></div>'+
 '<div class="service-grid">'+
 '<article><span class="service-icon" aria-hidden="true">?</span><h3>What is it?</h3><p>'+esc(s.problem)+'</p></article>'+
 '<article><span class="service-icon" aria-hidden="true">→</span><h3>What is its function?</h3><p>'+esc(s.purpose)+'</p></article>'+
 '<article><span class="service-icon" aria-hidden="true">◎</span><h3>When is it needed?</h3><p>'+esc(whenNeeded)+'</p></article>'+
 '</div>'+
 '<div class="service-two-col service-ecosystem__details">'+
 '<div><span class="section-kicker">Complexity</span><h3>'+esc(s.complexity)+'</h3><p>'+esc(complexityText)+'</p><p><strong>Status:</strong> '+esc(statusLabel)+'</p></div>'+
 '<div><span class="section-kicker">Possible ways this can help</span><ul>'+s.subservices.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '</div>'+
 '<div class="service-two-col service-ecosystem__details">'+
 '<div><span class="section-kicker">What I need from you</span><ul>'+s.requirements.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '<div><span class="section-kicker">What is outside the scope</span><ul>'+s.boundaries.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '</div>'+'<div class="service-two-col service-ecosystem__details">'+
 '<div><span class="section-kicker">Who this is for</span><p>'+esc(guide.whoFits)+'</p><span class="section-kicker">When another path may be better</span><p>'+esc(guide.whoMayNot)+'</p></div>'+
 '<div><span class="section-kicker">Common examples</span><ul>'+guide.examples.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '</div>'+
 '<div class="service-ecosystem__links"><span class="section-kicker">How the work usually flows</span><ol class="service-ecosystem__process">'+guide.process.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></div>'+
 (guide.faq.length?'<div class="service-ecosystem__links"><span class="section-kicker">FAQ</span><div class="service-ecosystem__faq">'+guide.faq.map(x=>'<details><summary>'+esc(x[0])+'</summary><p>'+esc(x[1])+'</p></details>').join("")+'</div></div>':"")+

 (related.length?'<div class="service-ecosystem__links"><span class="section-kicker">Related services</span><div class="service-ecosystem__link-grid">'+related.map(x=>'<a class="service-ecosystem__related-card" href="'+esc(x.url)+'"><span class="service-ecosystem__related-meta">'+esc(x.category)+'</span><strong>'+esc(x.name)+'</strong><span>'+esc(x.complexity||"Service")+'</span><span class="service-ecosystem__related-arrow" aria-hidden="true">→</span></a>').join("")+'</div></div>':"")+
 '<div class="service-ecosystem__links"><span class="section-kicker">Related Knowledge</span><div class="service-ecosystem__article-list">'+(articleLinks.length?articleLinks.map(a=>'<a class="text-link" href="'+esc(a.url)+'">'+esc(a.title)+' <span aria-hidden="true">→</span></a>').join(""):'<p class="service-ecosystem__empty">Belum ada artikel yang secara langsung membahas layanan ini. Knowledge terkait akan muncul di sini saat artikel yang relevan dipublikasikan.</p>')+'</div></div>'+
'<div class="service-ecosystem__start"><span class="section-kicker">Choose your next step</span><h3>'+((s.status==="AVAILABLE")?"You know what you need — or you need help deciding?":"This service is not open for projects yet.")+'</h3><p>'+((s.status==="AVAILABLE")?"Choose the direct project path or ask for help first.":"You can still learn about the service and ask whether it may fit your future needs.")+'</p><div class="service-actions">'+(s.status==="AVAILABLE"?'<a class="button button--accent" href="/bagusin/checkout/?service='+encodeURIComponent(s.id)+'&mode=order">Start Project</a>':"")+'<a class="button button--secondary" href="/bagusin/contact/?service='+encodeURIComponent(s.id)+'&mode=consultation">Help Me Choose</a></div></div>'+
 '</div>';
 if(final) final.parentNode.insertBefore(section,final); else root.appendChild(section);
});
})();