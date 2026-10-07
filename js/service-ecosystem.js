/* BAGUSIN — SERVICE ECOSYSTEM ENRICHMENT */
(function(){
"use strict";
document.addEventListener("DOMContentLoaded",function(){
 const root=document.querySelector(".service-page"); const R=window.BAGUSIN_SERVICE_REGISTRY; if(!root||!R)return;
 const slug=location.pathname.split("/").filter(Boolean).slice(-2,-1)[0]||"";
 const s=R.services.find(x=>x.id===slug); if(!s)return;
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
 const serviceLabel=id=>R.services.find(x=>x.id===id)?.name||id;
 const statusLabel={AVAILABLE:"Available",COMING_SOON:"Coming soon",PLANNED:"Planned",BY_REQUEST:"By request",NOT_AVAILABLE:"Not available"}[s.status]||s.status;
 const complexityText={SIMPLE:"Satu kebutuhan utama yang jelas.",STANDARD:"Beberapa kebutuhan yang saling terhubung.",ADVANCED:"Workflow, integrasi, atau proses yang lebih kompleks.",CUSTOM:"Kebutuhan khusus yang perlu discovery dan desain solusi."}[s.complexity]||"";
 const articleLinks=R.articles.filter(a=>(a.services||[]).includes(s.id)).slice(0,6);
 const related=R.services.filter(x=>(s.relatedServices||[]).includes(x.id));
 const portfolio=s.relatedPortfolio||[];
 const final=root.querySelector(".service-final");
 const section=document.createElement("section"); section.className="section service-ecosystem"; section.setAttribute("aria-labelledby","service-ecosystem-title");
 section.innerHTML=
 '<div class="container">'+
 '<div class="section-header"><span class="section-kicker">Service guide</span><h2 id="service-ecosystem-title">Understand the service before starting.</h2><p class="section-description">'+esc(s.purpose)+'</p></div>'+
 '<div class="service-grid">'+
 '<article><span class="service-icon" aria-hidden="true">?</span><h3>What is it?</h3><p>'+esc(s.problem)+'</p></article>'+
 '<article><span class="service-icon" aria-hidden="true">→</span><h3>What is its function?</h3><p>'+esc(s.purpose)+'</p></article>'+
 '<article><span class="service-icon" aria-hidden="true">◎</span><h3>When is it needed?</h3><p>Biasanya ketika kebutuhan utama sudah cukup jelas dan hasil yang diinginkan dapat dijelaskan.</p></article>'+
 '</div>'+
 '<div class="service-two-col service-ecosystem__details">'+
 '<div><span class="section-kicker">Complexity</span><h3>'+esc(s.complexity)+'</h3><p>'+esc(complexityText)+'</p><p><strong>Status:</strong> '+esc(statusLabel)+'</p></div>'+
 '<div><span class="section-kicker">Sub-services</span><ul>'+s.subservices.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '</div>'+
 '<div class="service-two-col service-ecosystem__details">'+
 '<div><span class="section-kicker">Requirements</span><ul>'+s.requirements.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '<div><span class="section-kicker">Scope boundary</span><ul>'+s.boundaries.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div>'+
 '</div>'+
 (related.length?'<div class="service-ecosystem__links"><span class="section-kicker">Related services</span><div class="service-ecosystem__link-grid">'+related.map(x=>'<a class="card" href="'+esc(x.url)+'"><strong>'+esc(x.name)+'</strong><span>'+esc(x.category)+'</span></a>').join("")+'</div></div>':"")+
 (articleLinks.length?'<div class="service-ecosystem__links"><span class="section-kicker">Learn about this</span><div class="service-ecosystem__article-list">'+articleLinks.map(a=>'<a class="text-link" href="'+esc(a.url)+'">'+esc(a.title)+' <span aria-hidden="true">→</span></a>').join("")+'</div></div>':"")+
 '<div class="service-ecosystem__start"><span class="section-kicker">Choose your next step</span><h3>You know what you need — or you need help deciding?</h3><div class="service-actions"><a class="button button--accent" href="/bagusin/checkout/?service='+encodeURIComponent(s.id)+'&mode=order">Start Project</a><a class="button button--secondary" href="/bagusin/contact/?service='+encodeURIComponent(s.id)+'&mode=consultation">Help Me Choose</a></div></div>'+
 '</div>';
 if(final) final.parentNode.insertBefore(section,final); else root.appendChild(section);
});
})();