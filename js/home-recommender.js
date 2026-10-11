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
    options[stage].forEach(([value, label]) => {
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
    heading.textContent = stage === "starter" ? "Apa yang paling Anda butuhkan saat ini?" : stage === "business" ? "Apa yang paling ingin ditingkatkan?" : "Apa perubahan yang ingin Anda capai?";
    heading.setAttribute("tabindex", "-1");
    progress.textContent = "50% selesai";
    followup.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    heading.focus({preventScroll:true});
  }
  function showPlan(goal) {
    goals.querySelectorAll("[data-goal]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.goal === goal)));
    const plan = plans[stage + ":" + goal];
    if (!plan) return;
    title.textContent = plan.title;
    title.setAttribute("tabindex", "-1");
    summary.textContent = plan.summary;
    steps.replaceChildren();
    plan.steps.forEach(text => { const li = document.createElement("li"); li.textContent = text; steps.appendChild(li); });
    caveat.textContent = plan.caveat;
    consult.href = "/bagusin/contact/?" + new URLSearchParams({service:"consultation",mode:"consultation",path:stage,goal:goal,source:"homepage-recommender"}).toString();
    result.hidden = false;
    progress.textContent = "100% selesai";
    result.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    title.focus({preventScroll:true});
  }
  stageButtons.forEach(button => button.addEventListener("click", () => selectStage(button.dataset.stage)));
  root.querySelector("[data-reset-pathfinder]").addEventListener("click", () => {
    stage = "";
    stageButtons.forEach(button => button.setAttribute("aria-pressed", "false"));
    followup.hidden = true;
    result.hidden = true;
    progress.textContent = "0% selesai";
    root.scrollIntoView({behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start"});
    stageButtons[0]?.focus({preventScroll:true});
  });
})();
