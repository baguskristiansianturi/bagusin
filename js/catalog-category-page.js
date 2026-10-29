(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const chips = [...page.querySelectorAll("[data-industry]")];
  const grid = page.querySelector("[data-category-grid]");
  const title = page.querySelector("#industry-results-title");
  const intro = page.querySelector("[data-category-intro]");
  const count = page.querySelector("[data-category-count]");
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
  const allMarkup = () => categories.map((item,index) => cardMarkup(item,index)).join("");
  const cardMarkup = (item,index) => `<article class="category-coming-soon"><span class="category-coming-soon__mark" aria-hidden="true">${String(index+1).padStart(2,"0")}</span><div><h3>${item.name}</h3><p>Belum tersedia</p></div></article>`;
  function select(id, clicked) {
    chips.forEach(chip => {
      const active = chip.dataset.industry === id;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    if (id === "all") {
      title.textContent = "Semua kategori landing page";
      intro.textContent = "Desain landing page belum tersedia.";
      count.textContent = "Belum tersedia";
      grid.innerHTML = allMarkup();
    } else {
      const item = categories.find(category => category.id === id);
      if (!item) return;
      title.textContent = item.name;
      intro.textContent = "Desain untuk kategori ini belum tersedia.";
      count.textContent = "Belum tersedia";
      grid.innerHTML = cardMarkup(item, categories.indexOf(item));
    }
    if (clicked && window.matchMedia("(max-width: 640px)").matches) {
      document.querySelector("#industry-designs")?.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }
  chips.forEach(chip => chip.addEventListener("click", () => select(chip.dataset.industry,true)));
  const rail = page.querySelector(".industry-filter__rail");
  chips.forEach(chip => chip.addEventListener("click", () => {
    if (rail && chip.offsetLeft < rail.scrollLeft) rail.scrollTo({left:chip.offsetLeft-12,behavior:"smooth"});
    else if (rail && chip.offsetLeft + chip.offsetWidth > rail.scrollLeft + rail.clientWidth) rail.scrollTo({left:chip.offsetLeft+chip.offsetWidth-rail.clientWidth+12,behavior:"smooth"});
  }));
})();
