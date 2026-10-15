(() => {
  const root = document.querySelector(".template-store-page");
  if (!root) return;
  const platformButtons = [...root.querySelectorAll("[data-platform]")];
  const industryButtons = [...root.querySelectorAll("[data-industry]")];
  const search = root.querySelector("[data-template-search]");
  const purposeFilter = root.querySelector("[data-template-purpose]");
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
      const purposeMatch = !purposeFilter || purposeFilter.value === "all" || card.dataset.purpose === purposeFilter.value;
      const show = platformMatch && industryMatch && queryMatch && purposeMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    const platformLabels = { blogger: "Template Blogger", wordpress: "Tema WordPress", coded: "Template HTML, CSS & JS" };
    const platformDescriptions = { blogger: "File tema untuk blog berbasis Blogger.", wordpress: "Tema untuk website yang menggunakan WordPress.", coded: "Kode website yang dapat dikembangkan dan dipasang pada hosting pilihan." };
    if (title) title.textContent = platformLabels[platform];
    if (kicker) kicker.textContent = platform === "coded" ? "HTML · CSS · JS" : platform.toUpperCase();
    if (description) description.textContent = platformDescriptions[platform];
    if (empty) empty.hidden = visible > 0;
    if (count) count.textContent = visible ? visible + (visible === 1 ? " template tersedia." : " template tersedia.") : "Belum ada template yang cocok dengan pilihan ini.";
    if (!visible && allEmpty && emptyCopy) {
      const platformLabel = platform === "blogger" ? "Blogger" : platform === "wordpress" ? "WordPress" : "HTML, CSS & JS";
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
      const badge = button.querySelector("[data-industry-count]");
      if (badge) {
        const total = cards.filter(card => card.dataset.platform === platform && (button.dataset.industry === "all" || card.dataset.industry === button.dataset.industry)).length;
        badge.textContent = total ? String(total).padStart(2, "0") : "—";
      }
    });
  }
  function revealResultsAfterMobileChoice(button) {
    if (!button.closest(".store-mobile-filterbar") || !window.matchMedia("(max-width: 42rem)").matches) return;
    const target = root.querySelector(".store-results__top");
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }
  platformButtons.forEach(button => button.addEventListener("click", () => {
    platform = button.dataset.platform;
    render();
    revealResultsAfterMobileChoice(button);
  }));
  industryButtons.forEach(button => button.addEventListener("click", () => {
    industry = button.dataset.industry;
    render();
    revealResultsAfterMobileChoice(button);
  }));
  search?.addEventListener("input", render);
  purposeFilter?.addEventListener("change", render);
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
    card.dataset.purpose = "blog";
  });
  render();
})();