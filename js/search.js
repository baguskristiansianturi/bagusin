/* BAGUSIN — STATIC CONTENT SEARCH */
(function(){
  "use strict";
  const items=[
    {title:"Bekerja dari mana saja bukan berarti bekerja tanpa arah",category:"Remote Work · Field Note",type:"Article",description:"Tentang arah kerja, ritme yang portable, project-based work, perjalanan, dan keputusan ketika tempat kerja bisa berpindah.",url:"/bagusin/blog/bekerja-dari-mana-saja/",keywords:"remote work field note kerja freelance project perjalanan travel bali indonesia software"},
    {title:"Blog",category:"Blog",type:"Collection",description:"Catatan tentang kerja, perjalanan, freelancing, remote work, dan proses membangun sesuatu.",url:"/bagusin/blog/",keywords:"blog cerita stories field notes remote work travel freelancing"},
    {title:"Remote Work",category:"Blog Topic",type:"Collection",description:"Kumpulan tulisan tentang remote work tanpa menganggap lokasi sebagai jawaban untuk semuanya.",url:"/bagusin/blog/remote-work/",keywords:"remote work kerja remote freelancer project-based ritme"},
    {title:"Destinations",category:"Destinations",type:"Collection",description:"Catatan destinasi dilihat dari pengalaman berada di tempat, bukan katalog wisata.",url:"/bagusin/destinations/",keywords:"bali indonesia southeast asia travel destinations perjalanan"},
    {title:"Work With Me",category:"Work",type:"Service",description:"Project-based remote work: copywriting, content, landing page, website, web application, software, dan improvement.",url:"/bagusin/work/",keywords:"work services copywriting content writing seo landing page ads website web application software engineering database ui ux maintenance"},
    {title:"Portfolio",category:"Work",type:"Portfolio",description:"Project, concept, dan experiment yang dibangun, diuji, dan dieksplorasi.",url:"/bagusin/portfolio/",keywords:"portfolio project concept experiment software website bali bagus dev studio load delivery"},
    {title:"YouTube",category:"YouTube",type:"Channel",description:"Video blog tentang travel, remote work, freelancing, software engineering, building, dan field notes.",url:"/bagusin/youtube/",keywords:"youtube video travel remote work freelancing software building field notes"},
    {title:"About BagusIn",category:"About",type:"Page",description:"Mengenal BagusIn sebagai personal publication dan independent software studio.",url:"/bagusin/about/",keywords:"about bagusin personal publication independent software studio bagus kristian sianturi"},
    {title:"Author — Bagus Kristian Sianturi",category:"Author",type:"Page",description:"Tentang penulis, freelancer, dan software engineer di balik BagusIn.",url:"/bagusin/author/",keywords:"author bagus kristian sianturi writer freelancer software engineer full stack"},
    {title:"Contact",category:"Contact",type:"Page",description:"Mulai dari masalah. Ceritakan kebutuhan sebelum menentukan solusi, scope, timeline, dan biaya.",url:"/bagusin/contact/",keywords:"contact project problem requirement scope quotation remote"},
    {title:"Bali Bagus Dev Studio",category:"Portfolio · Project",type:"Project",description:"Project software studio yang dibangun dan dikerjakan secara langsung.",url:"/bagusin/portfolio/",keywords:"bali bagus dev studio website software project"},
    {title:"Bagus Load & Delivery",category:"Portfolio · Experiment",type:"Experiment",description:"Eksperimen product dan software untuk marketplace material konstruksi serta coordinated delivery.",url:"/bagusin/portfolio/",keywords:"bagus load delivery marketplace construction software experiment bali"}
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
    const found=normalized?items.filter(function(item){return (item.title+" "+item.category+" "+item.type+" "+item.description+" "+item.keywords).toLowerCase().includes(normalized)}):items;
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