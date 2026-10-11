/* BAGUSIN — homepage recommendation flow */
(function () {
  "use strict";
  const root = document.querySelector("[data-pathfinder]");
  if (!root) return;
  const stageButtons = [...root.querySelectorAll("[data-stage]")];
  const followup = root.querySelector("[data-followup]");
  const goals = root.querySelector("[data-goals]");
  const result = root.querySelector("[data-result]");
  const progress = root.querySelector("[data-pathfinder-progress]");
  const title = root.querySelector("[data-result-title]");
  const summary = root.querySelector("[data-result-summary]");
  const steps = root.querySelector("[data-result-steps]");
  const caveat = root.querySelector("[data-result-caveat]");
  const consult = root.querySelector("[data-consult-link]");
  let stage = "";
  const options = {
    starter: [["customers","Mendapatkan pelanggan pertama dalam waktu dekat"],["organic","Membangun kehadiran online jangka panjang"],["allin","Dibantu menyusun dan mengurus semuanya sesuai anggaran"]],
    business: [["customers","Menambah calon pelanggan dan penjualan"],["organic","Membangun visibilitas organik jangka panjang"],["conversion","Memperbaiki hasil dari website yang sudah ada"],["allin","Menyusun strategi menyeluruh sesuai kondisi bisnis"]],
    existing: [["conversion","Website belum menghasilkan kontak atau penjualan"],["website","Memperbaiki tampilan, copy, struktur, atau menambah halaman"],["system","Menambah fitur, integrasi, atau sistem operasional"],["marketing","Menilai apakah SEO atau iklan layak dijalankan"],["allin","Menganalisis dan mengelola perbaikan secara menyeluruh"]]
  };
  const isEnglish = window.location.pathname.split("/").includes("en");
  const optionsEn = {
    starter: [["customers","Get your first customers soon"],["organic","Build long-term online visibility"],["allin","Get help planning and managing the whole process"]],
    business: [["customers","Attract more leads and sales"],["organic","Grow long-term organic visibility"],["conversion","Improve results from my current website"],["allin","Plan a broader strategy for my business"]],
    existing: [["conversion","My website is not generating leads or sales"],["website","Improve design, copy, structure, or add pages"],["system","Add features, integrations, or an operational system"],["marketing","Assess whether SEO or ads make sense"],["allin","Review and manage improvements end to end"]]
  };
  const plansEn = {
    "starter:customers": {title:"Start with a practical customer-acquisition path",summary:"Clarify the offer and make it easy to contact you before spending heavily on promotion.",steps:["Define your main customers, core offer, service area, and why people should choose you.","Set up a Google Business Profile if your local business is eligible.","Create a focused landing page with one clear offer and action.","Test customer response and measure results before increasing ad spend."],caveat:"Check margins, competition, operational readiness, and follow-up capacity before advertising."},
    "starter:organic": {title:"Build your organic foundation step by step",summary:"Create digital assets that explain your business clearly and can improve over time.",steps:["Clarify your business model, target customers, and service structure.","Build a trustworthy, useful company website.","Set up SEO foundations and pages that answer customer needs.","Publish useful content and review visibility and incoming enquiries."],caveat:"SEO takes time; results cannot be guaranteed or promised by a specific date."},
    "starter:allin": {title:"Create a tailored end-to-end plan",summary:"Bagusin first needs to understand your business model, goals, budget, and operational capacity.",steps:["Review the business model, offer, target customers, and competition.","Prioritize work by impact, cost, and capacity.","Map stages from digital foundations to customer acquisition.","Agree on scope, cost, timeline, and success measures."],caveat:"End-to-end support covers the agreed scope; it does not mean unlimited work."},
    "business:customers": {title:"Strengthen conversion before scaling promotion",summary:"Find the bottleneck limiting growth before increasing marketing spend.",steps:["Review customer sources, the offer, and how prospects contact you.","Improve the relevant page or landing page for the campaign goal.","Make sure enquiries, follow-up, and sales outcomes are tracked.","Test paid ads only when costs and margins make sense."],caveat:"Set promotion budgets around business economics, not traffic targets alone."},
    "business:organic": {title:"Strengthen long-term digital assets",summary:"Build trust and visibility so the business is not entirely dependent on paid ads.",steps:["Audit the website, business profile, and customer search needs.","Prioritize genuinely useful service pages.","Improve technical SEO and create content around customer questions.","Review progress and update pages based on evidence."],caveat:"Not every business needs to publish large volumes of content."},
    "business:conversion": {title:"Find the sales bottleneck before buying more traffic",summary:"More visitors do not automatically mean more sales if the message or conversion process is unclear.",steps:["Review the offer, traffic sources, landing pages, and visitor actions.","Improve copy, calls to action, forms, speed, or contact flow based on evidence.","Measure the change before increasing promotion spend."],caveat:"Do not assume design is the only cause of poor performance."},
    "business:allin": {title:"Plan a coordinated business improvement",summary:"Start with analysis so website, marketing, and operations support the same goals.",steps:["Review your model, customers, offer, competition, and budget.","Identify the main bottlenecks and prioritize them.","Create a phased roadmap and defined scope.","Agree on what Bagusin will handle and what your team will own."],caveat:"Recommendations may change after reviewing the actual situation."},
    "existing:conversion": {title:"Audit conversion before rebuilding the website",summary:"Keep what already works and focus on the barriers that actually reduce results.",steps:["Review messaging, calls to action, forms, mobile usability, speed, and traffic sources.","Examine available data or conduct a structured review.","Prioritize high-impact improvements and measure the outcome."],caveat:"A rebuild is not automatically the answer; targeted fixes may cost less."},
    "existing:website": {title:"Improve existing assets with a clear brief",summary:"Changes should fit your brand, user needs, technical constraints, and business goals.",steps:["Describe the problem and identify the pages that need attention.","Define the brief, priorities, technical constraints, and budget.","Decide whether to change copy, UI/UX, structure, add pages, or rebuild.","Confirm scope and timing before work begins."],caveat:"Bagusin will explain if a request conflicts with the goal, feasibility, or budget."},
    "existing:system": {title:"Map the process before adding a system",summary:"Start with the work that needs to improve, not with a technology choice.",steps:["Map the current process, users, and pain points.","Define needs, integrations, data, access, and risks.","Compare improving the existing setup with building something new.","Plan a phased implementation that can be tested."],caveat:"Not every process needs a custom application."},
    "existing:marketing": {title:"Assess marketing viability before spending",summary:"SEO and ads should be chosen based on customers, margins, competition, and sales readiness.",steps:["Define the target, transaction value, margin, and realistic acquisition cost.","Audit the landing page, conversion tracking, and follow-up process.","Compare organic growth, advertising, and offer improvements.","Run a measured test only when the assumptions are viable."],caveat:"If the risk is too high, Bagusin will explain why and suggest alternatives."},
    "existing:allin": {title:"Get an end-to-end improvement plan",summary:"Review the brand, website, marketing, and operations to identify the work that truly matters.",steps:["Review the current business and digital systems.","Set priorities based on impact, risk, and budget.","Decide what to keep, improve, add, or rebuild.","Agree on phases and evaluation criteria before work begins."],caveat:"You are not required to continue after the consultation."}
  };
  const plans = {
    "starter:customers": {title:"Mulai dari jalur mendapatkan pelanggan",summary:"Prioritaskan penawaran yang jelas dan jalur kontak yang mudah sebelum mengeluarkan biaya promosi besar.",steps:["Tentukan pelanggan utama, layanan unggulan, area layanan, dan alasan memilih bisnis Anda.","Siapkan Google Business Profile jika bisnis lokal Anda memenuhi syarat.","Buat landing page yang fokus pada satu penawaran dan satu tindakan utama.","Uji respons calon pelanggan dan ukur hasil sebelum menaikkan anggaran iklan."],caveat:"Periksa margin, persaingan, kesiapan operasional, dan kemampuan menindaklanjuti pelanggan sebelum beriklan."},
    "starter:organic": {title:"Bangun fondasi organik secara bertahap",summary:"Bangun aset digital yang menjelaskan bisnis dengan baik dan dapat dikembangkan dari waktu ke waktu.",steps:["Perjelas model bisnis, target pelanggan, dan struktur layanan.","Bangun website profil perusahaan yang informatif dan tepercaya.","Siapkan fondasi SEO dan halaman yang menjawab kebutuhan pelanggan.","Kembangkan konten dan evaluasi visibilitas serta pertanyaan yang masuk."],caveat:"SEO memerlukan waktu; hasil tidak dapat dijamin atau dipastikan pada tanggal tertentu."},
    "starter:allin": {title:"Mulai dengan rencana All-in yang disesuaikan",summary:"Bagusin perlu memahami model bisnis, target, anggaran, dan kemampuan operasional sebelum menentukan paket.",steps:["Analisis model bisnis, penawaran, target pelanggan, dan pesaing.","Tentukan prioritas berdasarkan dampak, biaya, dan kapasitas.","Susun tahapan dari fondasi digital sampai akuisisi pelanggan.","Sepakati ruang lingkup, biaya, jadwal, dan ukuran keberhasilan."],caveat:"All-in adalah pengelolaan menyeluruh sesuai ruang lingkup yang disepakati, bukan pekerjaan tanpa batas."},
    "business:customers": {title:"Perkuat jalur konversi sebelum memperbesar promosi",summary:"Cari tahu bagian yang membatasi pertumbuhan sebelum menambah pengeluaran pemasaran.",steps:["Periksa sumber pelanggan, penawaran, dan cara calon pelanggan menghubungi Anda.","Tingkatkan halaman atau landing page sesuai tujuan kampanye.","Pastikan pencatatan pertanyaan, tindak lanjut, dan hasil penjualan berjalan.","Uji iklan terukur hanya ketika biaya dan margin memungkinkan."],caveat:"Anggaran promosi sebaiknya mengikuti ekonomi bisnis, bukan sekadar target trafik."},
    "business:organic": {title:"Perkuat aset digital jangka panjang",summary:"Bangun kepercayaan dan visibilitas agar bisnis tidak hanya bergantung pada iklan berbayar.",steps:["Audit website, profil bisnis, dan kebutuhan pencarian pelanggan.","Prioritaskan halaman layanan yang benar-benar relevan.","Benahi SEO teknis dan susun konten berdasarkan pertanyaan pelanggan.","Evaluasi perkembangan dan perbarui halaman berdasarkan data."],caveat:"Tidak semua bisnis perlu memproduksi banyak konten."},
    "business:conversion": {title:"Cari hambatan penjualan sebelum menambah trafik",summary:"Lebih banyak pengunjung belum tentu berarti lebih banyak penjualan jika pesan atau proses konversi belum tepat.",steps:["Periksa penawaran, sumber trafik, halaman, dan tindakan pengunjung.","Perbaiki copy, CTA, formulir, kecepatan, atau alur kontak berdasarkan bukti.","Ukur perubahan sebelum menambah anggaran promosi."],caveat:"Jangan mengasumsikan desain adalah satu-satunya penyebab."},
    "business:allin": {title:"Susun rencana pengembangan menyeluruh",summary:"Mulai dengan analisis agar perubahan website, pemasaran, dan operasional saling mendukung.",steps:["Pahami model bisnis, target, penawaran, kompetisi, dan anggaran.","Petakan hambatan utama dan urutkan prioritas.","Susun roadmap dan ruang lingkup kerja per tahap.","Sepakati bagian yang ditangani Bagusin dan tim Anda."],caveat:"Rekomendasi dapat berubah setelah kondisi aktual ditinjau."},
    "existing:conversion": {title:"Audit konversi sebelum membangun ulang website",summary:"Pertahankan bagian yang masih bekerja dan fokus pada hambatan yang benar-benar mengurangi hasil.",steps:["Periksa pesan, CTA, formulir, pengalaman mobile, kecepatan, dan sumber trafik.","Tinjau data yang tersedia atau lakukan evaluasi terstruktur.","Prioritaskan perbaikan berdampak tinggi dan ukur hasilnya."],caveat:"Pembangunan ulang bukan solusi otomatis; perbaikan terarah bisa lebih hemat."},
    "existing:website": {title:"Perbaiki aset yang ada dengan brief yang jelas",summary:"Perubahan perlu selaras dengan brand, kebutuhan pengguna, kemampuan teknis, dan tujuan bisnis.",steps:["Jelaskan masalah dan tunjukkan halaman yang perlu diperbaiki.","Susun brief, prioritas, batasan teknis, dan anggaran.","Tentukan apakah cukup mengubah copy, UI/UX, struktur, atau perlu membangun ulang.","Konfirmasi ruang lingkup dan jadwal sebelum pengerjaan."],caveat:"Bagusin akan menjelaskan jika permintaan tidak sesuai tujuan, kemampuan, atau anggaran."},
    "existing:system": {title:"Petakan proses sebelum menambah sistem",summary:"Mulai dari pekerjaan yang ingin disederhanakan, bukan langsung memilih teknologi.",steps:["Petakan proses saat ini, pengguna, dan titik kesulitannya.","Tentukan kebutuhan, integrasi, data, akses, dan risiko.","Bandingkan perbaikan sistem lama dengan solusi baru.","Susun ruang lingkup dan tahapan implementasi yang dapat diuji."],caveat:"Tidak semua proses membutuhkan aplikasi khusus."},
    "existing:marketing": {title:"Nilai kelayakan pemasaran sebelum mengeluarkan biaya",summary:"Iklan dan SEO perlu dipilih berdasarkan pelanggan, margin, persaingan, dan kesiapan penjualan.",steps:["Tentukan target, nilai transaksi, margin, dan biaya akuisisi yang masuk akal.","Audit landing page, pelacakan konversi, dan proses tindak lanjut.","Bandingkan opsi organik, iklan, atau perbaikan penawaran.","Mulai dari pengujian terukur jika asumsi bisnis layak."],caveat:"Jika risikonya tinggi, Bagusin akan menjelaskan alasannya dan menyarankan alternatif."},
    "existing:allin": {title:"Dapatkan rencana perbaikan menyeluruh",summary:"Analisis brand, website, pemasaran, dan operasional untuk menentukan pekerjaan yang benar-benar dibutuhkan.",steps:["Tinjau kondisi bisnis dan sistem yang sudah ada.","Susun brief serta prioritas berdasarkan dampak, risiko, dan anggaran.","Tentukan apa yang diperbaiki, ditambah, dipertahankan, atau dibangun ulang.","Sepakati tahapan dan ukuran evaluasi sebelum pekerjaan."],caveat:"Tidak ada kewajiban melanjutkan setelah konsultasi."}
  };
  function selectStage(next) {
    stage = next;
    stageButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.stage === stage)));
    goals.replaceChildren();
    (isEnglish ? optionsEn : options)[stage].forEach(([value, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "home-pathfinder__goal";
      button.dataset.goal = value;
      button.setAttribute("aria-pressed", "false");
      button.textContent = label;
      button.addEventListener("click", () => showPlan(value));
      goals.appendChild(button);
    });
    followup.hidden = false;
    result.hidden = true;
    const heading = root.querySelector("[data-followup-title]");
    heading.textContent = isEnglish ? (stage === "starter" ? "What do you need most right now?" : stage === "business" ? "What would you most like to improve?" : "What change are you looking to make?") : (stage === "starter" ? "Apa yang paling Anda butuhkan saat ini?" : stage === "business" ? "Apa yang paling ingin ditingkatkan?" : "Apa perubahan yang ingin Anda capai?");
    heading.setAttribute("tabindex", "-1");
    progress.textContent = isEnglish ? "Step 2 of 2" : "50% selesai";
    followup.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    heading.focus({preventScroll:true});
  }
  const solutionCatalog = {
    customers: [
      { icon: "📍", title: "Google Business Profile & Maps", description: "Membantu orang menemukan bisnis lokal Anda di Google Search dan Maps, melihat lokasi, jam buka, foto, ulasan, serta cara menghubungi atau meminta petunjuk arah.", url: "/bagusin/work/google-business-profile/" },
      { icon: "↗", title: "Landing page penjualan", description: "Satu halaman yang fokus pada penawaran, manfaat, bukti yang tersedia, dan satu tindakan jelas—misalnya menghubungi WhatsApp atau meminta penawaran.", url: "/bagusin/work/landing-pages/" },
      { icon: "◎", title: "Pengukuran hasil", description: "Mengetahui dari mana pengunjung datang dan tindakan apa yang mereka lakukan sebelum anggaran promosi ditingkatkan.", url: "/bagusin/work/seo-content/" }
    ],
    organic: [
      { icon: "⌂", title: "Website profil bisnis", description: "Tempat utama untuk menjelaskan bisnis, layanan, area kerja, informasi penting, dan alasan pelanggan dapat mempercayai Anda.", url: "/bagusin/work/" },
      { icon: "⌕", title: "SEO & konten", description: "Merapikan struktur halaman dan menjawab pertanyaan calon pelanggan agar bisnis lebih mudah dipahami dan ditemukan secara organik.", url: "/bagusin/work/seo-content/" }
    ],
    conversion: [
      { icon: "↗", title: "Landing page & perbaikan konversi", description: "Menyederhanakan pesan, susunan informasi, tombol tindakan, formulir, dan pengalaman mobile agar pengunjung tahu langkah berikutnya.", url: "/bagusin/work/landing-pages/" },
      { icon: "◎", title: "Audit aset yang sudah ada", description: "Mulai dari masalah yang nyata; pertahankan bagian yang masih berfungsi dan prioritaskan perubahan yang paling dibutuhkan.", url: "/bagusin/work/" }
    ],
    website: [
      { icon: "▤", title: "Perbaikan website", description: "Perbarui copy, tampilan, navigasi, halaman, dan alur pengguna tanpa otomatis membangun semuanya dari awal.", url: "/bagusin/work/" },
      { icon: "↗", title: "Landing page khusus", description: "Cocok ketika satu layanan, produk, atau kampanye memerlukan halaman yang fokus pada satu tujuan.", url: "/bagusin/work/landing-pages/" }
    ],
    system: [
      { icon: "▦", title: "Aplikasi dan sistem khusus", description: "Untuk kebutuhan seperti formulir lanjutan, dashboard, integrasi, otomasi, atau alur kerja yang tidak cukup ditangani website biasa.", url: "/bagusin/work/web-applications/" }
    ],
    marketing: [
      { icon: "⌕", title: "SEO & konten", description: "Membangun fondasi jangka panjang dan halaman yang menjawab kebutuhan pencarian calon pelanggan.", url: "/bagusin/work/seo-content/" },
      { icon: "↗", title: "Landing page & pengukuran", description: "Pastikan penawaran dan halaman siap sebelum membayar trafik dari iklan.", url: "/bagusin/work/landing-pages/" }
    ],
    allin: [
      { icon: "✓", title: "Rencana solusi bertahap", description: "Gabungkan hanya bagian yang memang diperlukan—website, Google Maps, konten, SEO, iklan, atau sistem—berdasarkan prioritas dan anggaran.", url: "/bagusin/work/" },
      { icon: "▤", title: "Lihat contoh dan demo", description: "Pelajari konsep yang tersedia terlebih dahulu, lalu pilih untuk memakai, menyesuaikan, atau membangun solusi khusus.", url: "/bagusin/collections/" }
    ]
  };
  function renderSolutions(goal) {
    const old = result.querySelector("[data-recommended-solutions]");
    if (old) old.remove();
    const items = solutionCatalog[goal] || solutionCatalog.allin;
    const section = document.createElement("div");
    section.className = "home-recommended-solutions";
    section.dataset.recommendedSolutions = "";
    const heading = document.createElement("h4");
    heading.textContent = isEnglish ? "Solutions to explore next" : "Solusi yang bisa Anda pelajari";
    section.appendChild(heading);
    const grid = document.createElement("div");
    grid.className = "home-recommended-solutions__grid";
    items.forEach(item => {
      const card = document.createElement("a");
      card.className = "home-recommended-solutions__card";
      card.href = isEnglish && item.url.startsWith("/bagusin/work/") ? "/bagusin/en/work/" : isEnglish && item.url === "/bagusin/collections/" ? "/bagusin/en/collections/" : item.url;
      const icon = document.createElement("span");
      icon.className = "home-recommended-solutions__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;
      const body = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = item.title;
      const description = document.createElement("small");
      description.textContent = item.description;
      const link = document.createElement("span");
      link.className = "home-recommended-solutions__link";
      link.textContent = isEnglish ? "Explore solution →" : "Pelajari solusi →";
      body.append(name, description, link);
      card.append(icon, body);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    const actions = result.querySelector(".home-pathfinder__result-actions");
    result.insertBefore(section, actions);
  }
  function showPlan(goal) {
    goals.querySelectorAll("[data-goal]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.goal === goal)));
    const plan = (isEnglish ? plansEn : plans)[stage + ":" + goal];
    if (!plan) return;
    title.textContent = plan.title;
    title.setAttribute("tabindex", "-1");
    summary.textContent = plan.summary;
    steps.replaceChildren();
    plan.steps.forEach(text => { const li = document.createElement("li"); li.textContent = text; steps.appendChild(li); });
    caveat.textContent = plan.caveat;
    renderSolutions(goal);
    consult.href = (isEnglish ? "/bagusin/en/contact/?" : "/bagusin/contact/?") + new URLSearchParams({service:"consultation",mode:"consultation",path:stage,goal:goal,source:"homepage-recommender"}).toString();
    result.hidden = false;
    progress.textContent = isEnglish ? "Recommendation ready" : "100% selesai";
    result.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    title.focus({preventScroll:true});
  }
  stageButtons.forEach(button => button.addEventListener("click", () => selectStage(button.dataset.stage)));
  root.querySelector("[data-reset-pathfinder]").addEventListener("click", () => {
    stage = "";
    stageButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
    followup.hidden = true;
    result.hidden = true;
    result.querySelector("[data-recommended-solutions]")?.remove();
    progress.textContent = isEnglish ? "Step 1 of 2" : "0% selesai";
    root.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    stageButtons[0]?.focus({preventScroll:true});
  });
})();
