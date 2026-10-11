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
  fetch(base).then(response => { if (!response.ok) throw new Error("Catalog unavailable"); return response.json(); }).then(data => {
    const item = data.templates.find(entry => entry.id === id);
    if (!item) throw new Error("Template not found");
    const category = data.categories.find(entry => entry.id === item.category)?.name || item.category;
    const level = data.levels.find(entry => entry.id === item.level)?.name || item.level;
    root.querySelector("[data-detail-name]").textContent = item.name;
    root.querySelector("[data-detail-description]").textContent = item.description;
    root.querySelector("[data-detail-image]").src = item.image;
    root.querySelector("[data-detail-image]").alt = item.imageAlt || item.name;
    root.querySelector("[data-detail-tags]").innerHTML = [category, level, item.id, item.format === "one-page-website" ? "Website satu halaman" : "Landing page"].map(value => '<span class="detail-tag">'+escapeHtml(value)+'</span>').join("");
    root.querySelector("[data-detail-base-price]").textContent = money(item.price);
    setList("[data-detail-included]", item.included);
    setList("[data-detail-excluded]", item.notIncluded);
    root.querySelectorAll("[data-detail-order]").forEach(link => link.href = contactUrl("project"));
    root.querySelectorAll("[data-detail-discuss]").forEach(link => link.href = contactUrl("consultation"));
    root.querySelectorAll("[data-detail-meeting]").forEach(link => link.href = contactUrl("consultation","in-person"));
    document.title = "Detail "+item.name+" — Bagusin";
  }).catch(() => {
    root.innerHTML = '<section class="container detail-error"><h1>Detail desain belum dapat dimuat.</h1><p>Silakan kembali ke katalog atau hubungi Bagusin untuk bantuan.</p><p><a class="button button--accent" href="/bagusin/collections/">Kembali ke katalog</a> <a class="button button--secondary" href="/bagusin/contact/?service=websites&mode=consultation">Diskusi dengan Bagus</a></p></section>';
  });
})();