document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const form = $("#checkout-form");
  const service = $("#service");
  const panels = [...document.querySelectorAll("[data-panel]")];
  const steps = [...document.querySelectorAll("[data-step-nav]")];
  if (!form || !service || !panels.length) return;

  const serviceNames = {
    copywriting: "Copywriting",
    "seo-content": "Penulisan Konten & SEO",
    "landing-pages": "Landing Page & Iklan",
    websites: "Website & Web Kompleks",
    "web-applications": "Aplikasi Web & Sistem Basis Data",
    "maintenance-uiux": "Pemeliharaan, Peningkatan & UI/UX",
    "google-ads": "Google Ads",
    "mobile-apps": "Pengembangan Aplikasi Mobile"
  };
  const params = new URLSearchParams(location.search);
  const incomingService = params.get("service") || "";
  const incomingCollection = params.get("collection") || "";
  const incomingIndustry = params.get("industry") || "";
  const incomingCategory = params.get("category") || "";
  const incomingTier = params.get("tier") || "";
  const incomingQuote = params.get("quote") || "";
  const incomingTimeline = params.get("timeline") || "";
  const incomingPayment = params.get("payment") || "";
  const incomingScope = params.get("scope") || "";
  const incomingOrderRef = params.get("order_ref") || "";
  const storageKey = "bagusin-checkout";
  const readDraft = () => {
    try { return JSON.parse(sessionStorage.getItem(storageKey) || "null"); }
    catch { return null; }
  };
  const saved = readDraft();
  const pretty = (value) => String(value || "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const label = () => serviceNames[service.value] || "Pilih layanan";
  const categoryNames = { website: "Website", landing: "Landing Page", social: "Media sosial", product: "Produk", ecommerce: "E-commerce", ads: "Iklan & kampanye", email: "Email", seo: "Konten SEO", brand: "Brand", travel: "Travel & hospitality", sales: "Penjualan & proposal", ux: "UX / Microcopy", script: "Naskah video / kreator", other: "Copywriting khusus" };
  const categoryLabel = () => categoryNames[category] || pretty(category);
  const termsDetails = {
    copywriting: "Brief menentukan materi, audiens, tone of voice, jumlah aset, dan revisi. Fakta, harga, serta klaim bisnis harus diperiksa klien sebelum publikasi.",
    "seo-content": "Topik dan deliverables mengikuti brief. Ranking, trafik, leads, dan penjualan tidak dijamin; implementasi teknis dan backlink terpisah kecuali disepakati.",
    "landing-pages": "Scope menetapkan tujuan konversi, konten, CTA, dan integrasi. Pengelolaan iklan, anggaran media, tracking lanjutan, dan tool berbayar terpisah kecuali disepakati.",
    websites: "Jumlah halaman, fitur, konten, dan serah terima mengikuti paket/quotation. Domain, hosting, lisensi, booking otomatis, database, dan fitur tambahan hanya termasuk jika tertulis.",
    "web-applications": "Requirement menetapkan role, workflow, data, integrasi, dan kriteria penerimaan. Infrastruktur, migrasi data, audit keamanan, dan operasi berkelanjutan hanya termasuk jika disepakati.",
    "maintenance-uiux": "Scope mengikuti URL/repositori, daftar masalah, prioritas, dan akses. Rebuild besar, SLA, serta perbaikan layanan pihak ketiga tidak termasuk kecuali disepakati.",
    "google-ads": "Layanan ini konsultasi/persiapan dan belum tersedia untuk order langsung. Anggaran iklan terpisah; approval, biaya, konversi, dan hasil tidak dijamin.",
    "mobile-apps": "Layanan ini masih direncanakan dan belum tersedia untuk order langsung. Platform, akun developer, biaya toko aplikasi, backend, pengujian, dan maintenance perlu ditetapkan saat discovery."
  };
  const serviceConsentItems = {
    copywriting: [
      ["content-accuracy", "Saya bertanggung jawab memeriksa fakta, nama, angka, klaim, hak penggunaan materi, dan persetujuan publikasi sebelum konten digunakan."],
      ["copywriting-scope", "Jumlah naskah/aset, kanal, bahasa, tone of voice, format, dan batas revisi mengikuti brief serta quotation tertulis."]
    ],
    "seo-content": [
      ["seo-no-guarantee", "Saya memahami bahwa posisi pencarian, trafik, leads, dan penjualan tidak dapat dijamin karena bergantung pada faktor di luar kendali penyedia."],
      ["seo-scope", "Audit teknis, backlink, publikasi, implementasi website, dan tool berbayar hanya termasuk jika tercantum pada quotation."]
    ],
    "landing-pages": [
      ["landing-assets", "Saya memastikan hak penggunaan logo, gambar, teks, testimoni, dan klaim yang saya berikan; aset berlisensi atau berbayar ditanggung sesuai kesepakatan."],
      ["landing-ads", "Anggaran iklan, akun iklan, biaya platform, tracking tambahan, dan pengelolaan kampanye tidak termasuk kecuali tertulis."]
    ],
    websites: [
      ["website-scope", "Jumlah halaman, fitur, integrasi, bahasa, migrasi, dan hasil serah terima dibatasi oleh scope tertulis; fitur di luar scope memerlukan persetujuan biaya dan jadwal baru."],
      ["website-access", "Saya akan menyediakan materi, akses, keputusan, serta persetujuan yang diperlukan secara tepat waktu dan hanya membagikan akses yang relevan."],
      ["website-third-party", "Domain, hosting, lisensi, plugin, layanan pihak ketiga, serta biaya perpanjangan menjadi tanggungan sesuai rincian quotation."]
    ],
    "web-applications": [
      ["app-requirements", "Alur kerja, role pengguna, kebutuhan data, integrasi, dan kriteria penerimaan harus tertulis sebelum pengembangan dimulai."],
      ["app-data", "Saya bertanggung jawab atas dasar hak dan izin untuk data yang diberikan; migrasi, pengamanan khusus, audit, dan kepatuhan khusus hanya termasuk bila tertulis."],
      ["app-operations", "Hosting, layanan pihak ketiga, dukungan pascarilis, SLA, dan pemeliharaan berkelanjutan tidak otomatis termasuk."]
    ],
    "maintenance-uiux": [
      ["maintenance-access", "Saya menyediakan akses yang diperlukan dan menyetujui backup serta langkah pengamanan yang disepakati sebelum perubahan berisiko dilakukan."],
      ["maintenance-scope", "Pekerjaan dibatasi pada daftar perbaikan/prioritas yang disetujui; rebuild, fitur baru, dan gangguan pihak ketiga dapat memerlukan penawaran terpisah."]
    ],
    "google-ads": [
      ["ads-not-available", "Saya memahami layanan Google Ads belum tersedia untuk order langsung dan konfirmasi ini tidak membuka pemesanan atau pembayaran."]
    ],
    "mobile-apps": [
      ["mobile-not-available", "Saya memahami layanan aplikasi mobile masih direncanakan dan konfirmasi ini tidak membuka pemesanan atau pembayaran."]
    ]
  };
  const topicForService = {
    copywriting: "copywriting", "seo-content": "seo-content", "landing-pages": "landing-pages",
    websites: "websites", "web-applications": "web-applications", "maintenance-uiux": "maintenance-uiux",
    "google-ads": "google-ads", "mobile-apps": "mobile-apps"
  };

  // Restore draft first; explicit collection/service links take precedence over an old draft.
  if (saved && typeof saved === "object") {
    Object.entries(saved).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field && field.type !== "checkbox" && typeof value === "string") field.value = value;
    });
  }
  if (incomingService && serviceNames[incomingService]) service.value = incomingService;
  if (incomingQuote) $("#agreed-quote").value = incomingQuote;
  if (incomingTimeline) $("#timeline").value = incomingTimeline;
  if (incomingPayment) $("#payment-plan").value = incomingPayment;
  if (incomingScope) $("#brief").value = incomingScope;
  const explicitService = Boolean(incomingService && serviceNames[incomingService]);
  const collection = incomingCollection || (explicitService ? "" : saved?.collection || "");
  const industry = incomingIndustry || (explicitService ? "" : saved?.industry || "");
  const category = incomingCategory || (explicitService ? "" : saved?.category || "");
  const tier = incomingTier || (explicitService ? "" : saved?.tier || "");

  const saveDraft = () => {
    const draft = { collection, industry, category, tier };
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.id && field.type !== "checkbox") draft[field.id] = field.value;
    });
    try { sessionStorage.setItem(storageKey, JSON.stringify(draft)); } catch { /* Storage can be disabled. */ }
    const status = $("#aside-status");
    if (status) status.textContent = "Draft tersimpan di sesi browser";
  };

  const guidedPrompts = {
    copywriting: ["Jenis materi yang dibutuhkan", "Audiens dan gaya bahasa brand", "Produk atau penawaran", "Contoh/referensi yang disukai", "Tujuan utama tulisan"],
    "seo-content": ["Topik dan konteks bisnis", "Target pembaca", "Tujuan pencarian atau pertanyaan utama", "Topik/kata kunci target", "Website atau konten yang sudah ada"],
    "landing-pages": ["Produk atau penawaran", "Target audiens", "Tujuan konversi utama", "Materi teks dan visual", "Konteks kampanye atau pengunjung"],
    websites: ["Jenis bisnis dan tujuan website", "Halaman/konten yang dibutuhkan", "Fitur penting", "Integrasi yang diperlukan", "Website lama jika ada"],
    "web-applications": ["Pengguna dan perannya", "Alur kerja saat ini", "Data yang dikelola", "Fitur utama", "Integrasi atau sistem yang sudah ada"],
    "maintenance-uiux": ["URL website atau repositori", "Masalah yang ditemukan", "Prioritas perbaikan", "Hasil yang diharapkan", "Akses yang tersedia"],
    "google-ads": ["Bisnis dan lokasi target", "Tujuan kampanye", "Kisaran anggaran iklan", "Website atau landing page", "Pelacakan konversi"],
    "mobile-apps": ["Platform Android/iOS", "Pengguna dan fitur utama", "Login atau pembayaran", "Backend dan data", "Notifikasi dan integrasi"]
  };

  const updateGuidance = () => {
    const box = $("#guided-brief");
    if (!box) return;
    const prompts = guidedPrompts[service.value] || [];
    if (!service.value || !prompts.length) { box.hidden = true; return; }
    $("#guided-brief-title").textContent = "Panduan brief: " + label();
    $("#guided-brief-copy").textContent = "Tidak perlu menjawab semuanya di kolom brief. Gunakan poin ini untuk membantu menjelaskan kebutuhan.";
    const list = $("#guided-brief-list");
    list.replaceChildren(...prompts.map((prompt) => {
      const item = document.createElement("li");
      item.textContent = prompt;
      return item;
    }));
    box.hidden = false;
  };

  const updateSummary = () => {
    $("#aside-service").textContent = label();
    $("#terms-service").textContent = label();
    $("#aside-collection").textContent = collection ? pretty(collection) : "Belum memilih collection";
    $("#aside-tier").textContent = tier ? pretty(tier) : "Belum ditentukan";
    const categoryRow = $("#aside-category-row");
    if (categoryRow) categoryRow.hidden = !category;
    const categoryNode = $("#aside-category");
    if (categoryNode) categoryNode.textContent = category ? categoryLabel() : "—";
    const termsLink = $("#service-terms-link");
    const termsSummary = $("#terms-service-summary");
    const termsTopic = topicForService[service.value] || "";
    if (termsLink) termsLink.href = termsTopic ? "/bagusin/terms/?topic=" + encodeURIComponent(termsTopic) : "/bagusin/terms/";
    if (termsSummary) termsSummary.textContent = termsDetails[service.value] || "Pilih layanan untuk melihat ketentuan khusus. Ketentuan final mengikuti quotation dan kesepakatan tertulis.";
    const context = $("#collection-context");
    if (context) {
      context.hidden = !collection;
      if (collection) {
        $("#collection-context-title").textContent = pretty(collection);
        $("#collection-context-meta").textContent = [industry && ("Industri: " + pretty(industry)), category && ("Kategori: " + categoryLabel()), tier && ("Level: " + pretty(tier)), "Konteks demo"].filter(Boolean).join(" · ");
        const base = service.value === "landing-pages" ? "/bagusin/landing-pages/collections/detail/" :
          service.value === "websites" ? "/bagusin/websites/collections/detail/" :
          "/bagusin/copywriting/collections/detail/";
        const contextParams = new URLSearchParams();
        contextParams.set("collection", collection);
        if (industry) contextParams.set("industry", industry);
        if (category) contextParams.set("category", category);
        if (tier) contextParams.set("tier", tier);
        $("#collection-context-link").href = base + "?" + contextParams.toString();
      }
    }
  };

  const renderServiceConsents = () => {
    const host = $("#service-specific-consents");
    if (!host) return;
    const items = serviceConsentItems[service.value] || [
      ["scope-confirmation", "Saya memahami bahwa pekerjaan hanya dimulai setelah ketersediaan, ruang lingkup, biaya, jadwal, dan ketentuan khusus disepakati secara tertulis."]
    ];
    host.innerHTML = items.map(([id, text]) =>
      '<label class="terms-check terms-check--specific"><input type="checkbox" name="service_terms[]" value="' + id + '" required data-service-consent><span>' + text + '</span></label>'
    ).join("");
    host.querySelectorAll("[data-service-consent]").forEach((input) => {
      input.addEventListener("change", () => { $("#terms-error").textContent = ""; });
    });
  };
  const allTermsAccepted = () => {
    const required = [...form.querySelectorAll('[data-panel="3"] input[type="checkbox"][required]')];
    return required.length > 0 && required.every((input) => input.checked);
  };
  const showStep = (number) => {
    panels.forEach((panel) => {
      const active = Number(panel.dataset.panel) === number;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    steps.forEach((button) => {
      const step = Number(button.dataset.stepNav);
      button.classList.toggle("is-active", step === number);
      button.classList.toggle("is-complete", step < number);
      if (step === number) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    const progress = $(".checkout-progress");
    if (progress) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: progress.getBoundingClientRect().top + window.scrollY - 88, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const serviceIsAvailable = () => {
    const item = (window.BAGUSIN_SERVICE_REGISTRY?.services || []).find((entry) => entry.id === service.value);
    if (!item || item.status === "AVAILABLE") return true;
    $("#brief-error").textContent = "Layanan ini belum tersedia untuk order langsung. Silakan hubungi saya untuk membahas kebutuhan dan ketersediaan.";
    service.focus();
    return false;
  };

  const validateBrief = () => {
    if (!serviceIsAvailable()) return false;
    const name = $("#name");
    const email = $("#email");
    const brief = $("#brief");
    const timeline = $("#timeline");
    const quote = $("#agreed-quote");
    const payment = $("#payment-plan");
    if (!service.value || !name.value.trim() || !email.value.trim() || !email.validity.valid || !timeline.value.trim() || !quote.value.trim() || !payment.value.trim() || !brief.value.trim()) {
      $("#brief-error").textContent = "Lengkapi layanan, nama, email yang valid, ruang lingkup, harga yang disepakati, jadwal, dan ketentuan pembayaran.";
      const invalid = !service.value ? service : !name.value.trim() ? name : !email.value.trim() || !email.validity.valid ? email : !timeline.value.trim() ? timeline : !quote.value.trim() ? quote : !payment.value.trim() ? payment : brief;
      invalid.focus();
      return false;
    }
    $("#brief-error").textContent = "";
    saveDraft();
    return true;
  };

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"
  })[character]).replace(/\n/g, "<br>");

  const renderReview = () => {
    const rows = [
      ["Layanan", label()],
      ["Demo", collection ? pretty(collection) : "—"],
      ["Industri", industry ? pretty(industry) : "—"],
      ["Kategori", category ? categoryLabel() : "—"],
      ["Tingkat", tier ? pretty(tier) : "Belum ditentukan"],
      ["Nama", $("#name").value],
      ["Email", $("#email").value],
      ["Brand / perusahaan", $("#company").value || "—"],
      ["Jadwal pengerjaan", $("#timeline").value || "—"],
      ["Harga disepakati (Rp)", $("#agreed-quote").value || "—"],
      ["Ketentuan pembayaran", $("#payment-plan").value || "—"],
      ["Ruang lingkup dan hasil", $("#brief").value]
    ];
    $("#review-box").innerHTML = rows.map(([heading, value]) =>
      '<div class="review-row"><dt>' + escapeHtml(heading) + '</dt><dd>' + escapeHtml(value) + "</dd></div>"
    ).join("");
  };

  const goForward = (target) => {
    const current = Number($(".checkout-panel.is-active")?.dataset.panel || 1);
    if (target > current + 1) return; // No skipping required steps.
    if (target === 2) {
      if (!validateBrief()) return;
      renderReview();
      saveDraft();
    }
    if (target === 3) {
      if (!validateBrief()) return;
      saveDraft();
    }
    if (target === 4) {
      if (!allTermsAccepted()) {
        $("#terms-error").textContent = "Baca ketentuan yang relevan lalu centang persetujuan sebelum melanjutkan.";
        $("#terms-agree").focus();
        return;
      }
      $("#terms-error").textContent = "";
      saveDraft();
    }
    showStep(target);
  };

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => goForward(Number(button.dataset.next)));
  });
  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => showStep(Number(button.dataset.back)));
  });
  steps.forEach((button) => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.stepNav);
      const current = Number($(".checkout-panel.is-active")?.dataset.panel || 1);
      if (target <= current) { showStep(target); return; }
      if (target === current + 1) goForward(target);
    });
  });
  service.addEventListener("change", () => { updateSummary(); updateGuidance(); renderServiceConsents(); saveDraft(); });
  form.addEventListener("input", saveDraft);
  form.querySelectorAll('[data-panel="3"] input[type="checkbox"]').forEach((input) => input.addEventListener("change", () => { $("#terms-error").textContent = ""; }));


  const emailStatus = $("#checkout-email-status");
  const sendButton = $("#send-order-brief");
  const buildEmailPayload = () => {
    const data = {
      _subject: "[Bagusin Konfirmasi Pesanan] " + label() + " — " + $("#name").value.trim(),
      _replyto: $("#email").value.trim(),
      name: $("#name").value.trim(),
      email: $("#email").value.trim(),
      message: $("#brief").value.trim(),
      _template: "table",
      _captcha: "false",
      _honey: "",
      inquiry_type: "Order confirmation — agreed scope and terms",
      service: label(),
      service_id: service.value,
      collection: collection ? pretty(collection) : "Tidak dipilih",
      industry: industry ? pretty(industry) : "Tidak diisi",
      category: category ? categoryLabel() : "Tidak dipilih",
      tier: tier ? pretty(tier) : "Belum ditentukan",
      order_reference: incomingOrderRef || ("BG-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 8).toUpperCase()),
      agreed_quote_idr: $("#agreed-quote").value.trim(),
      payment_plan: $("#payment-plan").value.trim(),
      client_name: $("#name").value.trim(),
      client_email: $("#email").value.trim(),
      company: $("#company").value.trim() || "Tidak diisi",
      timeline: $("#timeline").value.trim() || "Tidak ditentukan",
      project_brief: $("#brief").value.trim(),
      terms_topic: topicForService[service.value] || "general",
      terms_version: "2026-10-11",
      terms_agreed_at_utc: allTermsAccepted() ? new Date().toISOString() : "",
      required_terms_accepted: [...form.querySelectorAll('[data-panel="3"] input[type="checkbox"][required]')].filter((input) => input.checked).map((input) => input.value || input.id),
      service_specific_terms_accepted: [...form.querySelectorAll("[data-service-consent]:checked")].map((input) => input.value),
      order_confirmation_consent: allTermsAccepted() ? "Ya — menyetujui semua checklist wajib untuk transaksi ini" : "Tidak",
      follow_up: "Konfirmasi pesanan diterima untuk dicatat. Kirim invoice dan instruksi pembayaran sesuai ketentuan yang telah disepakati secara personal.",
      source_page: location.href,
      submitted_at_utc: new Date().toISOString()
    };
    return data;
  };

  const showMailtoFallback = (payload) => {
    if (!emailStatus) return;
    const body = Object.entries(payload)
      .filter(([key]) => !key.startsWith("_"))
      .map(([key, value]) => key.replace(/_/g, " ").toUpperCase() + ":\n" + value)
      .join("\n\n");
    const link = document.createElement("a");
    link.href = "mailto:baguskristian@gmail.com?subject=" + encodeURIComponent(payload._subject) + "&body=" + encodeURIComponent(body);
    link.className = "button button--secondary";
    link.textContent = "Buka aplikasi email sebagai alternatif";
    emailStatus.replaceChildren();
    const message = document.createElement("p");
    message.textContent = "Pengiriman otomatis belum berhasil. Brief masih tersimpan di sesi browser; gunakan tombol ini untuk membuka aplikasi email dan kirim brief secara manual.";
    emailStatus.append(message, link);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const current = Number($(".checkout-panel.is-active")?.dataset.panel || 1);
    if (current !== 4) return;
    if (!validateBrief()) { showStep(1); return; }
    if (!allTermsAccepted()) {
      $("#terms-error").textContent = "Persetujuan ketentuan diperlukan sebelum mengirim brief.";
      showStep(3);
      $("#terms-agree").focus();
      return;
    }
    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot?.value.trim()) return;
    const payload = buildEmailPayload();
    if (!sendButton || !emailStatus) return;
    sendButton.disabled = true;
    sendButton.textContent = "Mengirim konfirmasi…";
    emailStatus.textContent = "Mengirim brief ke layanan email. Mohon tunggu dan jangan tutup halaman.";
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
      sendButton.textContent = "Konfirmasi pesanan terkirim";
      sendButton.disabled = true;
      emailStatus.textContent = "Konfirmasi pesanan " + payload.order_reference + " diterima layanan email. Jika ini pengiriman pertama, pemilik email perlu menyelesaikan aktivasi FormSubmit dari inbox sebelum pesan dapat diteruskan. Invoice dan instruksi pembayaran tetap dikirim terpisah sesuai kesepakatan. Ini bukan bukti pembayaran.";
      const status = $("#aside-status");
      if (status) status.textContent = "Pesanan dikonfirmasi · invoice menyusul";
      try { sessionStorage.removeItem(storageKey); } catch (_) {}
    } catch (error) {
      sendButton.disabled = false;
      sendButton.textContent = "Coba kirim lagi";
      emailStatus.textContent = "Pengiriman otomatis belum berhasil. Data belum dipastikan masuk ke email.";
      showMailtoFallback(payload);
    }
  });

  updateSummary();
  renderServiceConsents();
  updateGuidance();
  saveDraft();
  steps.forEach((button) => {
    if (Number(button.dataset.stepNav) === 1) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
});