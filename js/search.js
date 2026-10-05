/* BAGUSIN — STATIC CONTENT SEARCH */
(function(){
  "use strict";
  const items=[
    {title:"Bekerja dari mana saja bukan berarti bekerja tanpa arah",category:"Blog · Remote Work",type:"Article",description:"Tentang arah kerja, ritme yang portable, project-based work, perjalanan, dan keputusan ketika tempat kerja bisa berpindah.",url:"/bagusin/journal/bekerja-dari-mana-saja/",keywords:"remote work field note kerja freelance project perjalanan travel bali indonesia software"},
    {title:"Blog",category:"Blog",type:"Collection",description:"Catatan tentang kerja, perjalanan, freelancing, teknologi, opini, pengalaman, dan hal-hal yang layak disimpan.",url:"/bagusin/journal/",keywords:"blog cerita stories field notes remote work travel freelancing teknologi"},
    {title:"Remote Work",category:"Blog Topic",type:"Collection",description:"Catatan tentang bekerja dari tempat yang berubah-ubah tanpa menganggap lokasi sebagai identitas.",url:"/bagusin/journal/remote-work/",keywords:"remote work kerja remote freelancer project-based ritme"},
    {title:"Places",category:"Places",type:"Collection",description:"Jejak tempat dan pengalaman berada di suatu tempat, bukan katalog wisata.",url:"/bagusin/destinations/",keywords:"places bali indonesia southeast asia travel destinations perjalanan"},
    {title:"Services",category:"Services",type:"Professional work",description:"Project-based work yang dapat dibicarakan secara profesional: brief, requirements, scope, quotation, production, review, delivery.",url:"/bagusin/work/",keywords:"services copywriting content writing seo landing page website web application software ui ux maintenance project quotation"},
    {title:"Work",category:"Work",type:"Evidence",description:"Project, concept, dan experiment yang benar-benar dikerjakan, diuji, atau dikembangkan.",url:"/bagusin/portfolio/",keywords:"work portfolio project concept experiment software website"},
    {title:"YouTube",category:"YouTube",type:"Channel",description:"Jendela ke kehidupan, pekerjaan, perjalanan, eksperimen, dan hal-hal yang sedang Bagus jalani.",url:"/bagusin/youtube/",keywords:"youtube video travel work life building field notes"},
    {title:"About",category:"About",type:"Page",description:"Mengenal Bagus dan alasan BagusIn dibuat sebagai rumah di internet.",url:"/bagusin/about/",keywords:"about bagusin bagus kristian sianturi person life internet house"},
    {title:"Contact",category:"Contact",type:"Page",description:"Hubungi Bagus untuk membicarakan kebutuhan, project, kolaborasi, atau hal lain yang relevan.",url:"/bagusin/contact/",keywords:"contact project requirement scope quotation collaboration"},
    {title:"Bali Bagus Dev Studio",category:"Work · Project",type:"Project",description:"Project digital yang dibangun dan dikerjakan secara langsung.",url:"/bagusin/portfolio/",keywords:"bali bagus dev studio website software project"},
    {title:"Bagus Load & Delivery",category:"Work · Experiment",type:"Experiment",description:"Eksperimen product dan software untuk marketplace material konstruksi serta coordinated delivery.",url:"/bagusin/portfolio/",keywords:"bagus load delivery marketplace construction software experiment bali"}
  ];
  const form=document.getElementById("search-page-form");
  const input=document.getElementById("page-search-input");
  const results=document.getElementById("search-results");
  const empty=document.getElementById("search-empty");
  const count=document.getElementById("search-results-count");
  const heading=document.getElementById("search-results-title");
  if(!form||!input||!results) return;
  function escapeText(value){return String(value).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]})}
  function getQuery(){return new URLSearchParams(window.location.search).get("q")?.trim()||""}
  function render(query){
    const normalized=query.toLowerCase();
    const terms=normalized.split(/\\s+/).filter(Boolean);
    const found=terms.length?items.filter(function(item){
      const haystack=(item.title+" "+item.category+" "+item.type+" "+item.description+" "+item.keywords).toLowerCase();
      return terms.every(function(term){return haystack.includes(term);});
    }):items;
    results.innerHTML="";
    found.forEach(function(item){
      const article=document.createElement("article");
      article.className="search-result";
      article.innerHTML='<div class="search-result__meta"><span class="search-result__category">'+escapeText(item.category)+'</span><span class="search-result__type">'+escapeText(item.type)+'</span></div><h3><a href="'+item.url+'">'+escapeText(item.title)+'</a></h3><p>'+escapeText(item.description)+'</p><a class="search-result__link" href="'+item.url+'">Read more <span aria-hidden="true">→</span></a>';
      results.appendChild(article);
    });
    empty.hidden=found.length>0;
    results.hidden=found.length===0;
    count.textContent=query?found.length+" hasil untuk “"+query+"”":found.length+" halaman & tulisan";
    heading.textContent=query?"Hasil pencarian":"Explore BagusIn";
  }
  form.addEventListener("submit",function(event){
    event.preventDefault();
    const query=input.value.trim();
    const target=query?"/bagusin/search/?q="+encodeURIComponent(query):"/bagusin/search/";
    window.location.href=target;
  });
  document.querySelectorAll("[data-page-suggestion]").forEach(function(button){
    button.addEventListener("click",function(){
      input.value=button.getAttribute("data-page-suggestion")||"";
      form.requestSubmit();
    });
  });
  const query=getQuery();
  input.value=query;
  render(query);
})();