document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-catalog]");
  if (!root || !window.BAGUSIN_CATALOG) return;
  const type = root.dataset.catalog;
  const items = window.BAGUSIN_CATALOG[type] || [];
  const cats = type === "copy" ? items.map(x => [x[0], x[1]]) : window.BAGUSIN_CATALOG.industries;
  const nav = root.querySelector("[data-catalog-nav]");
  const grid = root.querySelector("[data-catalog-grid]");
  const count = root.querySelector("[data-count]");
  const title = root.querySelector("[data-title]");
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
  const slug = v => String(v).toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let category = "all", tier = "all", availableTemplates = [];
  nav.innerHTML = '<button class="is-active" data-category="all" data-label="All categories">All categories <span>' + items.length + '</span></button>' + cats.map(c => '<button data-category="' + esc(c[0]) + '" data-label="' + esc(c[1]) + '">' + esc(c[1]) + ' <span>›</span></button>').join("");
  const filterBar = type === "website" ? root.querySelector("[data-tier-filter]") : null;
  if (filterBar) filterBar.innerHTML = [["all","All levels"],["starter","Starter"],["business","Business"],["growth","Growth"],["commerce","Commerce"],["complex","Complex"]].map(x => '<button class="collection-filter' + (x[0] === "all" ? " is-active" : "") + '" data-tier="' + x[0] + '">' + x[1] + "</button>").join("");
  const detailBase = type === "landing" ? "/bagusin/landing-pages/collections/detail/" : type === "website" ? "/bagusin/websites/collections/detail/" : "/bagusin/copywriting/collections/detail/";
  const render = () => {
    const planned = items.filter(x => (category === "all" || x[0] === category) && (tier === "all" || x[3] === tier));
    const demos = type === "landing" ? availableTemplates.filter(t => t.status === "available").sort((a,b) => Number(Boolean(b.isNew))-Number(Boolean(a.isNew)) || String(b.updated||"").localeCompare(String(a.updated||""))) : [];
    const demoCards = demos.map(t => '<article class="collection-card collection-card--available"><div class="collection-card__top"><span class="collection-card__icon" aria-hidden="true">↗</span><span class="collection-card__status is-ready">' + (t.isNew ? "Terbaru · tersedia" : "Demo tersedia") + '</span></div><h3>' + esc(t.name) + '</h3><p>' + esc(t.description) + '</p><div class="collection-card__meta"><span>' + esc(t.category === "travel" ? "Travel & Rental" : t.category) + '</span><span>·</span><span>' + esc(t.level || "Starter") + '</span></div><div class="collection-card__actions">'<a href="' + (isTattooDemo ? inquiryUrl : url) + '">' + (isTattooDemo ? "Diskusikan kebutuhan →" : "Lihat detail →") + '</a>' + (ready ? '<a href="' + demoUrl + '">' + (isTattooDemo ? "Buka demo ↗" : "Preview demo") + '</a>' : '<span>Collection sedang disiapkan</span>') + '</div></article>').join("");
    const plannedCards = planned.map(x => {
      const isTattooDemo = slug(x[1]) === "tattoo-studio-website";
      const ready = x[3] === "ready" || isTattooDemo;
      const url = detailBase + "?collection=" + encodeURIComponent(slug(x[1])) + "&industry=" + encodeURIComponent(x[0]) + (type === "website" ? "&tier=" + encodeURIComponent(x[3]) : "");
      const demoUrl = isTattooDemo ? "/bagusin/demos/starter/tattoo-studio/" : url;
      const inquiryUrl = "/bagusin/contact/?service=websites&mode=consultation&template=BG-TAT-STR-001";
      return '<article class="collection-card"><div class="collection-card__top"><span class="collection-card__icon" aria-hidden="true">✦</span><span class="collection-card__status' + (ready ? " is-ready" : "") + '">' + (ready ? "Available" : "Belum tersedia") + '</span></div><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p><div class="collection-card__meta"><span>' + esc(type === "website" ? x[4] : x[0]) + '</span><span>·</span><span>Project-based</span></div><div class="collection-card__actions"><a href="' + url + '">Lihat detail →</a>' + (ready ? '<a href="' + url + '#demo">Preview demo</a>' : '<span>Collection sedang disiapkan</span>') + '</div></article>';
    }).join("");
    grid.innerHTML = (demoCards + plannedCards) || '<div class="collection-empty" style="display:block">Belum ada collection untuk filter ini. Kerangka sudah siap dan collection dapat ditambahkan kapan saja.</div>';
    count.textContent = (demos.length + planned.length) + " collection" + (demos.length + planned.length === 1 ? "" : "s");
    const active = nav.querySelector('[data-category="' + category + '"]');
    title.textContent = active ? active.dataset.label : "All categories";
    nav.querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b.dataset.category === category));
    if (filterBar) filterBar.querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b.dataset.tier === tier));
  };
  nav.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; category = b.dataset.category; tier = "all"; render(); });
  filterBar?.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; tier = b.dataset.tier; render(); });
  if (type === "landing") {
    fetch("/bagusin/templates/catalog.json").then(r => { if (!r.ok) throw new Error("catalog unavailable"); return r.json(); }).then(data => { availableTemplates = data.templates || []; render(); }).catch(() => render());
  } else render();
});