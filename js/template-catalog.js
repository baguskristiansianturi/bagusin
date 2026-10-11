(() => {
  const root = document.querySelector("[data-template-catalog]");
  if (!root) return;
  const grid = root.querySelector("[data-template-grid]");
  const search = root.querySelector("[data-template-search]");
  const category = root.querySelector("[data-template-category]");
  const level = root.querySelector("[data-template-level]");
  const status = root.querySelector("[data-template-status]");
  const base = root.dataset.catalogUrl || "/bagusin/templates/catalog.json";
  const money = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  let catalog;
  function render() {
    if (!catalog) return;
    const q = search.value.trim().toLocaleLowerCase("id");
    const selectedCategory = category.value;
    const selectedLevel = level.value;
    const items = catalog.templates.filter(item => {
      const haystack = [item.name, item.designName, item.description, ...(item.businessTypes || [])].join(" ").toLocaleLowerCase("id");
      return (!q || haystack.includes(q)) && (!selectedCategory || item.category === selectedCategory) && (!selectedLevel || item.level === selectedLevel);
    }).sort((a,b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || String(b.updated || "").localeCompare(String(a.updated || "")));
    status.textContent = items.length ? `${items.length} pilihan tersedia` : "Belum ada desain yang cocok dengan pilihan ini.";
    grid.innerHTML = items.length ? items.map(item => {
      const cat = catalog.categories.find(c => c.id === item.category);
      const tier = catalog.levels.find(l => l.id === item.level);
      const features = (item.included || []).slice(0,3).map(feature => `<li>${escapeHtml(feature)}</li>`).join("");
      return `<article class="template-product">
        <div class="template-product__image-wrap"><img class="template-product__image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.name)}" loading="lazy" width="1200" height="750"><span class="template-product__badge">${item.isNew ? "Koleksi terbaru" : "Template tersedia"}</span></div>
        <div class="template-product__body">
          <div class="template-product__meta"><span class="template-chip">${escapeHtml(cat?.name || item.category)}</span><span class="template-chip">${escapeHtml(tier?.name || item.level)}</span><span class="template-chip">${item.format === "landing-page" ? "Satu halaman" : "Multi-halaman"}</span></div>
          <h3>${escapeHtml(item.name)}</h3><p class="template-product__description">${escapeHtml(item.description)}</p>
          <ul class="template-product__included">${features}</ul>
          <div class="template-product__bottom"><div><span class="template-product__price-label">Harga awal</span><strong class="template-product__price">${money(item.price)}</strong></div><span class="template-chip">Copy dasar termasuk</span></div>
          <div class="template-product__actions"><a class="button button--secondary" href="${escapeHtml(item.demoUrl)}">Lihat demo <span aria-hidden="true">↗</span></a><a class="button button--accent" href="${escapeHtml(item.orderUrl)}">Pesan website <span aria-hidden="true">→</span></a><a class="text-link" href="${escapeHtml(item.discussionUrl)}">Diskusikan pilihan ini</a></div>
        </div>
      </article>`;
    }).join("") : '<div class="template-empty"><h3>Desain belum tersedia</h3><p>Pilihan ini belum ada di katalog. Kamu tetap bisa meminta desain khusus atau menyampaikan kategori yang ingin ditambahkan.</p><p><a class="button button--accent" href="/bagusin/contact/?service=website&mode=consultation">Diskusikan kebutuhanmu</a></p></div>';
  }
  fetch(base).then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); }).then(data => {
    catalog = data;
    category.innerHTML = '<option value="">Semua kategori</option>' + data.categories.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    level.innerHTML = '<option value="">Semua level</option>' + data.levels.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    render();
  }).catch(() => { status.textContent = "Katalog belum dapat dimuat. Silakan hubungi Bagus untuk melihat pilihan yang tersedia."; grid.innerHTML = '<div class="template-empty"><p>Maaf, katalog sedang tidak tersedia.</p><a class="button button--accent" href="/bagusin/contact/?service=website&mode=consultation">Tanya pilihan template</a></div>'; });
  [search, category, level].forEach(control => control.addEventListener(control === search ? "input" : "change", render));
})();