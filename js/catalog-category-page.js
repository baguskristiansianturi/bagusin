(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const chips = [...page.querySelectorAll("[data-industry]")];
  const title = page.querySelector("#industry-results-title");
  const emptyTitle = page.querySelector("[data-empty-title]");
  const copy = page.querySelector("[data-empty-copy]");
  const categories = [
    {id:"car-rental",name:"Rental mobil"},
    {id:"travel-tour",name:"Travel & tour"},
    {id:"product-promo",name:"Produk & promo"},
    {id:"professional",name:"Jasa profesional"}
  ];
  function select(id) {
    chips.forEach(chip => {
      const active = chip.dataset.industry === id;
      chip.classList.toggle("is-active",active);
      chip.setAttribute("aria-pressed",String(active));
    });
    if (id === "all") {
      title.textContent = "Desain landing page";
      emptyTitle.textContent = "Belum ada desain landing page.";
      copy.textContent = "Koleksi desain landing page sedang disiapkan.";
      return;
    }
    const category = categories.find(item => item.id === id);
    if (!category) return;
    title.textContent = category.name;
    emptyTitle.textContent = "Kategori ini belum tersedia.";
    copy.textContent = "Belum ada desain untuk kategori " + category.name + ".";
  }
  chips.forEach(chip => chip.addEventListener("click", () => {
    select(chip.dataset.industry);
    const rail = page.querySelector(".industry-filter__rail");
    if (rail) rail.scrollTo({left:Math.max(0,chip.offsetLeft-rail.offsetLeft-12),behavior:"smooth"});
  }));
})();