(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const grid = page.querySelector("[data-category-grid]");
  const title = page.querySelector("#industry-results-title");
  const intro = page.querySelector("[data-category-intro]");
  const empty = page.querySelector("[data-empty-state]");
  const emptyCategory = page.querySelector("[data-empty-category]");
  const emptyTitle = page.querySelector("[data-empty-title]");
  const back = page.querySelector("[data-show-categories]");
  const categories = [
    {id:"car-rental",name:"Rental mobil"},
    {id:"travel-tour",name:"Travel & tour"},
    {id:"product-promo",name:"Produk & promo"},
    {id:"professional",name:"Jasa profesional"}
  ];
  function showCategories() {
    title.textContent = "Pilih kategori bisnis";
    intro.textContent = "Pilih bidang yang paling sesuai dengan kebutuhan Anda.";
    grid.hidden = false;
    empty.hidden = true;
  }
  function selectCategory(id) {
    const item = categories.find(category => category.id === id);
    if (!item) return;
    title.textContent = item.name;
    intro.textContent = "Koleksi untuk kategori ini belum tersedia.";
    emptyCategory.textContent = item.name;
    emptyTitle.textContent = "Kategori ini belum tersedia.";
    grid.hidden = true;
    empty.hidden = false;
    if (window.matchMedia("(max-width: 640px)").matches) {
      document.querySelector("#industry-designs")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  grid.querySelectorAll("[data-industry-card]").forEach(button => {
    button.addEventListener("click", () => selectCategory(button.dataset.industryCard));
  });
  back?.addEventListener("click", () => {
    showCategories();
    document.querySelector("#industry-designs")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
})();