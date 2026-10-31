(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const chips = [...page.querySelectorAll("[data-industry]")];
  const title = page.querySelector("#industry-results-title");
  const emptyTitle = page.querySelector("[data-empty-title]");
  const copy = page.querySelector("[data-empty-copy]");
  const catalogName = page.dataset.catalogName || page.querySelector("#category-title")?.textContent.trim() || "Website";
  const defaultEmptyTitle = page.dataset.emptyTitle || ("Belum ada desain " + catalogName.toLowerCase() + ".");
  const defaultEmptyCopy = page.dataset.emptyCopy || ("Koleksi desain " + catalogName.toLowerCase() + " sedang disiapkan.");
  const categories = [
    {id:"car-rental",name:"Rental mobil"},
    {id:"travel-tour",name:"Travel & tour"},
    {id:"product-promo",name:"Produk & promo"},
    {id:"professional",name:"Jasa profesional"},
    {id:"tattoo-studio",name:"Tattoo & Body Art"}
  ];
  function select(id) {
    chips.forEach(chip => {
      const active = chip.dataset.industry === id;
      chip.classList.toggle("is-active",active);
      chip.setAttribute("aria-pressed",String(active));
    });
    if (id === "all") {
      if (title) title.textContent = "Desain " + catalogName.toLowerCase();
      if (emptyTitle) emptyTitle.textContent = defaultEmptyTitle;
      if (copy) copy.textContent = defaultEmptyCopy;
      return;
    }
    const category = categories.find(item => item.id === id);
    if (!category) return;
    if (title) title.textContent = category.name;
    if (emptyTitle) emptyTitle.textContent = "Belum ada desain untuk kategori ini.";
    if (copy) copy.textContent = "Koleksi " + catalogName.toLowerCase() + " untuk kategori " + category.name + " sedang disiapkan.";
  }
  chips.forEach(chip => chip.addEventListener("click", () => {
    select(chip.dataset.industry);
    const rail = page.querySelector(".industry-filter__rail");
    if (rail) rail.scrollTo({left:Math.max(0,chip.offsetLeft-rail.offsetLeft-12),behavior:"smooth"});
  }));
})();