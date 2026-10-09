document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const service = params.get("service") || "";
  const mode = params.get("mode") || "consultation";
  const isEnglish = document.documentElement.lang === "en";
  const labels = isEnglish ? {
    copywriting: "Copywriting",
    "seo-content": "Content Writing & SEO",
    "landing-pages": "Landing Pages & Ads",
    websites: "Websites & Complex Web",
    "web-applications": "Web Applications & Database Systems",
    "maintenance-uiux": "Maintenance, Improvement & UI/UX",
    "google-ads": "Google Ads",
    "mobile-apps": "Mobile App Development"
  } : {
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
  const serviceInput = document.getElementById("service-value");
  const modeInput = document.getElementById("mode-value");
  const form = document.getElementById("project-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  if (serviceHeading) serviceHeading.textContent = labels[service] || (isEnglish ? "General inquiry" : "Pertanyaan umum");
  if (serviceInput) serviceInput.value = service;
  if (modeInput) modeInput.value = mode;

  function valueOf(name) {
    const field = form.elements.namedItem(name);
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function buildBrief() {
    const modeLabel = mode === "consultation"
      ? (isEnglish ? "Consultation" : "Konsultasi")
      : (isEnglish ? "Project inquiry" : "Pertanyaan proyek");
    return [
      "BagusIn — " + (isEnglish ? "Project brief" : "Ringkasan proyek"),
      "",
      (isEnglish ? "Service" : "Layanan") + ": " + (serviceHeading?.textContent.trim() || (isEnglish ? "General inquiry" : "Pertanyaan umum")),
      (isEnglish ? "Contact type" : "Jenis kebutuhan") + ": " + modeLabel,
      (isEnglish ? "Name" : "Nama") + ": " + valueOf("name"),
      "Email: " + valueOf("email"),
      (isEnglish ? "Company / brand" : "Perusahaan / brand") + ": " + (valueOf("company") || (isEnglish ? "Not provided" : "Tidak diisi")),
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = isEnglish ? "Please complete the required fields before preparing the brief." : "Lengkapi kolom wajib sebelum menyiapkan brief.";
      return;
    }

    const summary = buildBrief();
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
    status.textContent = isEnglish
      ? "Your brief is prepared below. This form does not send data automatically; copy the summary and send it through your preferred contact channel."
      : "Brief sudah disiapkan di bawah. Form ini belum mengirim data otomatis; salin ringkasannya lalu kirim melalui kanal kontak yang Anda pilih.";
  });
});