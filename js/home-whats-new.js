/* Bagusin homepage: mixed "what's new" carousel.
   Add only items that are genuinely published/available. publishedAt is the public release date.
   Items expire from this homepage shelf after 30 days; newest first; never show more than 6.
   Supported types are intentionally generic: service, product, template, demo, code, app, article, course.
*/
(function () {
  "use strict";
  const root = document.querySelector("[data-whats-new]");
  if (!root) return;

  const items = [
    {
      id: "bagus-rental-mobil-002",
      type: "demo",
      title: "Bagus Rental Mobil #002",
      eyebrow: "Demo website · Rental mobil Bali",
      description: "Landing page responsif untuk rental mobil Bali, dengan informasi layanan, armada, FAQ, dan CTA WhatsApp.",
      href: "/bagusin/demos/starter/travel-rental/bagus-rental-mobil-002/",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
      imageAlt: "Demo website Bagus Rental Mobil #002 untuk rental mobil Bali",
      publishedAt: "2026-10-15"
    },
    {
      id: "hosting-guide-article",
      type: "article",
      title: "Apa Itu Hosting? Panduan Website untuk Pemula",
      eyebrow: "Panduan website · Pemula",
      description: "Pahami fungsi hosting, perbedaan domain dan hosting, pilihan untuk landing page sederhana, serta biaya yang perlu diperiksa.",
      href: "/bagusin/blog/apa-itu-hosting/",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
      imageAlt: "Perangkat server yang mewakili layanan hosting website",
      publishedAt: "2026-10-10"
    },
    {
      id: "bagus-ink-demo",
      type: "demo",
      title: "Website studio tato",
      eyebrow: "Bagus Ink · Bali Tattoo Studio",
      description: "Konsep premium dengan galeri karya, informasi studio, dan jalur kontak.",
      href: "/bagusin/demos/starter/tattoo-studio/",
      image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=900&q=80",
      imageAlt: "Contoh desain untuk studio tato",
      publishedAt: "2026-10-12"
    },
    {
      id: "sewa-mobil-bali-demo",
      type: "demo",
      title: "Website rental mobil",
      eyebrow: "Demo website · Otomotif",
      description: "Lihat contoh tampilan dan alur website untuk usaha rental mobil.",
      href: "https://baguskristiansianturi.github.io/Sewa-Mobil-Bali/",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
      imageAlt: "Mobil sebagai contoh demo website rental",
      publishedAt: "2026-10-11"
    },
  ];

  const DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const visible = items
    .filter(item => {
      const date = Date.parse(item.publishedAt + "T00:00:00");
      return item.id && item.title && item.href && Number.isFinite(date) &&
        date <= now && now < date + 30 * DAY;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 6);

  const track = root.querySelector("[data-whats-new-track]");
  const status = root.querySelector("[data-whats-new-status]");
  const prev = root.querySelector("[data-whats-new-prev]");
  const next = root.querySelector("[data-whats-new-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const typeLabels = {
    service: "Layanan baru", product: "Produk baru", template: "Template baru",
    demo: "Demo terbaru", code: "Kode & proyek", app: "Aplikasi", article: "Artikel",
    course: "Course"
  };

  if (!visible.length) {
    root.hidden = true;
    return;
  }

  track.innerHTML = visible.map(item => {
    const safe = value => String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
    const external = /^https?:\/\//i.test(item.href) && !item.href.includes("baguskristiansianturi.github.io/bagusin/");
    return `<article class="whats-new-card">
      <a class="whats-new-card__link" href="${safe(item.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>
        <span class="whats-new-card__media"><img src="${safe(item.image)}" alt="${safe(item.imageAlt || "")}" loading="lazy" width="900" height="620"><span class="whats-new-card__badge">${safe(typeLabels[item.type] || "Baru di Bagusin")}</span></span>
        <span class="whats-new-card__body"><span class="whats-new-card__eyebrow">${safe(item.eyebrow || "")}</span><strong class="whats-new-card__title">${safe(item.title)}</strong><span class="whats-new-card__description">${safe(item.description || "")}</span><span class="whats-new-card__action">Lihat selengkapnya <span aria-hidden="true">↗</span></span></span>
      </a>
    </article>`;
  }).join("");

  const cards = () => [...track.querySelectorAll(".whats-new-card")];
  const gapSize = () => {
    const style = getComputedStyle(track);
    return parseFloat(style.columnGap || style.gap) || 16;
  };
  function syncControls() {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    prev.disabled = maxScroll <= 2 || track.scrollLeft <= 2;
    next.disabled = maxScroll <= 2 || track.scrollLeft >= maxScroll - 2;
  }
  function step(direction) {
    const first = cards()[0];
    if (!first) return;
    track.scrollBy({
      left: direction * (first.getBoundingClientRect().width + gapSize()),
      behavior: reduceMotion ? "auto" : "smooth"
    });
  }
  function updateStatus() {
    const list = cards();
    if (!list.length) {
      status.textContent = "";
      syncControls();
      return;
    }
    const gap = gapSize();
    const stride = Math.max(1, list[0].getBoundingClientRect().width + gap);
    const index = Math.min(list.length, Math.floor((track.scrollLeft + gap / 2) / stride) + 1);
    status.textContent = `${index} dari ${list.length}`;
    syncControls();
  }

  // Manual controls only: avoid autoplay that cannot be paused by every touch user.
  prev.addEventListener("click", () => step(-1));
  next.addEventListener("click", () => step(1));
  track.addEventListener("scroll", updateStatus, { passive: true });
  window.addEventListener("resize", updateStatus);
  updateStatus();
})();