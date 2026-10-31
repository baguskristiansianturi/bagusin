(() => {
  const page = document.querySelector(".catalog-category-page");
  const grid = document.querySelector("[data-company-profile-products]");
  if (!page || !grid) return;
  const status = document.querySelector("[data-company-profile-status]");
  const chips = [...page.querySelectorAll("[data-industry]")];
  const title = page.querySelector("#industry-results-title");
  let products = [];
  let activeIndustry = "all";

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const formatPrice = value => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value || 0);

  function render() {
    const visible = products.filter(product => activeIndustry === "all" || product.industry === activeIndustry);
    grid.innerHTML = visible.map(product => `
      <article class="company-profile-product" data-product-industry="${escapeHtml(product.industry)}">
        <a class="company-profile-product__media" href="${escapeHtml(product.demo_url)}" aria-label="Open ${escapeHtml(product.name)} live demo">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.image_alt)}" loading="lazy" width="1000" height="690">
          <span class="company-profile-product__code">${escapeHtml(product.item_code)}</span>
          <span class="company-profile-product__badge">${escapeHtml(product.badge_label || "Demo")}</span>
        </a>
        <div class="company-profile-product__body">
          <p class="company-profile-product__eyebrow">${escapeHtml(product.type_label)} · ${escapeHtml(product.industry_label)}</p>
          <h3>${escapeHtml(product.name)}</h3>
          <p class="company-profile-product__design">Design direction: ${escapeHtml(product.design_name)}</p>
          <p class="company-profile-product__description">${escapeHtml(product.description)}</p>
          <div class="company-profile-product__bottom">
            <div class="company-profile-product__price"><small>Harga desain & setup awal</small><strong>${formatPrice(product.price)}</strong></div>
            <span class="caption">Demo tersedia ↗</span>
          </div>
          <div class="company-profile-product__actions">
            <a href="${escapeHtml(product.demo_url)}" target="_blank" rel="noopener">Lihat demo</a>
            <a href="${escapeHtml(product.order_url)}">Kustomisasi</a>
          </div>
        </div>
      </article>`).join("");
    if (status) {
      status.hidden = visible.length > 0;
      status.textContent = activeIndustry === "all" ? "Belum ada desain lain dalam koleksi ini." : "Belum ada desain untuk industri yang dipilih.";
    }
    if (title) title.textContent = activeIndustry === "all" ? "Desain company profile" : (chips.find(chip => chip.dataset.industry === activeIndustry)?.textContent.trim() || "Desain company profile");
  }

  chips.forEach(chip => chip.addEventListener("click", () => {
    activeIndustry = chip.dataset.industry || "all";
    render();
  }));

  fetch("/bagusin/data/company-profile-products.json")
    .then(response => {
      if (!response.ok) throw new Error("Product catalogue could not be loaded.");
      return response.json();
    })
    .then(data => {
      products = (data.products || []).filter(product => product.status === "available");
      render();
    })
    .catch(() => {
      if (status) {
        status.hidden = false;
        status.textContent = "Koleksi desain belum dapat dimuat. Silakan muat ulang halaman.";
      }
    });
})();