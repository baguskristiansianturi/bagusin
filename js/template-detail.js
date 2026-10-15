(() => {
  const root = document.querySelector("[data-template-detail]");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("template") || "BG-TRV-STR-001";
  const base = "/bagusin/templates/catalog.json";
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[char]));
  const money = value => new Intl.NumberFormat("id-ID", {style:"currency",currency:"IDR",maximumFractionDigits:0}).format(value);
  const setList = (selector, items) => { const el = root.querySelector(selector); if (el) el.innerHTML = (items || []).map(item => "<li>"+escapeHtml(item)+"</li>").join(""); };
  const contactUrl = (mode, meeting = "") => "/bagusin/contact/?service="+encodeURIComponent(meeting === "in-person" ? "consultation" : "websites")+"&mode="+encodeURIComponent(mode)+"&template="+encodeURIComponent(id)+(meeting ? "&meeting="+encodeURIComponent(meeting) : "");

  const previewStage = root.querySelector("[data-preview-stage]");
  const previewFrame = root.querySelector("[data-template-demo]");
  root.querySelectorAll("[data-preview-mode]").forEach(button => button.addEventListener("click", () => {
    const mode = button.dataset.previewMode;
    previewStage.dataset.mode = mode;
    root.querySelectorAll("[data-preview-mode]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  }));

  fetch(base).then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); }).then(data => {
    const item = data.templates.find(entry => entry.id === id);
    if (!item) throw new Error("Template not found");
    const category = data.categories.find(entry => entry.id === item.category)?.name || item.category;
    const level = data.levels.find(entry => entry.id === item.level)?.name || item.level;
    root.querySelector("[data-detail-name]").textContent = item.name;
    root.querySelector("[data-detail-description]").textContent = item.description;
    if (previewFrame && item.demoUrl) { previewFrame.src = item.demoUrl; previewFrame.title = "Pratinjau " + item.name; }
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = item.description;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = window.location.origin + window.location.pathname + "?template=" + encodeURIComponent(id);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = item.name + " — Bagusin";
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.content = item.description;
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = item.image;
    root.querySelector("[data-detail-image]").src = item.image;
    root.querySelector("[data-detail-image]").alt = item.imageAlt || item.name;
    root.querySelector("[data-detail-tags]").innerHTML = [category, level, item.id, item.format === "one-page-company-profile" ? "Company profile satu halaman" : item.format === "one-page-website" ? "Website satu halaman" : "Landing page"].map(value => '<span class="detail-tag">'+escapeHtml(value)+'</span>').join("");
    root.querySelector("[data-detail-base-price]").textContent = money(item.price);
    setList("[data-detail-included]", item.included);
    setList("[data-detail-excluded]", item.notIncluded);
    const pricingRoot = root.querySelector("[data-detail-pricing-options]");
    if (pricingRoot) {
      const options = item.pricingOptions || [];
      options.forEach((option, index) => {
        const block = document.createElement("div");
        block.className = "detail-option";
        const heading = document.createElement("h3");
        heading.textContent = (index + 1) + ". " + option.name;
        const price = document.createElement("p");
        price.className = "detail-price";
        price.textContent = money(option.price);
        const includes = document.createElement("p");
        includes.className = "detail-muted";
        includes.textContent = option.includes || "";
        const excludes = document.createElement("p");
        excludes.className = "detail-small";
        excludes.textContent = "Belum termasuk: " + (option.excludes || "Fitur di luar cakupan yang disepakati.");
        block.append(heading, price, includes, excludes);
        pricingRoot.append(block);
      });
      if (!options.length) {
        const fallback = document.createElement("p");
        fallback.className = "detail-price";
        fallback.textContent = money(item.price);
        pricingRoot.append(fallback);
      }
    }
    root.querySelectorAll("[data-detail-order]").forEach(link => link.href = contactUrl("project"));
    root.querySelectorAll("[data-detail-discuss]").forEach(link => link.href = contactUrl("consultation"));
    root.querySelectorAll("[data-detail-meeting]").forEach(link => link.href = contactUrl("consultation","in-person"));
    document.title = "Detail "+item.name+" — Bagusin";
  }).catch(() => {
    root.innerHTML = '<section class="container detail-error"><h1>Detail desain belum dapat dimuat.</h1><p>Silakan kembali ke katalog atau hubungi Bagusin untuk bantuan.</p><p><a class="button button--accent" href="/bagusin/collections/">Kembali ke katalog</a> <a class="button button--secondary" href="/bagusin/contact/?service=websites&mode=consultation">Diskusi dengan Bagus</a></p></section>';
  });
})();