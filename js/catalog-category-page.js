(() => {
  const page = document.querySelector(".catalog-category-page");
  if (!page) return;
  const chips = [...page.querySelectorAll("[data-industry]")];
  const grid = page.querySelector("[data-category-grid]");
  const title = page.querySelector("#industry-results-title");
  const intro = page.querySelector("[data-category-intro]");
  const count = page.querySelector("[data-category-count]");
  const categories = [
    {id:"business",name:"Bisnis & perusahaan",desc:"Desain untuk memperkenalkan layanan, produk, atau penawaran bisnis."},
    {id:"professional",name:"Profesional",desc:"Untuk konsultan, praktisi, dan penyedia jasa profesional."},
    {id:"freelancer",name:"Freelancer",desc:"Untuk menampilkan keahlian, layanan, dan ajakan menghubungi."},
    {id:"travel",name:"Travel & pariwisata",desc:"Untuk tour, aktivitas, transportasi, dan penawaran perjalanan."},
    {id:"property",name:"Properti",desc:"Untuk promosi proyek, listing pilihan, atau permintaan informasi properti."},
    {id:"automotive",name:"Otomotif",desc:"Untuk kendaraan, rental, bengkel, dan layanan otomotif."},
    {id:"beauty",name:"Kecantikan & wellness",desc:"Untuk perawatan, salon, studio, dan layanan wellness."},
    {id:"education",name:"Pendidikan",desc:"Untuk kelas, kursus, pelatihan, dan pendaftaran."},
    {id:"food",name:"Makanan & minuman",desc:"Untuk restoran, katering, produk makanan, dan promo."},
    {id:"retail",name:"Retail & e-commerce",desc:"Untuk produk, penawaran khusus, dan kampanye penjualan."},
    {id:"technology",name:"Teknologi & digital",desc:"Untuk software, layanan digital, dan produk teknologi."},
    {id:"health",name:"Kesehatan",desc:"Untuk klinik, praktisi, dan informasi layanan kesehatan."},
    {id:"finance",name:"Keuangan & hukum",desc:"Untuk jasa keuangan, akuntansi, konsultasi, dan hukum."},
    {id:"creative",name:"Kreatif & event",desc:"Untuk fotografer, studio kreatif, acara, dan jasa produksi."},
    {id:"construction",name:"Konstruksi & properti bangunan",desc:"Untuk kontraktor, arsitektur, renovasi, dan material bangunan."},
    {id:"home",name:"Layanan rumah",desc:"Untuk kebersihan, perbaikan, instalasi, dan jasa rumah."},
    {id:"other",name:"Industri lainnya",desc:"Kategori tambahan akan disesuaikan dengan kebutuhan katalog."}
  ];
  const allMarkup = () => categories.slice(0,6).map((item,index) => cardMarkup(item,index)).join("");
  const cardMarkup = (item,index) => `<article class="category-coming-soon"><span class="category-coming-soon__mark" aria-hidden="true">${String(index+1).padStart(2,"0")}</span><div><h3>${item.name}</h3><p>${item.desc}</p></div><span class="category-coming-soon__status">Segera hadir</span></article>`;
  function select(id, clicked) {
    chips.forEach(chip => {
      const active = chip.dataset.industry === id;
      chip.classList.toggle("is-active", active);
      chip.setAttribute("aria-pressed", String(active));
    });
    if (id === "all") {
      title.textContent = "Semua kategori landing page";
      intro.textContent = "Desain akan dikelompokkan berdasarkan industri agar lebih mudah dibandingkan.";
      count.textContent = "Koleksi sedang disiapkan";
      grid.innerHTML = allMarkup();
    } else {
      const item = categories.find(category => category.id === id);
      if (!item) return;
      title.textContent = item.name;
      intro.textContent = item.desc;
      count.textContent = "Desain segera hadir";
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
