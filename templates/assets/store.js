(() => {
  const root = document.querySelector(".template-store-page");
  if (!root) return;
  const platformButtons = [...root.querySelectorAll("[data-platform]")];
  const industryButtons = [...root.querySelectorAll("[data-industry]")];
  const search = root.querySelector("[data-template-search]");
  const cards = [...root.querySelectorAll(".store-product-card")];
  const empty = root.querySelector("[data-store-empty]");
  const count = root.querySelector("[data-result-count]");
  const title = root.querySelector("[data-results-title]");
  const kicker = root.querySelector("[data-results-platform]");
  const description = root.querySelector("[data-results-description]");
  const allEmpty = root.querySelector("[data-empty-title]");
  const emptyCopy = root.querySelector("[data-empty-copy]");
  let platform = "blogger";
  let industry = "all";
  function render() {
    const query = (search?.value || "").trim().toLocaleLowerCase("id");
    let visible = 0;
    cards.forEach(card => {
      const platformMatch = card.dataset.platform === platform;
      const industryMatch = industry === "all" || card.dataset.industry === industry;
      const queryMatch = !query || (card.dataset.search || "").includes(query);
      const show = platformMatch && industryMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (title) title.textContent = platform === "blogger" ? "Template Blogger" : "Tema WordPress";
    if (kicker) kicker.textContent = platform.toUpperCase();
    if (description) description.textContent = platform === "blogger" ? "Desain untuk blog personal dan editorial." : "Tema untuk website berbasis WordPress.";
    if (empty) empty.hidden = visible > 0;
    if (count) count.textContent = visible ? visible + (visible === 1 ? " template contoh ditampilkan." : " template contoh ditampilkan.") : "Belum ada template yang cocok.";
    if (!visible && allEmpty && emptyCopy) {
      const platformLabel = platform === "blogger" ? "Blogger" : "WordPress";
      allEmpty.textContent = industry !== "all" ? "Belum ada template " + platformLabel + " untuk industri ini" : "Koleksi " + platformLabel + " akan ditampilkan di sini";
      emptyCopy.textContent = query ? "Coba kata pencarian lain atau reset filter untuk melihat kategori yang sudah tersedia." : "Kategori ini tetap disiapkan untuk produk mendatang. Tidak ada produk yang ditampilkan sebagai tersedia sebelum benar-benar siap.";
    }
    platformButtons.forEach(button => {
      const active = button.dataset.platform === platform;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    industryButtons.forEach(button => {
      const active = button.dataset.industry === industry;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }
  platformButtons.forEach(button => button.addEventListener("click", () => { platform = button.dataset.platform; render(); }));
  industryButtons.forEach(button => button.addEventListener("click", () => { industry = button.dataset.industry; render(); }));
  search?.addEventListener("input", render);
  root.querySelectorAll("[data-clear-filter],[data-clear-empty]").forEach(button => button.addEventListener("click", () => {
    industry = "all";
    platform = "blogger";
    if (search) search.value = "";
    render();
  }));
  cards.forEach(card => {
    card.dataset.platform = "blogger";
    card.dataset.industry = "blog-personal";
    card.dataset.search = "bagusin editorial blogger blog personal lifestyle editorial";
  });
  render();
})();