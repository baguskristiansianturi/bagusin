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
  nav.innerHTML = '<button class="is-active" data-category="all" data-label="Semua kategori" aria-pressed="true">Semua kategori <span>' + items.length + '</span></button>' + cats.map(c => '<button data-category="' + esc(c[0]) + '" data-label="' + esc(c[1]) + '" aria-pressed="false">' + esc(c[1]) + ' <span>›</span></button>').join("");
  const filterBar = type === "website" ? root.querySelector("[data-tier-filter]") : null;
  if (filterBar) filterBar.innerHTML = [["all","Semua tingkat"],["starter","Starter"],["business","Bisnis"],["growth","Pengembangan"],["commerce","Katalog &amp; toko"],["complex","Kustom"]].map(x => '<button class="collection-filter' + (x[0] === "all" ? " is-active" : "") + '" data-tier="' + x[0] + '" aria-pressed="' + (x[0] === "all" ? "true" : "false") + '">' + x[1] + "</button>").join("");
  const detailBase = type === "landing" ? "/bagusin/landing-pages/collections/detail/" : type === "website" ? "/bagusin/websites/collections/detail/" : "/bagusin/copywriting/collections/detail/";
  const render = () => {
    const planned = items.filter(x => (category === "all" || x[0] === category) && (tier === "all" || x[3] === tier));
    // Keep live demos relevant to the selected industry; show the most recently updated first.
    const demos = type === "landing" ? availableTemplates.filter(t => t.status === "available" && (category === "all" || t.category === category)).sort((a,b) => String(b.updated||"").localeCompare(String(a.updated||"")) || Number(Boolean(b.isNew))-Number(Boolean(a.isNew))) : [];
    const demoCards = demos.map(t => '<article class="collection-card collection-card--available"><div class="collection-card__top"><span class="collection-card__icon" aria-hidden="true">↗</span><span class="collection-card__status is-ready">' + (t.isNew ? "Terbaru · tersedia" : "Demo tersedia") + '</span></div><h3>' + esc(t.name) + '</h3><p>' + esc(t.description) + '</p><div class="collection-card__meta"><span>' + esc(t.category === "travel" ? "Travel & Rental" : t.category) + '</span><span>·</span><span>' + esc(t.level || "Starter") + '</span></div><div class="collection-card__actions"><a href="' + esc(t.demoUrl) + '">Buka demo ↗</a><a href="' + esc(t.orderUrl) + '">Paket &amp; harga →</a></div></article>').join("");
    const plannedCards = planned.map(x => {
      const ready = x[3] === "ready";
      const url = detailBase + "?collection=" + encodeURIComponent(slug(x[1])) + "&industry=" + encodeURIComponent(x[0]) + (type === "website" ? "&tier=" + encodeURIComponent(x[3]) : "");
      return '<article class="collection-card"><div class="collection-card__top"><span class="collection-card__icon" aria-hidden="true">✦</span><span class="collection-card__status' + (ready ? " is-ready" : "") + '">' + (ready ? "Tersedia" : "Belum tersedia") + '</span></div><h3>' + esc(x[1]) + '</h3><p>' + esc(x[2]) + '</p><div class="collection-card__meta"><span>' + esc(type === "website" ? x[4] : x[0]) + '</span><span>·</span><span>Project-based</span></div><div class="collection-card__actions"><a href="' + url + '">Lihat detail →</a>' + (ready ? '<a href="' + url + '#demo">Preview demo</a>' : '<span>Collection sedang disiapkan</span>') + '</div></article>';
    }).join("");
    const hasResults = demos.length + planned.length > 0;
    grid.innerHTML = (demoCards + plannedCards) || '<div class="collection-empty" style="display:block">Belum ada koleksi untuk kategori ini. Koleksi baru akan muncul di sini saat siap ditampilkan.</div>';
    count.textContent = (demos.length + planned.length) + " koleksi";
    grid.setAttribute("aria-live", "polite");
    grid.setAttribute("aria-busy", "false");
    if (!hasResults) grid.setAttribute("data-empty", "true"); else grid.removeAttribute("data-empty");
    const active = nav.querySelector('[data-category="' + category + '"]');
    title.textContent = active ? active.dataset.label : "Semua kategori";
    nav.querySelectorAll("button").forEach(b => { const active = b.dataset.category === category; b.classList.toggle("is-active", active); b.setAttribute("aria-pressed", String(active)); });
    if (filterBar) filterBar.querySelectorAll("button").forEach(b => { const active = b.dataset.tier === tier; b.classList.toggle("is-active", active); b.setAttribute("aria-pressed", String(active)); });
  };
  nav.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; category = b.dataset.category; tier = "all"; render(); });
  filterBar?.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; tier = b.dataset.tier; render(); });
  if (type === "landing") {
    fetch("/bagusin/templates/catalog.json").then(r => { if (!r.ok) throw new Error("catalog unavailable"); return r.json(); }).then(data => { availableTemplates = data.templates || []; render(); }).catch(() => render());
  } else render();
});