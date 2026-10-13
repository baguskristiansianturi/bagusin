document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  let service = params.get("service") || "";
  if (!service && params.get("mode") === "course-interest") service = "course-interest";
  const mode = params.get("mode") || "consultation";
  const isEnglish = document.documentElement.lang === "en";
  const labels = isEnglish ? {
    consultation: "Strategy consultation",
    "course-interest": "Course / learning path inquiry",
    copywriting: "Copywriting",
    "seo-content": "Content Writing & SEO",
    "landing-pages": "Landing Pages & Ads",
    websites: "Websites & Complex Web",
    "web-applications": "Web Applications & Database Systems",
    "maintenance-uiux": "Maintenance, Improvement & UI/UX",
    "google-ads": "Google Ads",
    "mobile-apps": "Mobile App Development"
  } : {
    consultation: "Konsultasi strategis",
    "course-interest": "Course / jalur belajar",
    copywriting: "Copywriting",
    "seo-content": "Penulisan Konten & SEO",
    "landing-pages": "Landing Page & Iklan",
    websites: "Website & Web Kompleks",
    "web-applications": "Aplikasi Web & Sistem Basis Data",
    "maintenance-uiux": "Pemeliharaan, Peningkatan & UI/UX",
    "google-ads": "Google Ads",
    "mobile-apps": "Pengembangan Aplikasi Mobile"
  };
  const serviceHeading = document.getElementById("selected-service");
  const termsLink = document.getElementById("contact-terms-link");
  const termsTopics = {
    copywriting: "copywriting",
    "seo-content": "seo-content",
    "landing-pages": "landing-pages",
    websites: "websites",
    "web-applications": "web-applications",
    "maintenance-uiux": "maintenance-uiux",
    "google-ads": "google-ads",
    "mobile-apps": "mobile-apps",
    consultation: "general",
    "course-interest": "courses"
  };
  function updateTermsLink(selectedService) {
    if (!termsLink) return;
    const topic = termsTopics[selectedService];
    const termsBase = isEnglish ? "/bagusin/en/terms/" : "/bagusin/terms/";
    termsLink.href = topic
      ? termsBase + "?topic=" + encodeURIComponent(topic) + "#" + encodeURIComponent(topic)
      : termsBase + "#general";
    termsLink.textContent = topic
      ? (isEnglish ? "Read general and " + (labels[selectedService] || "service") + " terms" : "Baca ketentuan umum dan khusus " + (labels[selectedService] || "layanan"))
      : (isEnglish ? "Read general terms" : "Baca ketentuan umum");
  }
  const serviceInput = document.getElementById("service-value");
  const serviceSelect = document.getElementById("service-choice");
  const modeInput = document.getElementById("mode-value");
  const form = document.getElementById("project-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  if (serviceHeading) serviceHeading.textContent = labels[service] || (isEnglish ? "General inquiry" : "Pertanyaan umum");
  if (serviceInput) serviceInput.value = service;
  if (serviceSelect) {
    serviceSelect.value = service;
    serviceSelect.addEventListener("change", function () {
      service = serviceSelect.value;
      if (serviceInput) serviceInput.value = service;
      if (serviceHeading) serviceHeading.textContent = labels[service] || (isEnglish ? "General inquiry" : "Pertanyaan umum");
      updateTermsLink(service);
    });
  }
  updateTermsLink(service);
  if (modeInput) modeInput.value = mode;

  const template = params.get("template") || "";
  const meeting = params.get("meeting") || "";
  const meetingPreference = document.getElementById("meeting-preference");
  if (meeting === "in-person" && meetingPreference) meetingPreference.value = "in-person";
  if (meeting === "in-person") {
    const context = document.getElementById("service-context");
    if (context && !context.querySelector("[data-meeting-fee]")) {
      const fee = document.createElement("p");
      fee.dataset.meetingFee = "";
      fee.className = "form-template-context";
      fee.textContent = isEnglish
        ? "In-person consultation: Rp1,000,000 per 60 minutes. Date and location must be confirmed before the meeting."
        : "Konsultasi tatap muka: Rp1.000.000 per 60 menit. Jadwal dan lokasi dikonfirmasi sebelum pertemuan.";
      context.appendChild(fee);
    }
  }
  const templateNames = { "BG-TRV-STR-001": "Bagus Sewa Mobil Bali 01 (ID: BG-TRV-STR-001)" };
  const selectedTemplateName = templateNames[template] || template;
  const modeDisplay = document.querySelector(".form-context");
  if (template && modeDisplay) {
    const tag = document.createElement("p");
    tag.className = "form-template-context";
    tag.textContent = (isEnglish ? "Selected design: " : "Desain dipilih: ") + selectedTemplateName;
    modeDisplay.appendChild(tag);
  }

  const briefField = form.elements.namedItem("brief");
  if (briefField && !briefField.value.trim()) {
    if (template) briefField.value = (isEnglish ? "Selected website design: " : "Desain website dipilih: ") + selectedTemplateName + "\n\n" +
      (isEnglish ? "Business name / brand:\nMain goal for this website:\nServices / products:\nContact / WhatsApp number:\nAddress and business hours:\nDomain / hosting status:\nPreferred launch date:\nChanges or extra features:\n\nPlease confirm scope, final price, timeline, and delivery method before work begins." :
      "Nama bisnis / brand:\nTujuan utama website:\nLayanan / produk:\nNomor kontak / WhatsApp:\nAlamat dan jam operasional:\nStatus domain / hosting:\nTarget publikasi:\nPerubahan atau fitur tambahan:\n\nMohon konfirmasi ruang lingkup, harga final, jadwal, dan cara serah terima sebelum pengerjaan dimulai.");
    if (meeting === "in-person") briefField.value += "\n\n" + (isEnglish ? "In-person consultation: Rp1,000,000 per 60 minutes. Please confirm the date, location, and fee before the meeting." : "Permintaan konsultasi tatap muka: Rp1.000.000 per 60 menit. Mohon konfirmasi jadwal, lokasi, dan biaya sebelum pertemuan.");
  }
  if (template === "sewa-mobil-bali" && briefField && !briefField.value.trim()) {
    briefField.value = isEnglish
      ? "Template selected: Sewa Mobil Bali\n\nBusiness / brand name:\nFleet and vehicle categories:\nRental prices and packages:\nService areas and pickup options:\nWhatsApp / contact details:\nPreferred colors and visual changes:\nExtra features needed (if any):\n\nPlease confirm the scope, final quote, timeline, and what is included before work begins."
      : "Template dipilih: Sewa Mobil Bali\n\nNama bisnis / brand:\nArmada dan kategori kendaraan:\nHarga sewa dan paket:\nArea layanan dan opsi penjemputan:\nWhatsApp / kontak:\nWarna dan perubahan tampilan yang diinginkan:\nFitur tambahan (jika ada):\n\nMohon konfirmasi ruang lingkup, harga final, waktu pengerjaan, dan hal yang termasuk sebelum pengerjaan dimulai.";
  }

  if (mode === "course-interest" && briefField && !briefField.value.trim()) {
    briefField.value = isEnglish
      ? "Learning goal / skill I want to develop:\nCurrent experience or starting level:\nWhat I want to be able to do after learning:\nPreferred learning method (online / offline / hybrid):\nQuestions or constraints (schedule, equipment, budget):\n\nPlease confirm course availability, curriculum, learning method, schedule, and total cost before registration."
      : "Tujuan belajar / keterampilan yang ingin dikembangkan:\nPengalaman atau kemampuan awal saat ini:\nHal yang ingin bisa saya lakukan setelah belajar:\nPreferensi metode belajar (online / offline / hybrid):\nPertanyaan atau batasan (jadwal, perangkat, anggaran):\n\nMohon konfirmasi ketersediaan course, materi, metode belajar, jadwal, dan total biaya sebelum pendaftaran.";
  }

  const courseSlug = params.get("course") || "";
  const courseNames = {
    "web-developer": "Web Developer",
    "digital-marketer": "Digital Marketer",
    "online-business": isEnglish ? "Online Business" : "Bisnis Online",
    "ui-ux-design": "UI/UX Design",
    "cloud-devops": "Cloud & DevOps",
    "data-analyst": "Data Analyst",
    "ai-automation": isEnglish ? "AI & Automation" : "AI & Otomasi",
    "iot-embedded": isEnglish ? "IoT & Embedded Systems" : "IoT & Sistem Embedded"
  };
  if (courseSlug && courseNames[courseSlug] && briefField) {
    const selectedCourse = courseNames[courseSlug];
    if (serviceHeading) serviceHeading.textContent = selectedCourse + (isEnglish ? " course inquiry" : " — pertanyaan course");
    if (!briefField.value.includes(selectedCourse)) {
      briefField.value = (isEnglish ? "Course selected: " : "Course yang dipilih: ") + selectedCourse + "\n\n" + briefField.value;
    }
    const context = document.getElementById("service-context");
    if (context && !context.querySelector("[data-course-selected]")) {
      const tag = document.createElement("p");
      tag.dataset.courseSelected = "";
      tag.className = "form-template-context";
      tag.textContent = (isEnglish ? "Selected course: " : "Course pilihan: ") + selectedCourse;
      context.appendChild(tag);
    }
  }


  const learningPathSlug = params.get("learning_path") || "";
  const learningPathNames = {
    "web-software-engineering": "Web & Software Engineering",
    "cloud-infrastructure": isEnglish ? "Cloud & Infrastructure" : "Cloud & Infrastruktur",
    "ai-engineering": "AI Engineering",
    "iot-connected-systems": isEnglish ? "IoT & Connected Systems" : "IoT & Sistem Terhubung",
    "data-automation": isEnglish ? "Data & Automation" : "Data & Otomasi"
  };
  const learningDomainSlug = params.get("learning_domain") || "";
  const learningDomainNames = {
    "digital-foundations": isEnglish ? "Digital Foundations" : "Fondasi Digital",
    "ui-ux-web-design": isEnglish ? "UI/UX & Web Design" : "UI/UX & Desain Web",
    "frontend-development": "Frontend Development",
    "programming-algorithms": isEnglish ? "Programming & Algorithms" : "Pemrograman & Algoritma",
    "backend-development": "Backend Development",
    "database-data-engineering": isEnglish ? "Database & Data Engineering" : "Database & Rekayasa Data",
    "cms-web-platforms": isEnglish ? "CMS & Web Platforms" : "CMS & Platform Web",
    "cloud-computing": "Cloud Computing",
    "devops-security": "DevOps & Security",
    "ai-machine-learning": isEnglish ? "AI & Machine Learning" : "AI & Machine Learning",
    "automation-integration": isEnglish ? "Automation & Integration" : "Otomasi & Integrasi",
    "mobile-development": isEnglish ? "Mobile Development" : "Pengembangan Mobile",
    "embedded-systems-iot": isEnglish ? "Embedded Systems & IoT" : "Sistem Embedded & IoT",
    "computer-networking": isEnglish ? "Computer & Networking" : "Komputer & Jaringan",
    "data-analysis-business-tools": isEnglish ? "Data Analysis & Business Tools" : "Analisis Data & Perangkat Bisnis",
    "graphic-design-media": isEnglish ? "Graphic Design & Media" : "Desain Grafis & Media"
  };
  const learningItemSlug = params.get("learning_item") || "";
  const learningItemNames = {
    "office-admin": isEnglish ? "Office & Computer Administration" : "Komputer Administrasi & Office",
    "excel-basic": isEnglish ? "Excel Fundamentals" : "Excel Dasar",
    "excel-intermediate": "Excel Intermediate",
    "excel-advanced": isEnglish ? "Excel Advanced & Dashboards" : "Excel Advanced & Dashboard",
    "google-sheets-basic": isEnglish ? "Google Sheets Fundamentals" : "Google Sheets Dasar",
    "google-sheets-intermediate": "Google Sheets Intermediate",
    "google-sheets-advanced": "Google Sheets Advanced",
    "powerpoint": isEnglish ? "PowerPoint & Presentations" : "PowerPoint & Presentasi",
    "powerpoint-advanced": isEnglish ? "Advanced PowerPoint" : "PowerPoint Lanjutan",
    "accounting-excel": isEnglish ? "Excel-Based Accounting" : "Akuntansi Berbasis Excel",
    "graphic-design": isEnglish ? "Graphic Design" : "Desain Grafis",
    "animation-video": isEnglish ? "Animation & Video Editing" : "Animasi & Editing Video",
    "3d-sketchup-lumion": isEnglish ? "3D Design: SketchUp & Visualisation" : "Desain 3D: SketchUp & Visualisasi",
    "autocad": "AutoCAD & Drafting",
    "photoshop": isEnglish ? "Image Editing & Photoshop" : "Pengolahan Gambar & Photoshop",
    "graphic-design-kids": isEnglish ? "Graphic Design for Children" : "Desain Grafis untuk Anak",
    "photoshop-kids": isEnglish ? "Photoshop for Children" : "Photoshop untuk Anak",
    "web-design-seo": isEnglish ? "Web Design & SEO" : "Web Design & SEO",
    "web-programming-php-ci": isEnglish ? "Web Programming: PHP & Dynamic Applications" : "Web Programming: PHP & Aplikasi Dinamis",
    "advanced-web-programming": "Advanced Web Programming",
    "wordpress-cms": "WordPress & CMS",
    "laravel-booking": isEnglish ? "Laravel & Booking Systems" : "Laravel & Sistem Booking",
    "coding-web-kids": isEnglish ? "Web Coding for Children" : "Coding Web untuk Anak",
    "seo": "Search Engine Optimisation (SEO)",
    "social-media-marketing": "Social Media Marketing",
    "internet-marketing": "Internet Marketing",
    "google-ads": "Google Ads",
    "whatsapp-marketing": "WhatsApp Marketing",
    "data-analysis-looker": "Data Analysis & Looker Studio",
    "google-apps-script": isEnglish ? "Google Apps Script & Automation" : "Google Apps Script & Otomasi",
    "excel-macro-vba": isEnglish ? "Excel Macros & VBA" : "Excel Macro & VBA",
    "computer-network-tech": isEnglish ? "Computer Technician & Networking" : "Teknisi Komputer & Jaringan",
    "computer-basics-kids": isEnglish ? "Computer Basics for Children" : "Dasar Komputer untuk Anak",
    "office-design-students": isEnglish ? "Office & Design Basics for Students" : "Office & Desain Dasar untuk Pelajar",
    "word-kids": isEnglish ? "Microsoft Word for Children" : "Microsoft Word untuk Anak",
    "excel-kids": isEnglish ? "Excel for Children" : "Excel untuk Anak",
    "cat-cpns": isEnglish ? "Computer-Based Test Literacy" : "Literasi Tes Berbasis Komputer"
  };
  const selectedLearningLabel = learningItemNames[learningItemSlug] || learningPathNames[learningPathSlug] || learningDomainNames[learningDomainSlug] || "";
  if (mode === "course-interest" && selectedLearningLabel && briefField) {
    if (serviceHeading) serviceHeading.textContent = selectedLearningLabel + (isEnglish ? " learning inquiry" : " — pertanyaan pembelajaran");
    if (!briefField.value.includes(selectedLearningLabel)) {
      briefField.value = (isEnglish ? "Selected learning goal: " : "Bidang belajar pilihan: ") + selectedLearningLabel + "\n\n" + briefField.value;
    }
    const context = document.getElementById("service-context");
    if (context && !context.querySelector("[data-learning-selection]")) {
      const tag = document.createElement("p");
      tag.dataset.learningSelection = "";
      tag.className = "form-template-context";
      tag.textContent = (isEnglish ? "Selected learning topic: " : "Topik belajar pilihan: ") + selectedLearningLabel;
      context.appendChild(tag);
    }
  }

  const recommendationPath = params.get("path") || "";
  const recommendationGoal = params.get("goal") || "";
  const recommendationLabels = {
    starter: isEnglish ? "New business" : "Bisnis baru",
    business: isEnglish ? "Established business" : "Bisnis berjalan",
    existing: isEnglish ? "Existing brand / website" : "Brand / website yang sudah ada"
  };
  const goalLabels = {
    customers: isEnglish ? "Acquire customers soon" : "Mendapatkan pelanggan dalam waktu dekat",
    organic: isEnglish ? "Build long-term organic visibility" : "Membangun visibilitas organik jangka panjang",
    allin: isEnglish ? "Comprehensive support / All-in" : "Dukungan menyeluruh / All-in",
    conversion: isEnglish ? "Improve website conversion" : "Memperbaiki konversi website",
    website: isEnglish ? "Improve existing website" : "Memperbaiki website yang ada",
    system: isEnglish ? "Add features or operational system" : "Menambah fitur atau sistem operasional",
    marketing: isEnglish ? "Assess SEO or advertising" : "Menilai SEO atau iklan"
  };
  if (recommendationPath && recommendationGoal && briefField && !briefField.value.trim()) {
    briefField.value = (isEnglish ? "Homepage recommendation: " : "Rekomendasi dari beranda: ") +
      (recommendationLabels[recommendationPath] || recommendationPath) + "\n" +
      (isEnglish ? "Goal: " : "Tujuan: ") + (goalLabels[recommendationGoal] || recommendationGoal) +
      "\n\n" + (isEnglish
        ? "Please review the business model, customer target, budget, competition, feasibility, and recommended priority order during consultation. I understand this is an initial recommendation and not a guaranteed result."
        : "Mohon tinjau model bisnis, target pelanggan, anggaran, persaingan, kelayakan, dan urutan prioritas saat konsultasi. Saya memahami bahwa ini rekomendasi awal, bukan jaminan hasil.");
    const context = document.getElementById("service-context");
    if (context && !context.querySelector("[data-recommendation-context]")) {
      const tag = document.createElement("p");
      tag.className = "form-template-context";
      tag.dataset.recommendationContext = "";
      tag.textContent = (isEnglish ? "Recommended path: " : "Jalur rekomendasi: ") + (recommendationLabels[recommendationPath] || recommendationPath) + " · " + (goalLabels[recommendationGoal] || recommendationGoal);
      context.appendChild(tag);
    }
  }


  function valueOf(name) {
    const field = form.elements.namedItem(name);
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function buildBrief() {
    const modeLabel = mode === "consultation"
      ? (isEnglish ? "Consultation" : "Konsultasi")
      : mode === "course-interest"
        ? (isEnglish ? "Course / learning path inquiry" : "Pertanyaan course / jalur belajar")
        : (isEnglish ? "Project inquiry" : "Pertanyaan proyek");
    return [
      "BagusIn — " + (isEnglish ? "Project brief" : "Ringkasan proyek"),
      "",
      (isEnglish ? "Service" : "Layanan") + ": " + (serviceHeading?.textContent.trim() || (isEnglish ? "General inquiry" : "Pertanyaan umum")),
      (isEnglish ? "Contact type" : "Jenis kebutuhan") + ": " + modeLabel,
      (isEnglish ? "Name" : "Nama") + ": " + valueOf("name"),
      "Email: " + valueOf("email"),
      (isEnglish ? "Company / brand" : "Perusahaan / brand") + ": " + (valueOf("company") || (isEnglish ? "Not provided" : "Tidak diisi")),
      (isEnglish ? "Discussion preference" : "Cara berdiskusi") + ": " + ({online: isEnglish ? "Online consultation" : "Konsultasi online", "in-person": isEnglish ? "In-person meeting" : "Janji bertemu langsung", "business-location": isEnglish ? "At business location (if feasible)" : "Di lokasi bisnis (jika memungkinkan)"}[valueOf("meeting_preference")] || (isEnglish ? "Online consultation" : "Konsultasi online")),
      (isEnglish ? "Business location / city" : "Lokasi bisnis / kota") + ": " + (valueOf("meeting_location") || (isEnglish ? "Not provided" : "Tidak diisi")),
      "",
      (isEnglish ? "Needs and context" : "Kebutuhan dan konteks") + ":",
      valueOf("brief"),
      "",
      (isEnglish ? "Terms acknowledged" : "Persetujuan ketentuan") + ": " + (form.elements.namedItem("terms")?.checked ? (isEnglish ? "Yes" : "Ya") : (isEnglish ? "No" : "Tidak"))
    ].join("\n");
  }

  function getCopyButton() {
    let button = form.querySelector("[data-copy-brief]");
    if (button) return button;
    button = document.createElement("button");
    button.type = "button";
    button.className = "button button--secondary";
    button.dataset.copyBrief = "";
    button.textContent = isEnglish ? "Copy summary" : "Salin ringkasan";
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.insertAdjacentElement("afterend", button);
    else form.appendChild(button);
    button.addEventListener("click", async function () {
      const output = form.querySelector("[data-brief-output]");
      if (!output) return;
      let copied = false;
      try {
        if (navigator.clipboard?.writeText && window.isSecureContext) {
          await navigator.clipboard.writeText(output.value);
          copied = true;
        }
      } catch (_) {}
      if (!copied) {
        output.focus();
        output.select();
        try { copied = document.execCommand("copy"); } catch (_) {}
      }
      status.textContent = copied
        ? (isEnglish ? "Summary copied. The brief has not been sent; paste it into your preferred contact channel." : "Ringkasan berhasil disalin. Brief belum terkirim; tempelkan ke kanal kontak yang Anda pilih.")
        : (isEnglish ? "Automatic copy is unavailable. The text is selected so you can copy it manually." : "Penyalinan otomatis tidak tersedia. Teks sudah dipilih agar dapat Anda salin secara manual.");
    });
    return button;
  }

  function createBriefOutput(summary) {
    let output = form.querySelector("[data-brief-output]");
    if (!output) {
      output = document.createElement("textarea");
      output.className = "form-copy-output";
      output.dataset.briefOutput = "";
      output.readOnly = true;
      output.rows = 9;
      output.setAttribute("aria-label", isEnglish ? "Prepared brief summary" : "Ringkasan brief yang disiapkan");
      status.insertAdjacentElement("afterend", output);
    }
    output.value = summary;
    output.hidden = false;
    getCopyButton();
  }

  function buildEmailPayload() {
    const modeLabel = mode === "consultation"
      ? (isEnglish ? "Consultation" : "Konsultasi")
      : (isEnglish ? "Project inquiry" : "Pertanyaan proyek");
    const serviceLabel = serviceHeading?.textContent.trim() || (isEnglish ? "General inquiry" : "Pertanyaan umum");
    const name = valueOf("name");
    const email = valueOf("email");
    const brief = valueOf("brief");
    const summary = buildBrief();
    return {
      _subject: "[BagusIn " + modeLabel + "] " + serviceLabel + " — " + name,
      _replyto: email,
      name,
      email,
      message: brief,
      _template: "table",
      _captcha: "false",
      _honey: "",
      inquiry_type: modeLabel,
      service: serviceLabel,
      service_id: service,
      mode,
      company: valueOf("company") || (isEnglish ? "Not provided" : "Tidak diisi"),
      meeting_preference: valueOf("meeting_preference") || "online",
      meeting_location: valueOf("meeting_location") || (isEnglish ? "Not provided" : "Tidak diisi"),
      project_brief: brief,
      brief_summary: summary,
      terms_acknowledged: form.elements.namedItem("terms")?.checked ? (isEnglish ? "Yes" : "Ya") : (isEnglish ? "No" : "Tidak"),
      follow_up: isEnglish
        ? "Review the brief, then follow up personally through WhatsApp. Scope, quotation, schedule, and payment are agreed manually."
        : "Tinjau brief, lalu lakukan tindak lanjut secara personal melalui WhatsApp. Scope, quotation, jadwal, dan pembayaran disepakati manual.",
      source_page: window.location.href,
      submitted_at_utc: new Date().toISOString()
    };
  }

  function showMailtoFallback(payload) {
    form.querySelector("[data-mailto-fallback]")?.remove();
    const link = document.createElement("a");
    const body = Object.entries(payload)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, value]) => key.replace(/_/g, " ").toUpperCase() + ":\n" + value)
      .join("\n\n");
    link.href = "mailto:baguskristian@gmail.com?subject=" + encodeURIComponent(payload._subject) + "&body=" + encodeURIComponent(body);
    link.className = "button button--secondary form-mailto-fallback";
    link.dataset.mailtoFallback = "";
    link.textContent = isEnglish ? "Open email app to send manually" : "Buka aplikasi email untuk mengirim manual";
    status.insertAdjacentElement("afterend", link);
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (form.dataset.submitted === "true") return;
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = isEnglish
        ? "Please complete the required fields before sending your brief."
        : "Lengkapi kolom wajib sebelum mengirim brief.";
      return;
    }

    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot?.value.trim()) return;

    const summary = buildBrief();
    createBriefOutput(summary);
    const payload = buildEmailPayload();
    const submitButton = form.querySelector('button[type="submit"]');
    form.querySelector("[data-mailto-fallback]")?.remove();
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = isEnglish ? "Sending brief…" : "Mengirim brief…";
    }
    status.textContent = isEnglish
      ? "Sending your brief to the email service. Please wait and keep this page open."
      : "Mengirim brief ke layanan email. Mohon tunggu dan jangan tutup halaman.";

    try {
      const response = await fetch("https://formsubmit.co/ajax/baguskristian@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      let result = {};
      try { result = await response.json(); } catch (_) {}
      if (!response.ok || result.success === "false" || result.success === false) {
        throw new Error(result.message || "Email service rejected the request.");
      }
      form.dataset.submitted = "true";
      if (submitButton) {
        submitButton.textContent = isEnglish ? "Brief sent" : "Brief terkirim";
        submitButton.disabled = true;
      }
      status.textContent = isEnglish
        ? "The email service accepted the request. If this is the first submission, the inbox owner must activate FormSubmit from its verification email before messages can be delivered. After activation, the brief will be reviewed and follow-up will happen personally through WhatsApp; scope, quotation, schedule, and payment are agreed manually."
        : "Permintaan pengiriman diterima layanan email. Jika ini pengiriman pertama, pemilik inbox perlu mengaktifkan FormSubmit dari email verifikasi sebelum pesan dapat diteruskan. Setelah aktif, brief akan ditinjau dan follow-up dilakukan secara personal melalui WhatsApp; scope, quotation, jadwal, dan pembayaran disepakati manual.";
    } catch (error) {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = isEnglish ? "Try sending again" : "Coba kirim lagi";
      }
      status.textContent = isEnglish
        ? "Automatic sending did not succeed. Delivery is not confirmed; use the email fallback below or copy the prepared summary."
        : "Pengiriman otomatis belum berhasil. Pengiriman belum terkonfirmasi; gunakan tautan email manual di bawah atau salin ringkasan.";
      showMailtoFallback(payload);
    }
  });
});
