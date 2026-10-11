(() => {
  const root = document.querySelector("[data-template-catalog]");
  if (!root) return;
  const grid = root.querySelector("[data-template-grid]");
  const search = root.querySelector("[data-template-search]");
  const category = root.querySelector("[data-template-category]");
  const level = root.querySelector("[data-template-level]");
  const status = root.querySelector("[data-template-status]");
  const shortcuts = root.querySelector("[data-template-category-shortcuts]");
  const base = root.dataset.catalogUrl || "/bagusin/templates/catalog.json";
  const money = value => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  let catalog;
  function render() {
    if (!catalog) return;
    const q = search.value.trim().toLocaleLowerCase("id");
    const selectedCategory = category.value;
    const selectedLevel = level.value;

    // Categories guide discovery, but must never hide a demo that is already available.
    // Matching designs appear first; the rest of the available catalogue remains visible.
    const items = catalog.templates
      .filter(item => item.status === "available")
      .filter(item => {
        const haystack = [item.name, item.designName, item.description, ...(item.businessTypes || [])].join(" ").toLocaleLowerCase("id");
        return (!q || haystack.includes(q)) && (!selectedLevel || item.level === selectedLevel);
      })
      .sort((a, b) =>
        Number(Boolean(b.category === selectedCategory)) - Number(Boolean(a.category === selectedCategory)) ||
        Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
        String(b.updated || "").localeCompare(String(a.updated || "")) ||
        String(a.name || "").localeCompare(String(b.name || ""), "id")
      );

    const categoryName = catalog.categories.find(item => item.id === selectedCategory)?.name;
    status.textContent = items.length
      ? (selectedCategory
          ? `${items.length} demo tersedia · desain kategori ${categoryName || selectedCategory} ditampilkan lebih dahulu`
          : `${items.length} demo tersedia · koleksi terbaru ditampilkan lebih dahulu`)
      : "Belum ada desain tersedia yang cocok dengan pencarian atau level ini.";
    grid.innerHTML = items.length ? items.map(item => {
      const cat = catalog.categories.find(c => c.id === item.category);
      const tier = catalog.levels.find(l => l.id === item.level);
      const features = (item.included || []).slice(0,2).map(feature => `<li>${escapeHtml(feature.replace(/struktur SEO dasar/gi, "dasar agar mudah ditemukan di Google").replace(/SEO lokal/gi, "pencarian lokal di Google"))}</li>`).join("");
      return `<article class="template-product">
        <div class="template-product__image-wrap"><img class="template-product__image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.name)}" loading="lazy" width="1200" height="750"><span class="template-product__badge">${item.isNew ? "Koleksi terbaru" : "Template tersedia"}</span></div>
        <div class="template-product__body">
          <div class="template-product__meta"><span class="template-chip">${escapeHtml(cat?.name || item.category)}</span><span class="template-chip">${escapeHtml(tier?.name || item.level)}</span><span class="template-chip">${(item.format === "landing-page" || item.format === "one-page-website") ? "Satu halaman" : "Multi-halaman"}</span></div>
          <h3>${escapeHtml(item.name)}</h3><p class="template-product__description">${escapeHtml(item.description)}</p>
          <ul class="template-product__included">${features}</ul>
          <div class="template-product__bottom"><div><span class="template-product__price-label">Desain, teks, dan dasar pencarian Google</span><strong class="template-product__price">${money(item.price)}</strong><span class="template-product__price-label">Sekali bayar · domain/hosting terpisah</span></div></div>
          <div class="template-product__actions"><a class="button button--secondary" href="/bagusin/templates/preview/?template=${encodeURIComponent(item.id)}">Lihat preview <span aria-hidden="true">↗</span></a><a class="button button--accent" href="/bagusin/templates/preview/?template=${encodeURIComponent(item.id)}#spec-title">Paket &amp; harga <span aria-hidden="true">→</span></a><a class="text-link" href="/bagusin/contact/?service=websites&amp;mode=consultation&amp;template=${encodeURIComponent(item.id)}">Tanya sebelum memesan</a></div>
        </div>
      </article>`;
    }).join("") : '<div class="template-empty"><h3>Belum ada desain yang cocok</h3><p>Belum ada demo tersedia untuk kombinasi pencarian dan level ini. Hapus pencarian atau pilih level lain untuk melihat demo yang sudah tersedia. Kamu juga bisa meminta desain khusus.</p><p><a class="button button--accent" href="/bagusin/contact/?service=websites&mode=consultation">Diskusikan kebutuhanmu</a></p></div>';
  }
  fetch(base).then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); }).then(data => {
    catalog = data;
    category.innerHTML = '<option value="">Semua kategori</option>' + data.categories.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    if (shortcuts) {
      const counts = Object.fromEntries(data.categories.map(item => [item.id, data.templates.filter(template => template.category === item.id && template.status === "available").length]));
      shortcuts.innerHTML = '<button class="template-category-shortcut is-active" type="button" data-template-shortcut="" aria-pressed="true"><span class="template-category-shortcut__number">' + data.templates.filter(item => item.status === "available").length + '</span><span>Semua koleksi</span></button>' + data.categories.map(item => '<button class="template-category-shortcut" type="button" data-template-shortcut="' + escapeHtml(item.id) + '" aria-pressed="false"><span class="template-category-shortcut__number">' + counts[item.id] + '</span><span>' + escapeHtml(item.name) + '</span></button>').join("");
      shortcuts.addEventListener("click", event => {
        const button = event.target.closest("[data-template-shortcut]");
        if (!button) return;
        category.value = button.dataset.templateShortcut;
        shortcuts.querySelectorAll("[data-template-shortcut]").forEach(control => {
          const active = control === button;
          control.classList.toggle("is-active", active);
          control.setAttribute("aria-pressed", String(active));
        });
        render();
      });
    }

    level.innerHTML = '<option value="">Semua level</option>' + data.levels.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    render();
  }).catch(() => { status.textContent = "Katalog belum dapat dimuat. Silakan hubungi Bagus untuk melihat pilihan yang tersedia."; grid.innerHTML = '<div class="template-empty"><p>Maaf, katalog sedang tidak tersedia.</p><a class="button button--accent" href="/bagusin/contact/?service=websites&mode=consultation">Tanya pilihan template</a></div>'; });
  [search, category, level].forEach(control => control.addEventListener(control === search ? "input" : "change", render));
})();