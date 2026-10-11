(() => {
  const root = document.querySelector("[data-template-preview]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("template") || "BG-TRV-STR-001";
  const $ = selector => root.querySelector(selector);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const money = value => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(Number(value) || 0);

  const frame = $("[data-preview-frame]");
  const loading = $("[data-preview-loading]");
  const device = $("[data-preview-device]");
  const workspace = $("[data-preview-workspace]");
  const modeButtons = [...root.querySelectorAll("[data-preview-mode]")];
  let loadTimer;

  function setMode(mode) {
    const mobile = mode === "mobile";
    workspace.dataset.mode = mode;
    device.classList.toggle("preview-device--mobile", mobile);
    device.classList.toggle("preview-device--desktop", !mobile);
    modeButtons.forEach(button => {
      const active = button.dataset.previewMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("[data-preview-caption]").textContent = mobile
      ? "Mode handphone · Lebar layar mobile"
      : "Mode komputer · Lebar layar desktop";
  }

  function setLink(selector, url) {
    const element = $(selector);
    if (element) element.href = url;
  }

  function showPreviewError(message) {
    clearTimeout(loadTimer);
    loading.classList.remove("is-hidden");
    loading.textContent = message;
  }

  modeButtons.forEach(button => button.addEventListener("click", () => {
    setMode(button.dataset.previewMode);
  }));

  frame.addEventListener("load", () => {
    clearTimeout(loadTimer);
    loading.classList.add("is-hidden");
  });

  async function init() {
    const response = await fetch(root.dataset.catalogUrl, { cache: "no-cache" });
    if (!response.ok) throw new Error("Katalog tidak dapat dimuat.");
    const catalog = await response.json();
    const item = catalog.templates.find(template => template.id === requestedId);
    if (!item) {
      $("[data-preview-title]").textContent = "Template tidak ditemukan";
      $("[data-preview-description]").textContent = "Template ini tidak ada di katalog. Silakan kembali ke koleksi untuk memilih desain yang tersedia.";
      $("[data-preview-id]").textContent = "TIDAK DITEMUKAN";
      showPreviewError("Template tidak ditemukan. Pilih desain lain dari koleksi.");
      return;
    }

    const category = catalog.categories.find(entry => entry.id === item.category)?.name || item.category;
    const level = catalog.levels.find(entry => entry.id === item.level)?.name || item.level;
    document.title = item.name + " — Preview Website | Bagusin";
    $("[data-preview-title]").textContent = item.name;
    $("[data-preview-kicker]").textContent = category + " · " + level;
    $("[data-preview-description]").textContent = item.description;
    $("[data-preview-id]").textContent = item.id;
    $("[data-order-name]").textContent = item.name;
    $("[data-preview-price]").textContent = money(item.price);
    $("[data-details-intro]").textContent = "Desain " +
      ((item.format === "landing-page" || item.format === "one-page-website") ? "satu halaman" : "multi-halaman") +
      " yang bisa disesuaikan dengan identitas, informasi, dan tujuan bisnis kamu.";

    $("[data-preview-features]").innerHTML = (item.included || []).map(feature =>
      '<div class="preview-feature"><span class="preview-feature__check" aria-hidden="true">✓</span><p>' +
      escapeHtml(feature) + '</p></div>'
    ).join("");

    const demoUrl = new URL(item.demoUrl, window.location.origin);
    if (demoUrl.origin !== window.location.origin) {
      showPreviewError("Demo ini tidak dapat dimuat di dalam frame. Gunakan tombol Buka demo penuh.");
      setLink("[data-preview-open]", demoUrl.href);
      return;
    }

    const orderUrl = "/bagusin/contact/?service=websites&mode=project&template=" + encodeURIComponent(item.id);
    const consultUrl = "/bagusin/contact/?service=websites&mode=consultation&template=" + encodeURIComponent(item.id);
    const customUrl = "/bagusin/contact/?service=websites&mode=custom&template=" + encodeURIComponent(item.id);
    setLink("[data-preview-open]", demoUrl.href);
    setLink("[data-preview-order]", orderUrl);
    setLink("[data-preview-consult]", consultUrl);
    setLink("[data-preview-custom]", customUrl);
    setLink("[data-preview-detail]", "#spec-title");

    // Verify the demo exists before assigning the iframe; iframe load events alone
    // cannot reliably distinguish a successful load from a failed navigation.
    const demoResponse = await fetch(demoUrl.href, { method: "GET", cache: "no-cache" });
    if (!demoResponse.ok) {
      showPreviewError("Demo belum dapat diakses. Coba buka demo penuh atau kembali lagi nanti.");
      return;
    }

    loading.textContent = "Menyiapkan preview…";
    frame.src = demoUrl.href;
    loadTimer = window.setTimeout(() => {
      showPreviewError("Preview memerlukan waktu lebih lama. Kamu bisa membuka demo penuh di tab baru.");
    }, 15000);
  }

  setMode("desktop");
  init().catch(() => {
    $("[data-preview-title]").textContent = "Preview belum tersedia";
    $("[data-preview-description]").textContent = "Katalog atau demo belum dapat dimuat. Silakan kembali ke koleksi atau hubungi Bagus.";
    showPreviewError("Preview belum dapat dimuat. Periksa koneksi atau buka kembali halaman ini.");
  });
})();