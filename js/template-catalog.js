(() => {
  const root = document.querySelector("[data-template-catalog]");
  if (!root) return;
  const grid = root.querySelector("[data-template-grid]");
  const search = root.querySelector("[data-template-search]");
  const category = root.querySelector("[data-template-category]");
  const level = root.querySelector("[data-template-level]");
  const status = root.querySelector("[data-template-status]");
  const pathwayButtons = [...root.querySelectorAll("[data-catalog-type]")];
  let selectedType = "";
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
        const format = String(item.format || "").toLowerCase();
        const type = format.includes("company-profile") ? "profile" : (format.includes("landing-page") || format === "one-page-website" ? "landing" : (format.includes("multi-page") || ["business", "commerce", "custom"].includes(item.level) ? "complex" : "landing"));
        return !selectedType || type === selectedType;
      })
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
          ? `${items.length} desain tersedia · kategori ${categoryName || selectedCategory} ditampilkan lebih dahulu`
          : `${items.length} desain tersedia · koleksi terbaru ditampilkan lebih dahulu`)
      : "Belum ada desain dalam kategori ini yang cocok dengan filter saat ini. Hapus pencarian atau diskusikan desain yang kamu butuhkan.";
    grid.innerHTML = items.length ? items.map(item => {
      const cat = catalog.categories.find(c => c.id === item.category);
      const tier = catalog.levels.find(l => l.id === item.level);
      const features = (item.included || []).slice(0,3).map(feature => `<li>${escapeHtml(feature)}</li>`).join("");
      return `<article class="template-product">
        <div class="template-product__image-wrap"><img class="template-product__image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt || item.name)}" loading="lazy" width="1200" height="750"><span class="template-product__badge">${item.isNew ? "Koleksi terbaru" : "Template tersedia"}</span></div>
        <div class="template-product__body">
          <div class="template-product__meta"><span class="template-chip">${escapeHtml(cat?.name || item.category)}</span><span class="template-chip">${escapeHtml(tier?.name || item.level)}</span><span class="template-chip">${(item.format === "landing-page" || item.format === "one-page-website") ? "Satu halaman" : "Multi-halaman"}</span></div>
          <h3>${escapeHtml(item.name)}</h3><p class="template-product__description">${escapeHtml(item.description)}</p>
          <ul class="template-product__included">${features}</ul>
          <div class="template-product__bottom"><div><span class="template-product__price-label">Desain + copy original + struktur SEO</span><strong class="template-product__price">${money(item.price)}</strong><span class="template-product__price-label">Sekali bayar · domain/hosting terpisah</span></div></div><p class="template-product__description">Ingin dibantu sampai online? Estimasi paket awal dengan bantuan publikasi dan domain/hosting mulai Rp1.500.000. Biaya perpanjangan tahun berikutnya terpisah dan dikonfirmasi sesuai provider.</p>
          <div class="template-product__actions"><a class="button button--secondary" href="${escapeHtml(item.demoUrl || ("/bagusin/templates/preview/?template=" + encodeURIComponent(item.id)))}">Lihat demo <span aria-hidden="true">↗</span></a><a class="button button--accent" href="${escapeHtml(item.orderUrl || ("/bagusin/templates/detail/?template=" + encodeURIComponent(item.id)))}">Paket &amp; harga <span aria-hidden="true">→</span></a><a class="text-link" href="${escapeHtml(item.discussionUrl || ("/bagusin/contact/?service=websites&amp;mode=consultation&amp;template=" + encodeURIComponent(item.id)))}">Tanya sebelum memesan</a></div>
        </div>
      </article>`;
    }).join("") : '<div class="template-empty"><h3>Belum ada desain yang cocok</h3><p>Belum ada demo tersedia untuk kombinasi pencarian dan level ini. Hapus pencarian atau pilih level lain untuk melihat demo yang sudah tersedia. Kamu juga bisa meminta desain khusus.</p><p><a class="button button--accent" href="/bagusin/contact/?service=websites&mode=consultation">Diskusikan kebutuhanmu</a></p></div>';
  }
  fetch(base).then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); }).then(data => {
    catalog = data;
    category.innerHTML = '<option value="">Semua kategori</option>' + data.categories.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    level.innerHTML = '<option value="">Semua level</option>' + data.levels.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`).join("");
    const available = data.templates.filter(item => item.status === "available");
    const countByType = {
      profile: available.filter(item => String(item.format || "").includes("company-profile")).length,
      landing: available.filter(item => !String(item.format || "").includes("company-profile") && (String(item.format || "").includes("landing-page") || item.format === "one-page-website")).length,
      complex: available.filter(item => String(item.format || "").includes("multi-page") || ["business", "commerce", "custom"].includes(item.level)).length
    };
    Object.entries(countByType).forEach(([type, count]) => {
      const node = root.querySelector(`[data-type-count="${type}"]`);
      if (node) node.textContent = `${count} desain saat ini`;
    });
    render();
  }).catch(() => { status.textContent = "Katalog belum dapat dimuat. Silakan hubungi Bagus untuk melihat pilihan yang tersedia."; grid.innerHTML = '<div class="template-empty"><p>Maaf, katalog sedang tidak tersedia.</p><a class="button button--accent" href="/bagusin/contact/?service=websites&mode=consultation">Tanya pilihan template</a></div>'; });
  [search, category, level].forEach(control => control.addEventListener(control === search ? "input" : "change", render));
  pathwayButtons.forEach(button => button.addEventListener("click", () => {
    const type = button.dataset.catalogType;
    if (type === "complete") {
      window.location.href = "/bagusin/contact/?service=websites&mode=complete-business";
      return;
    }
    selectedType = type;
    search.value = "";
    category.value = "";
    level.value = "";
    pathwayButtons.forEach(item => item.classList.toggle("is-active", item === button));
    render();
    document.querySelector("#pilihan-template")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
})();