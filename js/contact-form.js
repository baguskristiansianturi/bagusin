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

  const template = params.get("template") || "";
  const briefField = form.elements.namedItem("brief");
  if (template === "sewa-mobil-bali" && briefField && !briefField.value.trim()) {
    briefField.value = isEnglish
      ? "Template selected: Sewa Mobil Bali\n\nBusiness / brand name:\nFleet and vehicle categories:\nRental prices and packages:\nService areas and pickup options:\nWhatsApp / contact details:\nPreferred colors and visual changes:\nExtra features needed (if any):\n\nPlease confirm the scope, final quote, timeline, and what is included before work begins."
      : "Template dipilih: Sewa Mobil Bali\n\nNama bisnis / brand:\nArmada dan kategori kendaraan:\nHarga sewa dan paket:\nArea layanan dan opsi penjemputan:\nWhatsApp / kontak:\nWarna dan perubahan tampilan yang diinginkan:\nFitur tambahan (jika ada):\n\nMohon konfirmasi ruang lingkup, harga final, waktu pengerjaan, dan hal yang termasuk sebelum pengerjaan dimulai.";
  }

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
