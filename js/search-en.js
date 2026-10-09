(function(){const data=[
["Working from anywhere does not mean working without direction.","Remote Work","A field note about direction, rhythm, responsibility, and working while moving.","/bagusin/en/blog/bekerja-dari-mana-saja/"],
["Blog","Blog","Published notes on travel, remote work, freelancing, and building.","/bagusin/en/blog/"],
["Destinations","Destinations","Places seen through the experience of being there.","/bagusin/en/destinations/"],
["Work With Me","Work","Project-based work built around a real problem and a finished result.","/bagusin/en/work/"],
["Portfolio","Portfolio","Projects, concepts, and experiments.","/bagusin/en/portfolio/"],
["YouTube","Video","Videos about travel, work, building, and field notes.","/bagusin/en/youtube/"],
["About","About","The publication, the work, and the ideas behind BagusIn.","/bagusin/en/about/"],
["Contact","Contact","Send a project brief or a general inquiry.","/bagusin/en/contact/"],
["Author — Bagus Kristian Sianturi","Author","About the person writing and building behind BagusIn.","/bagusin/en/author/"],
["Privacy Policy","Legal","How BagusIn handles privacy and personal information.","/bagusin/en/legal/privacy/"],
["Terms & Conditions","Legal","Terms that apply to projects and use of the website.","/bagusin/en/legal/terms/"],
["Disclaimer","Legal","Notes on accuracy, context, and responsibility.","/bagusin/en/legal/disclaimer/"],
["Editorial Policy","Legal","How content is prepared and updated.","/bagusin/en/legal/editorial-policy/"]
]function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]))}function run(){const box=document.querySelector("#search-results"),input=document.querySelector("#page-search");if(!box||!input)return;const q=new URLSearchParams(location.search).get("q")||"";input.value=q;if(!q){box.innerHTML='<p class="section-description">Search the published archive above.</p>';return}const needle=q.toLowerCase();const hits=data.filter(x=>x.join(" ").toLowerCase().includes(needle));box.innerHTML=hits.length?'<div class="content-grid">'+hits.map(x=>'<article class="content-card"><span class="number">'+esc(x[1])+'</span><h2><a href="'+x[3]+'">'+esc(x[0])+'</a></h2><p>'+esc(x[2])+'</p></article>').join("")+'</div>':'<div class="content-card"><h2>No results yet.</h2><p>Try another word, or explore the Blog and Destinations.</p><div class="link-row"><a class="button button--accent" href="/bagusin/en/blog/">Blog</a><a class="button button--secondary" href="/bagusin/en/destinations/">Destinations</a></div></div>'}document.addEventListener("DOMContentLoaded",run)})();