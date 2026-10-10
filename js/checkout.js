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
    "seo-content": "Content Writing & SEO",
    "landing-pages": "Landing Pages & Ads",
    websites: "Websites & Complex Web",
    "web-applications": "Web Applications & Database Systems",
    "maintenance-uiux": "Maintenance, Improvement & UI/UX",
    "google-ads": "Google Ads",
    "mobile-apps": "Mobile App Development"
  };
  const params = new URLSearchParams(location.search);
  const incomingService = params.get("service") || "";
  const incomingCollection = params.get("collection") || "";
  const incomingIndustry = params.get("industry") || "";
  const incomingTier = params.get("tier") || "";
  const storageKey = "bagusin-checkout";
  const readDraft = () => {
    try { return JSON.parse(sessionStorage.getItem(storageKey) || "null"); }
    catch { return null; }
  };
  const saved = readDraft();
  const pretty = (value) => String(value || "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const label = () => serviceNames[service.value] || "Pilih layanan";

  // Restore draft first; explicit collection/service links take precedence over an old draft.
  if (saved && typeof saved === "object") {
    Object.entries(saved).forEach(([id, value]) => {
      const field = document.getElementById(id);
      if (field && field.type !== "checkbox" && typeof value === "string") field.value = value;
    });
  }
  if (incomingService && serviceNames[incomingService]) service.value = incomingService;
  const collection = incomingCollection || saved?.collection || "";
  const industry = incomingIndustry || saved?.industry || "";
  const tier = incomingTier || saved?.tier || "";

  const saveDraft = () => {
    const draft = { collection, industry, tier };
    form.querySelectorAll("input, select, textarea").forEach((field) => {
      if (field.id && field.type !== "checkbox") draft[field.id] = field.value;
    });
    try { sessionStorage.setItem(storageKey, JSON.stringify(draft)); } catch { /* Storage can be disabled. */ }
    const status = $("#aside-status");
    if (status) status.textContent = "Draft tersimpan di sesi browser";
  };

  const guidedPrompts = {
    copywriting: ["Jenis aset yang dibutuhkan", "Audiens dan brand voice", "Produk atau penawaran", "Contoh/referensi yang disukai", "Tujuan utama copy"],
    "seo-content": ["Topik dan konteks bisnis", "Target pembaca", "Search intent atau pertanyaan utama", "Topik/kata kunci target", "Website atau konten yang sudah ada"],
    "landing-pages": ["Produk atau penawaran", "Target audiens", "Tujuan konversi utama", "Materi teks dan visual", "Konteks campaign atau traffic"],
    websites: ["Jenis bisnis dan tujuan website", "Halaman/konten yang dibutuhkan", "Fitur penting", "Integrasi yang diperlukan", "Website lama jika ada"],
    "web-applications": ["Pengguna dan peran", "Alur kerja saat ini", "Data yang dikelola", "Fitur inti", "Integrasi/sistem yang sudah ada"],
    "maintenance-uiux": ["URL website atau repository", "Masalah yang ditemukan", "Prioritas perbaikan", "Hasil yang diharapkan", "Akses yang tersedia"],
    "google-ads": ["Bisnis dan lokasi target", "Tujuan campaign", "Kisaran anggaran iklan", "Website/landing page", "Tracking konversi"],
    "mobile-apps": ["Platform Android/iOS", "Pengguna dan fitur inti", "Login atau pembayaran", "Backend/data", "Notifikasi dan integrasi"]
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
    const termsLink = $("#service-terms-link");
    if (termsLink) termsLink.href = service.value ? "/bagusin/terms/?topic=" + encodeURIComponent(service.value) : "/bagusin/terms/";
    const context = $("#collection-context");
    if (context) {
      context.hidden = !collection;
      if (collection) {
        $("#collection-context-title").textContent = pretty(collection);
        $("#collection-context-meta").textContent = [industry && pretty(industry), tier && pretty(tier), "Konteks collection"].filter(Boolean).join(" · ");
        const base = service.value === "landing-pages" ? "/bagusin/landing-pages/collections/detail/" :
          service.value === "websites" ? "/bagusin/websites/collections/detail/" :
          "/bagusin/copywriting/collections/detail/";
        $("#collection-context-link").href = base + "?collection=" + encodeURIComponent(collection) +
          "&industry=" + encodeURIComponent(industry) + (tier ? "&tier=" + encodeURIComponent(tier) : "");
      }
    }
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
    if (!service.value || !name.value.trim() || !email.value.trim() || !email.validity.valid || !brief.value.trim()) {
      $("#brief-error").textContent = "Lengkapi layanan, nama, email yang valid, dan ringkasan kebutuhan sebelum melanjutkan.";
      const invalid = !service.value ? service : !name.value.trim() ? name : !email.value.trim() || !email.validity.valid ? email : brief;
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
      ["Collection", collection ? pretty(collection) : "—"],
      ["Industri", industry ? pretty(industry) : "—"],
      ["Level", tier ? pretty(tier) : "Belum ditentukan"],
      ["Nama", $("#name").value],
      ["Email", $("#email").value],
      ["Brand / perusahaan", $("#company").value || "—"],
      ["Target waktu", $("#timeline").value || "—"],
      ["Kebutuhan", $("#brief").value]
    ];
    $("#review-box").innerHTML = rows.map(([heading, value]) =>
      '<div class="review-row"><dt>' + escapeHtml(heading) + '</dt><dd>' + escapeHtml(value) + "</dd></div>"
    ).join("");
  };

  const goForward = (target) => {
    const current = Number($(".checkout-panel.is-active")?.dataset.panel || 1);
    if (target > current + 1) return; // No skipping required steps.
    if (target === 2 && !validateBrief()) return;
    if (target === 3) {
      if (!validateBrief()) return;
      renderReview();
      saveDraft();
    }
    if (target === 4) {
      if (!$("#terms-agree").checked) {
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
  service.addEventListener("change", () => { updateSummary(); updateGuidance(); saveDraft(); });
  form.addEventListener("input", saveDraft);
  $("#terms-agree").addEventListener("change", () => { $("#terms-error").textContent = ""; });

  updateSummary();
  updateGuidance();
  saveDraft();
  showStep(1);
});