document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-catalog]");
  if (!root || !window.BAGUSIN_CATALOG) return;

  const type = root.dataset.catalog;
  const items = window.BAGUSIN_CATALOG[type] || [];
  const cats = type === "copy" ? items.map(x => [x[0], x[1]]) : window.BAGUSIN_CATALOG.industries;
  const nav = root.querySelector("[data-catalog-nav]");
  const grid = root.querySelector("[data-catalog-grid]");
  const count = root.querySelector("[data-count]");
  const title = root.querySelector("[data-title]");
  if (!nav || !grid || !count || !title) return;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const slug = value => String(value).toLowerCase().trim()
    .replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Industry filters guide discovery; they must not hide published demos.
  // Map industry labels to the broader categories used by the template catalogue.
  const templateCategoryByIndustry = {
    travel: "travel",
    hospitality: "business",
    property: "business",
    food: "commerce",
    education: "business",
    health: "business",
    professional: "business",
    retail: "commerce",
    fashion: "commerce",
    finance: "business",
    automotive: "commerce",
    logistics: "business",
    construction: "business",
    manufacturing: "business",
    agriculture: "commerce",
    technology: "business",
    media: "campaign",
    events: "campaign",
    sports: "commerce",
    agency: "business",
    startup: "campaign",
    community: "business",
    local: "business",
    other: "custom"
  };

  let category = "all";
  let tier = "all";
  let availableTemplates = [];

  nav.innerHTML =
    '<button class="is-active" data-category="all" data-label="All categories">All categories <span>' +
    items.length + "</span></button>" +
    cats.map(item =>
      '<button data-category="' + esc(item[0]) + '" data-label="' + esc(item[1]) + '">' +
      esc(item[1]) + " <span>›</span></button>"
    ).join("");

  const filterBar = type === "website" ? root.querySelector("[data-tier-filter]") : null;
  if (filterBar) {
    filterBar.innerHTML = [["all", "All levels"], ["starter", "Starter"], ["business", "Business"],
      ["growth", "Growth"], ["commerce", "Commerce"], ["complex", "Complex"]]
      .map(item => '<button class="collection-filter' + (item[0] === "all" ? " is-active" : "") +
        '" data-tier="' + item[0] + '">' + item[1] + "</button>").join("");
  }

  const detailBase = type === "landing"
    ? "/bagusin/landing-pages/collections/detail/"
    : type === "website"
      ? "/bagusin/websites/collections/detail/"
      : "/bagusin/copywriting/collections/detail/";

  const render = () => {
    const planned = items.filter(item =>
      (category === "all" || item[0] === category) &&
      (tier === "all" || item[3] === tier)
    );

    const demos = type === "landing"
      ? availableTemplates
        .filter(template => template.status === "available")
        .sort((a, b) => {
          const selectedTemplateCategory = templateCategoryByIndustry[category];
          const aMatches = category === "all" || a.category === selectedTemplateCategory;
          const bMatches = category === "all" || b.category === selectedTemplateCategory;
          return Number(bMatches) - Number(aMatches) ||
            Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
            String(b.updated || "").localeCompare(String(a.updated || "")) ||
            String(a.name || "").localeCompare(String(b.name || ""), "id");
        })
      : [];

    const demoCards = demos.map(template => {
      const categoryLabel = (window.BAGUSIN_CATALOG.industries || [])
        .find(item => item[0] === template.category)?.[1] ||
        (template.category === "travel" ? "Travel & Rental" :
          template.category === "business" ? "Bisnis & Perusahaan" :
          template.category === "campaign" ? "Promosi & Kampanye" :
          template.category === "commerce" ? "Toko & Katalog" : template.category);

      return '<article class="collection-card collection-card--available">' +
        '<div class="collection-card__top"><span class="collection-card__icon" aria-hidden="true">↗</span>' +
        '<span class="collection-card__status is-ready">' +
        (template.isNew ? "Terbaru · tersedia" : "Demo tersedia") + "</span></div>" +
        "<h3>" + esc(template.name) + "</h3><p>" + esc(template.description) + "</p>" +
        '<div class="collection-card__meta"><span>' + esc(categoryLabel) + "</span><span>·</span><span>" +
        esc(template.level || "Starter") + "</span></div>" +
        '<div class="collection-card__actions"><a href="' + esc(template.demoUrl) +
        '">Buka demo ↗</a><a href="' + esc(template.orderUrl) +
        '">Paket &amp; harga →</a></div></article>';
    }).join("");

    const plannedCards = planned.map(item => {
      const ready = item[3] === "ready";
      const url = detailBase + "?collection=" + encodeURIComponent(slug(item[1])) +
        "&industry=" + encodeURIComponent(item[0]) +
        (type === "website" ? "&tier=" + encodeURIComponent(item[3]) : "");

      return '<article class="collection-card"><div class="collection-card__top">' +
        '<span class="collection-card__icon" aria-hidden="true">✦</span>' +
        '<span class="collection-card__status' + (ready ? " is-ready" : "") + '">' +
        (ready ? "Tersedia" : "Belum tersedia") + "</span></div>" +
        "<h3>" + esc(item[1]) + "</h3><p>" + esc(item[2]) + "</p>" +
        '<div class="collection-card__meta"><span>' +
        esc(type === "website" ? item[4] : item[0]) +
        "</span><span>·</span><span>Project-based</span></div>" +
        '<div class="collection-card__actions"><a href="' + url + '">Lihat detail →</a>' +
        (ready ? '<a href="' + url + '#demo">Preview demo</a>' :
          "<span>Collection sedang disiapkan</span>") + "</div></article>";
    }).join("");

    grid.innerHTML = (demoCards + plannedCards) ||
      '<div class="collection-empty" style="display:block">Belum ada collection untuk filter ini. ' +
      "Kerangka sudah siap dan collection dapat ditambahkan kapan saja.</div>";

    const total = demos.length + planned.length;
    count.textContent = total + " collection" + (total === 1 ? "" : "s");

    const active = nav.querySelector('[data-category="' + category + '"]');
    title.textContent = active ? active.dataset.label : "All categories";
    nav.querySelectorAll("button").forEach(button =>
      button.classList.toggle("is-active", button.dataset.category === category)
    );
    if (filterBar) {
      filterBar.querySelectorAll("button").forEach(button =>
        button.classList.toggle("is-active", button.dataset.tier === tier)
      );
    }
  };

  nav.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || !nav.contains(button)) return;
    category = button.dataset.category;
    tier = "all";
    render();
  });

  filterBar?.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button || !filterBar.contains(button)) return;
    tier = button.dataset.tier;
    render();
  });

  if (type === "landing") {
    fetch("/bagusin/templates/catalog.json")
      .then(response => {
        if (!response.ok) throw new Error("catalog unavailable");
        return response.json();
      })
      .then(data => {
        availableTemplates = Array.isArray(data.templates) ? data.templates : [];
        render();
      })
      .catch(() => render());
  } else {
    render();
  }
});
