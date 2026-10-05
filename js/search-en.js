/* BAGUSIN — ENGLISH STATIC CONTENT SEARCH */
(function(){
  "use strict";
  const prefix=window.location.hostname.endsWith("github.io")?"/bagusin":"";
  const data=[
    ["Working from anywhere does not mean working without direction.","Remote Work","A field note about direction, rhythm, responsibility, and working while moving.","/en/journal/bekerja-dari-mana-saja/"],
    ["Journal","Blog","Published notes on travel, remote work, freelancing, technology, and building.","/en/journal/"],
    ["Destinations","Places","Places seen through the experience of being there, not a travel catalogue.","/en/destinations/"],
    ["Services","Services","Project-based work built around a real problem, clear scope, and a finished result.","/en/work/"],
    ["Work","Work","Projects, concepts, and experiments that were actually built, tested, or explored.","/en/portfolio/"],
    ["YouTube","YouTube","A window into current life, work, travel, experiments, and things being built.","/en/youtube/"],
    ["About","About","The person behind BagusIn and the reason this internet house exists.","/en/about/"],
    ["Contact","Contact","A direct place to discuss a project, collaboration, or something else relevant.","/en/contact/"]
  ];

  function esc(s){
    return String(s).replace(/[&<>"']/g,function(m){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#39;"}[m];
    });
  }

  function run(){
    const box=document.querySelector("#search-results");
    const input=document.querySelector("#page-search-input, #page-search");
    if(!box||!input)return;

    const q=new URLSearchParams(location.search).get("q")?.trim()||"";
    input.value=q;
    const needle=q.toLowerCase();

    const hits=q
      ? data.filter(function(item){ return item.join(" ").toLowerCase().includes(needle); })
      : data;

    box.innerHTML=hits.length
      ? '<div class="content-grid">'+hits.map(function(item){
          return '<article class="content-card"><span class="number">'+esc(item[1])+'</span><h2><a href="'+prefix+item[3]+'">'+esc(item[0])+'</a></h2><p>'+esc(item[2])+'</p></article>';
        }).join("")+'</div>'
      : '<div class="content-card"><h2>No results yet.</h2><p>Try another word, or explore the Journal and Places.</p><div class="link-row"><a class="button button--accent" href="'+prefix+'/en/journal/">Journal</a><a class="button button--secondary" href="'+prefix+'/en/destinations/">Places</a></div></div>';
  }

  document.addEventListener("DOMContentLoaded",run);
})();