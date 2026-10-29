(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const chips = [...page.querySelectorAll("[data-industry]")];
  const cardButtons = [...page.querySelectorAll("[data-industry-card]")];
  const grid = page.querySelector("[data-category-grid]");
  const title = page.querySelector("#industry-results-title");
  const intro = page.querySelector("[data-category-intro]");
  const empty = page.querySelector("[data-empty-state]");
  const emptyCategory = page.querySelector("[data-empty-category]");
  const backToCategories = page.querySelector("[data-show-categories]");
  const categories = [
    {id:"car-rental",name:"Rental mobil"},
    {id:"travel-tour",name:"Travel & tour"},
    {id:"airport-transfer",name:"Antar jemput bandara"},
    {id:"property",name:"Properti"},
    {id:"clinic",name:"Klinik & dokter"},
    {id:"beauty",name:"Salon & kecantikan"},
    {id:"food",name:"Restoran & katering"},
    {id:"education",name:"Kursus & pelatihan"},
    {id:"product-promo",name:"Produk & promo"},
    {id:"professional",name:"Jasa profesional"},
    {id:"construction",name:"Kontraktor & renovasi"},
    {id:"event",name:"Event & wedding"},
    {id:"fitness",name:"Fitness & wellness"},
    {id:"software",name:"Software & aplikasi"},
    {id:"finance",name:"Keuangan & hukum"},
    {id:"interior",name:"Furniture & interior"},
    {id:"other",name:"Lainnya"}
  ];
  const categoryMarkup = () => categories.map(item => `<button class="category-name" type="button" data-industry-card="${item.id}">${item.name} <span aria-hidden="true">↗</span></button>`).join("");
  function select(id, clicked) {
    chips.forEach(chip => {
      const active = chip.dataset.industry === id;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    if (id === "all") {
      title.textContent = "Kategori landing page";
      intro.textContent = "Pilih kategori untuk melihat koleksi desain.";
      grid.innerHTML = categoryMarkup();
      grid.hidden = false;
      empty.hidden = true;
      bindCategoryButtons();
    } else {
      const item = categories.find(category => category.id === id);
      if (!item) return;
      title.textContent = item.name;
      intro.textContent = "Koleksi desain untuk kategori ini belum tersedia.";
      emptyCategory.textContent = item.name;
      grid.hidden = true;
      empty.hidden = false;
    }
    if (clicked && window.matchMedia("(max-width: 640px)").matches) {
      document.querySelector("#industry-designs")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  function bindCategoryButtons() {
    page.querySelectorAll("[data-industry-card]").forEach(button => {
      button.addEventListener("click", () => {
        const id = button.dataset.industryCard;
        const chip = chips.find(item => item.dataset.industry === id);
        if (chip) select(id, true);
        const rail = page.querySelector(".industry-filter__rail");
        if (chip && rail) rail.scrollTo({left:Math.max(0,chip.offsetLeft-rail.offsetLeft-16),behavior:"smooth"});
      });
    });
  }
  chips.forEach(chip => chip.addEventListener("click", () => select(chip.dataset.industry,true)));
  backToCategories?.addEventListener("click", () => {
    select("all", false);
    document.querySelector("#industry-designs")?.scrollIntoView({behavior:"smooth",block:"start"});
  });
  bindCategoryButtons();
})();
